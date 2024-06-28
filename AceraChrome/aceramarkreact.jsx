import React, { useEffect, useRef, useState } from 'react';
import * as handTrack from 'handtrackjs';

const App = () => {
    const [recognitionText, setRecognitionText] = useState('');
    const [mouseMode, setMouseMode] = useState(false);
    const videoRef = useRef(null);
    const [gestureModel, setGestureModel] = useState(null);
    const mouseModeRef = useRef(mouseMode);

    useEffect(() => {
        // Initialize handTrack model
        handTrack.load().then(model => {
            setGestureModel(model);
        });

        // Setup Web Speech API
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const lastResult = event.results[event.results.length - 1];
            const text = lastResult[0].transcript.trim();
            console.log('Recognized text:', text);

            const improvedText = improveRecognition(text);
            setRecognitionText(improvedText);

            if (improvedText.toLowerCase().includes('acera')) {
                const userInput = improvedText.replace(/\bacera\b/i, '').trim().toLowerCase();
                handleUserInput(userInput);
            }
        };

        recognition.start();

        return () => {
            recognition.stop();
        };
    }, []);

    const improveRecognition = (text) => {
        const corrections = {
            "aacera": "Acera",
            "ascerra": "Acera",
            "acerra": "Acera",
            "asara": "Acera",
            "sarah": "Acera",
            "sara": "Acera",
            "sera": "Acera",
            "serah": "Acera",
            "asera": "Acera",
            "aserah": "Acera",
            "asura": "Acera",
            "ahsara": "Acera",
        };
        const pattern = new RegExp(Object.keys(corrections).join('|'), 'gi');
        return text.replace(pattern, (matched) => corrections[matched.toLowerCase()]);
    };

    const handleUserInput = (input) => {
        if (input.includes('mouse')) {
            setMouseMode(!mouseMode);
            mouseModeRef.current = !mouseMode;
            const status = !mouseMode ? 'Mouse movement mode activated.' : 'ChatGPT assistance mode activated.';
            console.log(status);
            if (!mouseMode) {
                startGestureRecognition();
            }
        } else {
            console.log('User:', input);
        }
    };

    const startGestureRecognition = () => {
        if (gestureModel) {
            handTrack.startVideo(videoRef.current).then((status) => {
                if (status) {
                    runGestureRecognition();
                }
            });
        }
    };

    const executeGestureAction = (gesture) => {
        switch (gesture) {
            case "click":
                console.log("Mouse clicked");
                break;
            case "double_click":
                console.log("Mouse double clicked");
                break;
            case "right_click":
                console.log("Mouse right clicked");
                break;
            case "swipe_left":
                console.log("Swiped left");
                break;
            case "swipe_right":
                console.log("Swiped right");
                break;
            case "scroll_up":
                console.log("Scrolled up");
                break;
            case "scroll_down":
                console.log("Scrolled down");
                break;
            case "zoom_in":
                console.log("Zoomed in");
                break;
            case "zoom_out":
                console.log("Zoomed out");
                break;
            case "move":
                console.log("Mouse moved");
                break;
            default:
                console.log("Unknown gesture");
                break;
        }
    };

    const runGestureRecognition = () => {
        if (!gestureModel) return;
        gestureModel.detect(videoRef.current).then(predictions => {
            predictions.forEach(prediction => {
                if (prediction.label) {
                    executeGestureAction(prediction.label);
                }
            });
            if (mouseModeRef.current) {
                requestAnimationFrame(runGestureRecognition);
            }
        });
    };

    return (
        <div className="App">
            <h1>Gesture Control and Voice Recognition</h1>
            <video ref={videoRef} style={{ display: 'none' }} />
            <p>Recognition Text: {recognitionText}</p>
            <button onClick={startGestureRecognition}>Start Gesture Recognition</button>
        </div>
    );
};

export default App;
6