import React from 'react';
import './WelcomePanel.css'

function WelcomePanel() {

    return (
        
        <div className="welcome-panel">
            <ul>
                <li>
                    <span className="question">Instructions: </span>
                    <span>Click the '+' icon and select a file. Once opened, your line will be analyzed and scored.</span>
                </li>
                <li>
                    <span className="question">How am I scored? </span>
                    <span>By default, the site uses the classic system (platinum through bronze). However, you can choose from various scoring systems in the settings tab. The first and last coordinates from the chosen file are used to automatically generate a target line.</span>
                </li>
                <li>
                    <span className="question">What types of files can I use? </span>
                    <span>The website supports <code>.gpx</code> files and <code>.csv</code> files. If you choose to use a CSV file, each line must have a single <code>latitude, longitude</code> coordinate.</span>
                </li>
                <li>
                    <span className="question">Privacy: </span>
                    <span>The website does not use cookies or any other types of tracking. No information from any files used are retained. All calculations and analyses are done locally in your own browser.</span>
                </li>
            </ul>
        </div>
    )
}

export default WelcomePanel;