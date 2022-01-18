import React from 'react';
import './ScoringDetails.css';

function ScoringDetails({closeDetails}) {

    return (

        <div className="scoring-details">
            <ul>
                <li>
                    <span className="score-type">Classic:</span> It's a classic for a reason. Simple scoring methods based on the largest deviation from the target line. By default, the possible scores are Platinum, Gold, Silver, and Bronze for deviations of less than 25m, 50m, 75m, and 100m respectively. Any deviation larger than 100m is not given a score.
                    <div>
                        <b>Pros:</b> Simple; multiple small deviations don't hurt score.
                    </div>
                    <div>
                        <b>Cons:</b> Not very detailed; constant deviations are not penalized.
                    </div>
                </li>
                <li>
                    <span className="score-type">Area:</span> Compares the total land area between the target line and the actual path. The penalization for a larger area of deviation increases at an exponential rate. The score is given as a percentage.
                    <div>
                        <b>Pros:</b> Evaluates every point along the line; every deviation is accounted for in some way.
                    </div>
                    <div>
                        <b>Cons:</b> Does not sufficiently penalize situations where a large deviation from the line occurs but is corrected immediately after. <i>Ex:</i> travelling 100m from the line to pass through a fence gate and then immediately returning to the line on the other side.
                    </div>
                </li>
            </ul>
            <button onClick={closeDetails} className="close-button">
                <img src="/close.svg" alt="close button icon" /> Close
            </button>
        </div>
    )
}

export default ScoringDetails;