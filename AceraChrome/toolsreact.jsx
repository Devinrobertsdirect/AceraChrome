import React from 'react';
import pyautogui from 'pyautogui';

// Function to get screen size using window.screen
const getScreenSize = () => {
    const { width, height } = window.screen;
    return { width, height };
};

// Function to move the mouse to absolute coordinates
const moveMouse = (x, y) => {
    pyautogui.moveTo(x, y);
};

// Function to click the mouse
const clickMouse = () => {
    pyautogui.click();
};

// Function to scroll the mouse
const scrollMouse = (direction) => {
    if (direction === 'up') {
        pyautogui.scroll(10);
    } else if (direction === 'down') {
        pyautogui.scroll(-10);
    }
};

// Function to parse and execute commands
const parseCommand = (command) => {
    switch (command) {
        case 'print':
            console.log('Hello World!');
            console.log('Exiting program');
            break;
        case 'move_mouse_up':
            pyautogui.moveRel(0, -500); // Move mouse up by 500 pixels
            console.log('Moved mouse up');
            break;
        case 'move_mouse_down':
            pyautogui.moveRel(0, 500); // Move mouse down by 500 pixels
            console.log('Moved mouse down');
            break;
        case 'move_mouse_left':
            pyautogui.moveRel(-500, 0); // Move mouse left by 500 pixels
            console.log('Moved mouse left');
            break;
        case 'move_mouse_right':
            pyautogui.moveRel(500, 0); // Move mouse right by 500 pixels
            console.log('Moved mouse right');
            break;
        default:
            console.log('Invalid command');
    }
};

const App = () => {
    const handlePrintCommand = () => {
        parseCommand('print');
    };

    const handleMouseUpCommand = () => {
        parseCommand('move_mouse_up');
    };

    const handleMouseDownCommand = () => {
        parseCommand('move_mouse_down');
    };

    const handleMouseLeftCommand = () => {
        parseCommand('move_mouse_left');
    };

    const handleMouseRightCommand = () => {
        parseCommand('move_mouse_right');
    };

    return (
        <div>
            <h1>Mouse Control</h1>
            <button onClick={handlePrintCommand}>Print</button>
            <button onClick={handleMouseUpCommand}>Move Mouse Up</button>
            <button onClick={handleMouseDownCommand}>Move Mouse Down</button>
            <button onClick={handleMouseLeftCommand}>Move Mouse Left</button>
            <button onClick={handleMouseRightCommand}>Move Mouse Right</button>
        </div>
    );
};

export default App;