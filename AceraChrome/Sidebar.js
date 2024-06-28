import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Acera</h2>
            <Link to="/">Dashboard</Link>
            <Link to="/device">Device</Link>
            <Link to="/gestures">Gestures</Link>
            <Link to="/aiassist">AI Assist</Link>
            <Link to="/saved">Saved</Link>
            <Link to="/myprofile">My Profile</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/signout">Sign Out</Link>
            <Link to="/help">Help</Link>
        </div>
    );
}

export default Sidebar;
