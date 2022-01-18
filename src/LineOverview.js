import React from 'react';
import './LineOverview.css';

function LineOverview({missionInfo, scoringMethod, scores, openFile}) {

    let circleColor = "#ac0c0c";
    if (scores[scoringMethod] > 20 && scores[scoringMethod] < 70) {
        circleColor = "#f3e411";
    }
    if (scores[scoringMethod] >= 70) {
        circleColor = "#05a829";
    }

    function formatDistance(distance) {
        let formattedDistance;
        if (distance > 1000) {
            formattedDistance = (distance / 1000).toFixed(2);
        } else {
            formattedDistance = distance.toFixed(2);
        }
        return formattedDistance;
    }

    return (
        
        <div className="line-overview">
            <button onClick={openFile} className="new-file-button"><img src="/open.svg" alt="file open button icon" />Open new file</button>
            {!scores[scoringMethod] ? 
                <button className="calculate-button">
                    Calculate Score
                </button>
                :
            <div className="line-score">
                <div>
                    <h3>Score</h3>
                    <div className="score-text">
                        {scoringMethod === "classic" ?
                        scores[scoringMethod] :
                        `${scores[scoringMethod]}%`}
                    </div>
                </div>
                {scoringMethod !== "classic" ?
                <svg viewBox="0 0 36 36" className="score-graph">
                    <path className="circle-bg" d="M18 2
                        a 15.9 15.9 0 0 1 0 31.8
                        a 15.9 15.9 0 0 1 0 -31.8" />
                    <path className="circle" style={{stroke: circleColor}} 
                    strokeDasharray={`${scores[scoringMethod]}, 100`}
                        d="M18 2 
                        a 15.9 15.9 0 0 1 0 31.8
                        a 15.9 15.9 0 0 1 0 -31.8" />
                </svg>
                :
                <img src={`./${scores[scoringMethod]}.svg`} alt={`${scores[scoringMethod]} score rank icon`} />
                }
            </div> }

            <div className="distance-container">
                <div className="distance">
                    <h3>Target Distance</h3>
                    <img src="/straight-line.svg" alt="" />
                    <span>{missionInfo.targetLineDistance ? formatDistance(missionInfo.targetLineDistance) : "..."}</span> 
                    <div className="unit-type">{missionInfo.targetLineDistance > 1000 ? "Kilometers" : "Meters"}</div>
                    
                </div>
                <div className="distance">
                    <h3>Actual Distance</h3>
                    <img src="/not-straight-line.svg" alt="" />
                    <span>{missionInfo.actualPathDistance ? formatDistance(missionInfo.actualPathDistance) : " "}</span> 
                    <div className="unit-type">{missionInfo.actualPathDistance > 1000 ? "Kilometers" : "Meters"}</div>
                </div>
                <div className="distance">
                    <h3>Maximum Deviation</h3>
                    <img src="/line-deviation.svg" alt="" />
                    <span>{missionInfo.maximumDeviation ? formatDistance(missionInfo.maximumDeviation) : " "}</span> 
                    <div className="unit-type">{missionInfo.maximumDeviation > 1000 ? "Kilometers" : "Meters"}</div>
                </div>

            </div>
        </div>
    )
}

export default LineOverview;
