import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';
import useLine from './useLine';
import FloatingPanel from './FloatingPanel';
import LineSettings from './LineSettings';
import MapContainer from './MapContainer';
import LineOverview from './LineOverview';
import LineViewSettings from './LineViewSettings';
import LineUpload from './LineUpload';
import ScoringDetails from './ScoringDetails';
import './MainView.css';

function MainView(props) {

    const [currentLineData, setCurrentLineData] = useState();
    const [currentLineName, setCurrentLineName] = useState();

    const [activePanel, setActivePanel] = useState("line-overview");
    const [fileUploadIsOpen, setFileUploadIsOpen] = useState(true);
    const [scoringDetailsIsOpen, setScoringDetailsIsOpen] = useState(false);
    const [showWelcomePanel, setShowWelcomePanel] = useState(true);

    const [lineLayers, setLineLayers] = useState([]);
    const [visibleLineLayers, setVisibleLineLayers] = useState(["actualPath", "targetLine", 
        "platinumBoundLine", "goldBoundLine", "silverBoundLine", "bronzeBoundLine", "pathPolygon"]);

    const [scoringMethod, setScoringMethod] = useState("classic");
    const [unitType, setUnitType] = useState("metric");
    const [distanceGoals, setDistanceGoals] = useState({
        platinum: 25,
        gold: 50,
        silver: 75,
        bronze: 100
    });

    const {actualPath, targetLine, missionInfo, scores,
        platinumBoundLine, goldBoundLine, silverBoundLine, bronzeBoundLine, pathPolygon, 
        calculateNewScore} 
        = useLine(currentLineData, unitType, distanceGoals, scoringMethod);

    const mapContainerRef = useRef();

    const standardModalStyle = {
        content: {
            borderRadius: '1rem',
            border: '1px solid #dddddddd',
            boxShadow: '5px 5px 10px #11111155',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
        overlay: {
            zIndex: 1000,
            backgroundColor: '#000000aa'
        }
    };    

    useEffect(() => {
        setScoringMethod("classic");
    }, [currentLineData])

    useEffect(() => {
        if(actualPath && targetLine && platinumBoundLine && goldBoundLine && silverBoundLine && bronzeBoundLine) {
            setLineLayers([targetLine, platinumBoundLine, goldBoundLine, silverBoundLine, bronzeBoundLine, actualPath]);
        }
    }, [actualPath, targetLine, platinumBoundLine, goldBoundLine, silverBoundLine, bronzeBoundLine])

    function handleLayersToDisplayChange(e) {

        let layerToChange = e.target.id;
        let newVisibleLayers = [...visibleLineLayers];

        const layerIndex = newVisibleLayers.findIndex(layer => layer === layerToChange);
        if (layerIndex > -1) {
            newVisibleLayers.splice(layerIndex, 1);
            mapContainerRef.current.hideLayer(layerToChange);
        } else {
            mapContainerRef.current.showLayer(layerToChange);
            newVisibleLayers.push(layerToChange);
        }
        setVisibleLineLayers(newVisibleLayers);
    }

    function activeViewHandler(panelId) {

        if (activePanel === panelId) {
            setActivePanel(null);
        } else {
            setActivePanel(panelId);
        }
    }

    return (

        <div className="main-view">
            {currentLineData ?
            <div className="view-holder">
                <FloatingPanel
                    panelId="line-overview"
                    panelName={currentLineName}
                    activePanel={activePanel} 
                    toggleView={activeViewHandler} >
                        <LineOverview
                            missionInfo={missionInfo}
                            scoringMethod={scoringMethod}
                            scores={scores}
                            openFile={() => setFileUploadIsOpen(true)} />
                </FloatingPanel>

                <FloatingPanel
                    panelId="line-view-settings"
                    panelName="View"
                    activePanel={activePanel} 
                    toggleView={activeViewHandler} >
                        <LineViewSettings
                            handleDisplayChange={handleLayersToDisplayChange} />
                </FloatingPanel>

                <FloatingPanel
                    panelId="line-score-settings"
                    panelName="Scoring"
                    activePanel={activePanel} 
                    toggleView={activeViewHandler} >
                        <LineSettings
                            distanceGoals={distanceGoals}
                            setDistanceGoals={setDistanceGoals}
                            calculateScore={calculateNewScore}
                            scoringMethod={scoringMethod}
                            setScoringMethod={setScoringMethod}
                            showDetails={() => setScoringDetailsIsOpen(true)} />
                </FloatingPanel>
            </div>
            : null }
            
            <MapContainer
                ref={mapContainerRef}
                lineLayers={lineLayers} 
                pathPolygon={pathPolygon}
                maximumDeviation={missionInfo.maximumDeviation} />

            <Modal
                isOpen={fileUploadIsOpen}
                style={standardModalStyle}
                ariaHideApp={false}
                onRequestClose={() => setFileUploadIsOpen(false)}
                onAfterClose={() => setShowWelcomePanel(false)}
                shouldCloseOnOverlayClick={!showWelcomePanel}
                contentLabel="File Upload Modal" >
                    <LineUpload
                        closeModal={() => setFileUploadIsOpen(false)}
                        setNewFile={setCurrentLineData}
                        setNewLineName={setCurrentLineName}
                        showWelcomePanel={showWelcomePanel} />
            </Modal>

            <Modal
                isOpen={scoringDetailsIsOpen}
                style={standardModalStyle}
                onRequestClose={() => setScoringDetailsIsOpen(false)}
                ariaHideApp={false}
                shouldCloseOnOverlayClick={true}
                contentLabel="Scoring Details Modal" >
                    <ScoringDetails
                        closeDetails={() => setScoringDetailsIsOpen(false)} />
            </Modal>

        </div>
    )   
}

export default MainView;