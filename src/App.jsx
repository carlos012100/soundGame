import {useState, useEffect, useRef} from 'react';
import useSound from 'use-sound';
import simon from './assets/sounds/sprite.mp3';
import azul from './assets/images/azul.png';
import bloodRed from './assets/images/bloodRed.png';
import green from './assets/images/green.png';
import yellow from './assets/images/yellow.png';
import darksouls from './assets/sounds/darksouls.mp3';
import dead from './assets/sounds/dead.mp3'


import './App.css';

function App()
{
    const blueRef = useRef(null);
    const yellowRef = useRef(null);
    const greenRef = useRef(null);
    const redRef = useRef(null);
   
   const [play] = useSound(simon, {
    sprite: {
        one: [0, 500],
        two: [1000, 500],
        three: [2000, 500],
        four: [3000, 500],
        error: [4000, 1000],
    },
   });
   const colors = [
    {
        image: yellow,
        ref: yellowRef,
        sound: 'one'
    },
    {
        image: azul,
        ref: blueRef,
        sound: 'two'
    },
    {
        image: bloodRed,
        ref: redRef,
        sound: 'three'
    },
    {
        image: green,
        ref: greenRef,
        sound: 'four'
    }
   ];
    //background music hook
    const [playBg, { stop, isPlaying }] = useSound(darksouls, 
    {
        loop: true,    
        volume: 0.3,     
    });
   const minNumber = 0;
   const maxNumber = 3;
   const speedGame = 400;

   const [sequence, setSequence] = useState([]);
   const [currentGame, setCurrentGame] = useState([]);
   const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
   const [speed, setSpeed] = useState(speedGame);
   const [turn, setTurn] = useState(0);
   const [pulses, setPulses] = useState(0);
   const [success, setSuccess] = useState(0);
   const [isGameOn, setIsGameOn] = useState(false);
   const [background, setBackground] = useState('./hechizero.png');
   const [isGreeting,setIsGreeting] = useState(false);
   const [gameOver, setGameOver] = useState(false);
   const [message, setMessage] = useState("");
   const isPlayerSequenceComplete = () => currentGame.length === sequence.length;
   const gameOverAudioRef = useRef(null);





   const setGameBackground = () => setBackground("./tabla.png");
    const setDefaultBackground = () => setBackground("./hechizero.png");
    const setGameOverBackground = () => setBackground("./houseFire.png")

   
    const initGame = () => {
    setGameBackground(); // Explicitly set to tabla.png
    setGameOver(false);  // Clear the game over state
    setIsGameOn(true);
    setIsGreeting(true);
}
    useEffect(() => {
    if (isGreeting) {
    const timer = setTimeout(() => {
        setIsGreeting(false);  
        randomNumber();        
    }, 3000);

    return () => clearTimeout(timer); // Cleaninig up just to tested out, and for safety reasons!
    }
    }, [isGreeting]);


    const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    setSequence([...sequence, randomNumber]);

    setTurn(turn + 1);
    }
    const handleClick = (index) => {
        if(isAllowedToPlay){
            play({id: colors[index].sound});
            colors[index].ref.current.style.filter = "brightness(2)";
            colors[index].ref.current.style.scale=(0.9);
            setTimeout(() => {
                colors[index].ref.current.style.filter = "brightness(1)";
                colors[index].ref.current.style.scale=(1);
                setCurrentGame([...currentGame, index]);
                setPulses(pulses + 1);
            }, speed / 2);
        }
    }

    //useEffect for background music, depending if its gameover or still playing (not working properly)
        useEffect(() => {
        if (isGameOn && !isPlaying) {
            playBg(); 
        }
        }, [isGameOn]); 

        useEffect(() => {
        if (gameOver) stop();
        }, [gameOver]);

        useEffect(() => {
          console.log("Background changed to:", background);

        document.body.style.backgroundImage = `url(${background})`;
        }, [background]);

    // const changeBackground = () => {
    //     setBackground(prev => (prev === "./public/hechizero.png" ? "./public/tabla.png" : "./public/hechizero.png")); 
    //     };
    //         useEffect(() => {
    //         if (pulses > 0) {
    //             if (Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])) {
    //             setSuccess(success + 1);

    //             // Show success message temporarily
    //             setMessage("Success!");
    //             setTimeout(() => setMessage(""), 1000); // disappears after 1 second

    //         } else {
    //             const index = sequence[pulses - 1];
    //             if (index !== undefined) colors[index].ref.current.style.filter = "brightness(2)";
    //             play({ id: 'error' });

    //             setMessage("Failure!");
    //             setTimeout(() => setMessage(""), 1500); // disappears after 1.5 seconds

    //             setTimeout(() => {
    //                 if (index !== undefined) colors[index].ref.current.style.filter = "brightness(1)";
    //                 setGameOverBackground();
    //                 setGameOver(true);
    //                 setIsGameOn(false);
    //             }, speed * 2);

    //             setIsAllowedToPlay(false);
    //         }
    //     }
    // }, [pulses]);
    
    //The Feedback message is after the sequence and playe input

        useEffect(() => {
        if (isPlayerSequenceComplete() && sequence.length > 0) {
            let failed = false;

            for (let i = 0; i < sequence.length; i++) {
            if (sequence[i] !== currentGame[i]) {
                failed = true;
                break;
            }
            }

            if (failed) {
            play({ id: 'error' });
            setMessage("Failure!");
            setTimeout(() => setMessage(""), 1500);

            setTimeout(() => {
                setGameOverBackground();
                setGameOver(true);
                setIsGameOn(false);
            }, speed * 2);

            setIsAllowedToPlay(false);
            } else {
            setMessage("Success!");
            setTimeout(() => setMessage(""), 1000);

            setTimeout(() => {
                setSuccess(0);
                setPulses(0);
                setCurrentGame([]);
                randomNumber();
            }, 500);
            }
        }
        }, [currentGame]);



    useEffect(() => {
        if (!isGameOn && !gameOver) {
            setSequence([]);
            setCurrentGame([]);
            setIsAllowedToPlay(false);
            setSpeed(speedGame);
            setTurn(0);
            setPulses(0);
            setSuccess(0);
            setDefaultBackground();
    }
    }, [isGameOn, gameOver]);


    useEffect(() => {
        if(success === sequence.length && success >0){
            setSpeed(speed - sequence.length * 2);
            setTimeout(() => {
                setSuccess(0);
                setPulses(0);
                setCurrentGame([]);
                randomNumber();
            }, 500);
        }

    }, [success])

    // useEffect(() => {
    //     if(!isAllowedToPlay){
    //         sequence.map((item, index) => {
    //             setTimeout(() => {
    //                 play({id: colors[item].sound});
    //                 colors[item].ref.current.style.filter = "brightness(2)";
    //                 setTimeout(() => {
    //                     colors[item].ref.current.style.filter = "brightness(1)";
    //                 }, speed / 2);
    //             }, index * speed)
    //         })
    //     }
    //     setIsAllowedToPlay(true);

    // }, [sequence])

    useEffect(() => {
  if (sequence.length > 0) {
    setIsAllowedToPlay(false); 

    sequence.forEach((item, index) => {
      setTimeout(() => {
        play({ id: colors[item].sound });
        colors[item].ref.current.style.filter = "brightness(2)";
        setTimeout(() => {
          colors[item].ref.current.style.filter = "brightness(1)";
        }, speed / 2);
      }, index * speed);
    });

    const totalTime = sequence.length * speed;
    setTimeout(() => {
      setIsAllowedToPlay(true); 
    }, totalTime);
  }
}, [sequence]);
useEffect(() => {
  if (gameOver && gameOverAudioRef.current) {
    gameOverAudioRef.current.currentTime = 0;
    gameOverAudioRef.current.play();
  }
}, [gameOver]);

    

