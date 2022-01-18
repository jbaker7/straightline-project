import React, {useState, useRef} from 'react';
import './LineUpload.css';
import Papa from 'papaparse';
import WelcomePanel from './WelcomePanel';
let gpxParser = require('gpxparser');

function LineUpload({setNewFile, setNewLineName, closeModal, showWelcomePanel}) {

    const reader = new FileReader();
    const gpx = new gpxParser();

    const fileSelect = useRef();

    const [fileSelected, setFileSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const [tempFileName, setTempFileName] = useState("");
    const [newTracks, setNewTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(0);

    function handleNameChange(e) {
        setTempFileName(e.target.value)
    }

    function handleFileSelect(e) {

        let lineFile = e.target.files[0];
        setFileSelected(true);
        
         if (lineFile) {
            setErrors("");
            const lineFileExtension = lineFile.name.substring(lineFile.name.lastIndexOf('.') + 1);
            const lineFileName = lineFile.name.substring(0, lineFile.name.lastIndexOf('.'));
            reader.readAsText(e.target.files[0]);

            reader.onloadstart = function() {setIsLoading(true);}

            reader.onload = function() {
                switch(lineFileExtension) {
                    case "gpx":
                        parseGpxFile(reader.result, lineFileName);
                        break;
                    case "csv":
                        parseCsvFile(reader.result, lineFileName);
                        break;
                    default:
                        setErrors("Unsupported file type.");
                        setIsLoading(false);
                        break;
                }
            }
        }
    }

    function parseGpxFile(file, fileName) {

        gpx.parse(file);
        if (gpx.tracks.length > 0) {
            let tempTracks = [];
            gpx.tracks.forEach(track => {
                let linePoints = track.points.map(element => {
                    return [element.lon, element.lat];
                });
                tempTracks.push(linePoints);
            });
            setNewTracks(tempTracks);
            
            if(gpx.metadata.name) {
                setTempFileName(gpx.metadata.name)
            } else if (gpx.tracks.length === 1 && gpx.tracks[0].name) {
                setTempFileName(gpx.tracks[0].name);
            } else {
                setTempFileName(fileName);
            }
        }
        else {
            setTempFileName("");
            setErrors("No valid tracks found.");
        }
        setIsLoading(false);
    }

    function parseCsvFile(file, fileName) {
        
        Papa.parse(file, {
            dynamicTyping: true,
            complete: function(results) {
                if (results.data){
                    setNewTracks([correctCsvCoords(results.data)]);
                    setTempFileName(fileName);
                } else {
                    setTempFileName("");
                    setErrors(results.errors.reduce((previous, current) => {return `${previous}\n•${current}`}));
                }
                setIsLoading(false);
            }
        })
    }

    function correctCsvCoords(coordArray) {
        let correctedCoords = coordArray.map(coords => {return [coords[1], coords[0]]});
        return correctedCoords;
    }

    function handleTrackSelection(e) {
        setSelectedTrack(e.target.value);
    }

    function handleSubmitButton(e) {

        e.preventDefault();
        if(newTracks) {
            setNewFile(newTracks[selectedTrack]);
            setNewLineName(tempFileName);
            closeModal();
        }
    }

    return (

        <div className="file-upload-panel">
            
            <div className="file-selector">
                <button className="file-load-button loading" onClick={e => fileSelect.current && fileSelect.current.click()}>
                    {!isLoading ? <img className="plus-icon" src="/plus.svg" alt="load file button icon" /> :
                     <img className="loading-spinner" src="/loading.svg" alt="loading spinner icon" />}
                    Click to load new file
                </button>
                <input accept=".gpx, .csv" ref={fileSelect} onChange={handleFileSelect} type="file" hidden></input>
                
                {fileSelected &&
                <>
                <div className="filename-wrapper">
                    <label htmlFor="temp-filename">Name</label>
                    <input value={tempFileName} onChange={handleNameChange} id="temp-filename" type="text" />
                
                    {newTracks.length > 1 ?
                        <div className="dropdown-wrapper">
                            <label htmlFor="gpx-track-dropdown">Multiple tracks found, select one:</label>
                            <select className="track-dropdown" value={selectedTrack} onChange={handleTrackSelection} id="gpx-track-select" >
                                {newTracks.map((track, index) => {
                                    return <option value={index} key={index}>{track.name ? track.name : `Untitled Track ${index + 1}`}</option>
                                })}
                            </select>
                        </div>
                    : null}
                </div>
                {errors.length > 0 &&
                    <div className="errors">
                        {errors}
                    </div>
                }
                
                <button onClick={handleSubmitButton} disabled={errors.length > 0 ? true : false} className="submit-button">
                    Open
                </button>
                </>
                }
            </div>

            {showWelcomePanel &&
                <WelcomePanel />
            }
            
            
        </div>
    )
}

export default LineUpload;