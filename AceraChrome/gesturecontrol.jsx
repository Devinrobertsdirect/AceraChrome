import React, { useEffect, useRef, useState } from 'react';
import * as handTrack from 'handtrackjs';

const App = () => {
    const [recognitionText, setRecognitionText] = useState('');
    const [mouseMode, setMouseMode] = useState(false);
    const videoRef = useRef(null);
    const [gestureModel, setGestureModel] = useState(null);

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
            const status = mouseMode ? 'ChatGPT assistance mode activated.' : 'Mouse movement mode activated.';
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

    const runGestureRecognition = () => {
        gestureModel.detect(videoRef.current).then(predictions => {
            console.log('Predictions: ', predictions);
            // Handle gesture predictions and simulate mouse actions
            requestAnimationFrame(runGestureRecognition);
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