return (
  <>
  <audio ref={gameOverAudioRef} src={dead} volume={1} />


    {gameOver ? (
        
      <div className="game-over">
     <h2 className="game-over-title">Game Over!</h2>
    <p className="game-over-died">You Died.</p>
    <p className="game-over-try">Try again...</p>
       
        <button
        className='game-over-button'
          onClick={() => {
            setGameOver(false); 
          }}
        >
          OK
        </button>
      </div>
    ) : isGameOn ? (
      <>
        <div className="header">
          {!isGreeting && <h2>Attempts: {turn}</h2>}
        </div>

        {isGreeting && (
          <div className="intro">
            <h3>Go Ahead. Help Yourself.</h3>
          </div>
        )}
        {isGameOn && message && (
    <div className="feedback-message">
        <h3>{message}</h3>
        </div>
        )}

        <div className="container">
          {colors.map((item, index) => (
            <img
              key={index}
              ref={item.ref}
              src={item.image}
              className={`pad pad-${index}`}
              style={{
                filter: "brightness(1)",
                transition: "filter 0.2s, transform 0.2s",
                pointerEvents: isAllowedToPlay ? "auto" : "none", 
              }}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </>
    ) : (
      <>
        <div className="header">
          <h1>Welcome to Simon's Chamber</h1>
        </div>
        <button onClick={initGame}>Start</button>
      </>
    )}
  </>
);
}

export default App;