import React, {useRef} from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import './FloatingPanel.css';

function FloatingPanel({panelId, panelName, activePanel, toggleView, children}) {

    const simpleBarRef = useRef();

    return (
        
        <div className={`floating-panel ${activePanel === panelId ? "show" : "hide"}`}>
            <div className="header-wrapper" id={panelId} onClick={() => {toggleView(panelId)}}>
                <h2>{panelName}</h2>
                <img src="/chevron-down.svg" alt="" />
            </div>

            <SimpleBar ref={simpleBarRef} className={`scroll-container ${activePanel === panelId ? "show" : "hide"}`}>
                {children}
            </SimpleBar>
        </div>
    )
}

export default FloatingPanel;