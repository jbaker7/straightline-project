import './LineViewSettings.css';

function LineViewSettings({handleDisplayChange}) {

    return (
        <div className="line-view-options">
            <div className="display-toggle">
                <input type="checkbox" id="actualPath" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="actualPath">Actual Path</label>
            </div>

            <div className="display-toggle">
                <input type="checkbox" id="targetLine" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="targetLine">Target Line</label>
            </div>

                <div className="form-separator"></div>

            <div className="display-toggle">
                <input type="checkbox" id="platinumBoundLine" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="gold-line-toggle">Platinum Line Marker</label>
            </div>

            <div className="display-toggle">
                <input type="checkbox" id="goldBoundLine" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="gold-line-toggle">Gold Line Marker</label>
            </div>

            <div className="display-toggle">
                <input type="checkbox" id="silverBoundLine" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="silver-line-toggle">Silver Line Marker</label>
            </div>

            <div className="display-toggle">
                <input type="checkbox" id="bronzeBoundLine" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="bronze-line-toggle">Bronze Line Marker</label>
            </div>

                <div className="form-separator"></div>

            <div className="display-toggle">
                <input type="checkbox" id="pathPolygon" onChange={handleDisplayChange} defaultChecked />
                <label htmlFor="path-polygon-toggle">Highlight Path Variance</label>
            </div>
        </div>
    )
}

export default LineViewSettings;
