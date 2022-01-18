import React, {useState} from 'react';
import './LineSettings.css';

function LineSettings({scoringMethod, setScoringMethod, distanceGoals, setDistanceGoals, showDetails}) {

    const [tempDistanceGoals, setTempDistanceGoals] = useState({...distanceGoals});

    const defaultDistanceGoals = {
        platinum: 25,
        gold: 50,
        silver: 75,
        bronze: 100
    };

    function handleBoundaryChange(e) {
        
        if (e.target.id === "platinum-distance-slider" || e.target.id === "platinum-boundary-text") {
            setTempDistanceGoals({...tempDistanceGoals, platinum: e.target.value}); 
        }
        if (e.target.id === "gold-distance-slider" || e.target.id === "gold-boundary-text") {
                setTempDistanceGoals({...tempDistanceGoals, gold: e.target.value});
        }
        if (e.target.id === "silver-distance-slider" || e.target.id === "silver-boundary-text") {
                setTempDistanceGoals({...tempDistanceGoals, silver: e.target.value});
        }
        if (e.target.id === "bronze-distance-slider" || e.target.id === "bronze-boundary-text") {
                setTempDistanceGoals({...tempDistanceGoals, bronze: e.target.value});
        }
        
    }

    function applyChanges() {
        setDistanceGoals({...tempDistanceGoals});
    }

    function resetToDefaults() {
        setTempDistanceGoals(defaultDistanceGoals);
        setDistanceGoals(defaultDistanceGoals);
    }

    function handleScoringMethodChange(e) {
        setScoringMethod(e.target.value);
    }

    return (

        <div className="line-settings">
            <div className="line-setting">
                <div className="select-wrapper">
                    <label htmlFor="scoring-method-select">Scoring Method <img onClick={showDetails} src="/info.svg" alt="icon to show scoring method details" /></label>
                    <select className="settings-dropdown" value={scoringMethod} onChange={handleScoringMethodChange} id="scoring-method-select" >
                        <option value="classic">Classic</option>
                        <option value="area">Area</option>
                    </select>
                </div>
            </div>
            
            {scoringMethod === "classic" ? <>
            <div className="line-setting">
                <div className="slider-wrapper">
                    <label htmlFor="platinum-distance-slider">Platinum Boundary</label>
                    <input onChange={handleBoundaryChange} step="1" type="range" min="1" max="100" value={tempDistanceGoals.platinum} className="setting-slider" id="platinum-distance-slider" />
                </div>
                <div className="current-value-wrapper">
                    <input onChange={handleBoundaryChange} type="number" id="platinum-boundary-text" value={tempDistanceGoals.platinum} />
                    <label htmlFor="platinum-boundary-text">meters</label>
                </div>
            </div>

            <div className="line-setting">
                <div className="slider-wrapper">
                    <label htmlFor="gold-distance-slider">Gold Boundary</label>
                    <input onChange={handleBoundaryChange} step="1" type="range" min="1" max="100" value={tempDistanceGoals.gold} className="setting-slider" id="gold-distance-slider" />
                </div>
                <div className="current-value-wrapper">
                    <input onChange={handleBoundaryChange} type="number" id="gold-boundary-text" value={tempDistanceGoals.gold} />
                    <label htmlFor="gold-boundary-text">meters</label>
                </div>
            </div>

            <div className="line-setting">
                <div className="slider-wrapper">
                    <label htmlFor="silver-boundary-slider">Silver Boundary</label>
                    <input onChange={handleBoundaryChange} step="1" type="range" min="1" max="100" value={tempDistanceGoals.silver} className="setting-slider" id="silver-distance-slider" />
                </div>
                <div className="current-value-wrapper">
                    <input onChange={handleBoundaryChange} type="number" id="silver-boundary-text" value={tempDistanceGoals.silver} />
                    <label htmlFor="silver-boundary-text">meters</label>
                </div>
            </div>

            <div className="line-setting">
                <div className="slider-wrapper">
                    <label htmlFor="bronze-boundary-slider">Bronze Boundary</label>
                    <input onChange={handleBoundaryChange} step="1" type="range" min="1" max="100" value={tempDistanceGoals.bronze} className="setting-slider" id="bronze-distance-slider" />
                </div>
                <div className="current-value-wrapper">
                    <input onChange={handleBoundaryChange} type="number" id="bronze-boundary-text" value={tempDistanceGoals.bronze} />
                    <label htmlFor="bronze-boundary-text">meters</label>
                </div>
            </div>
            </> : null}

            <div className="button-wrapper">
                <button id="reset-button" onClick={resetToDefaults} className="reset-button">Reset</button>
                <button id="save-button" onClick={applyChanges} className="save-button">Recalculate</button>
            </div>
        </div>      
    )
}

export default LineSettings;
