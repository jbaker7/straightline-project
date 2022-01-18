import {useEffect, useState} from 'react';
import * as turf from '@turf/turf';

export default function useLine(newLine, unitType, distanceGoals, scoringMethod) {

    const [lineData, setLineData] = useState([]);
    const [actualPath, setActualPath] = useState();
    const [targetLine, setTargetLine] = useState();
    const [platinumBoundLine, setPlatinumBoundLine] = useState();
    const [goldBoundLine, setGoldBoundLine] = useState();
    const [silverBoundLine, setSilverBoundLine] = useState();
    const [bronzeBoundLine, setBronzeBoundLine] = useState();
    const [pathPolygon, setPathPolygon] = useState();
    const [missionInfo, setMissionInfo] = useState({actualPathDistance: 0, 
                                                    targetLineDistance: 0, 
                                                    maximumDeviation: 0
                                                    })

    const [scores, setScores] = useState({classic: null,
                                        area: null
                                        })

    const [targetLineBearing, setTargetLineBearing] = useState();

    useEffect(() =>{
        if(newLine) {
            setScores({classic: null,
                area: null
                });
        
            let initialActualPath = turf.featureCollection([turf.lineString(newLine)], {id: "actualPath"});
                initialActualPath.features[0]["id"] = "actualPath";
            let initialActualPathDistance = turf.length(initialActualPath.features[0], {units: "meters"});
        
    //When viewing a line with only two points in openlayers, openlayers does not project it properly to account
    //for earth curvature, breaking it down into smaller points fixes that issue.
            let complexInitialTargetLine = turf.lineChunk(turf.lineString([newLine[0], newLine[newLine.length-1]], {id: 'targetLine'}), 10, {units: "meters"});
            let initialTargetLineSimplifiedCoords = []
            turf.featureEach(complexInitialTargetLine, function (currentFeature, featureIndex) {
                if(featureIndex === 0) {
                    initialTargetLineSimplifiedCoords.push(currentFeature.geometry.coordinates[0])
                }
                initialTargetLineSimplifiedCoords.push(currentFeature.geometry.coordinates[1])
            });

            let initialTargetLine = turf.featureCollection([turf.lineString(initialTargetLineSimplifiedCoords)])
                initialTargetLine.id = "targetLine";
                initialTargetLine.features[0].id = "targetLine";
            let initialTargetLineDistance = turf.length(initialTargetLine.features[0], {units: "meters"});
            
            let initialTargetLineBearing = turf.bearing(initialTargetLineSimplifiedCoords[0], initialTargetLineSimplifiedCoords[initialTargetLineSimplifiedCoords.length - 1]);
            let initialMaxDeviation = findMaxDeviation(newLine, initialTargetLine);
            calculateClassicScore(initialMaxDeviation);

            setLineData(newLine);
            setActualPath(initialActualPath);
            setTargetLine(initialTargetLine);
            setMissionInfo({...missionInfo, 
                actualPathDistance: initialActualPathDistance, 
                targetLineDistance: initialTargetLineDistance,
                maximumDeviation: initialMaxDeviation})
        
            setTargetLineBearing(initialTargetLineBearing);

            setPlatinumBoundLine(createLineOffsets(initialTargetLine,
                initialTargetLineBearing, distanceGoals.platinum, "platinumBoundLine"));

            setGoldBoundLine(createLineOffsets(initialTargetLine,
                initialTargetLineBearing, distanceGoals.gold, "goldBoundLine"));

            setSilverBoundLine(createLineOffsets(initialTargetLine,
                initialTargetLineBearing, distanceGoals.silver, "silverBoundLine"));

            setBronzeBoundLine(createLineOffsets(initialTargetLine,
                initialTargetLineBearing, distanceGoals.bronze, "bronzeBoundLine"));
            
            let targetLinePoints = [...initialTargetLineSimplifiedCoords];
            targetLinePoints.reverse();
            newLine.forEach(coord => targetLinePoints.push(coord));
            let initialPathPolygon = turf.lineToPolygon(turf.multiLineString([targetLinePoints]));
                initialPathPolygon.id = "pathPolygon";
            setPathPolygon(initialPathPolygon);
        }

    }, [newLine])

    useEffect(() => {
        if (platinumBoundLine) {
            setPlatinumBoundLine(createLineOffsets(targetLine,
                targetLineBearing, distanceGoals.platinum, "platinumBoundLine"));
        }

        if (goldBoundLine) {
            setGoldBoundLine(createLineOffsets(targetLine,
                targetLineBearing, distanceGoals.gold, "goldBoundLine"));
        }

        if (silverBoundLine) {
            setSilverBoundLine(createLineOffsets(targetLine,
                targetLineBearing, distanceGoals.silver, "silverBoundLine"));
        }

        if (bronzeBoundLine) {
            setBronzeBoundLine(createLineOffsets(targetLine,
                targetLineBearing, distanceGoals.bronze, "bronzeBoundLine"));
        }

        calculateNewScore();
        
    }, [distanceGoals])


    function createLineOffsets(targetLine, targetLineBearing, offsetDistance, lineID) {

        let firstOffsetLine = turf.transformTranslate(turf.combine(targetLine).features[0], offsetDistance, targetLineBearing + 90, {units: "meters"})
        firstOffsetLine.id = lineID + "1";
        let secondOffsetLine = turf.transformTranslate(turf.combine(targetLine).features[0], -offsetDistance, targetLineBearing + 90, {units: "meters"})
        secondOffsetLine.id = lineID + "2";

        let fixedLines = turf.featureCollection([firstOffsetLine, secondOffsetLine], {id: lineID});
        return fixedLines;
    }

    function calculateNewScore() {
        switch (scoringMethod) {
            case ("classic"):
                calculateClassicScore();
                break;
            case ("area"):
                calculateScoreByArea();
                break;
            default:
                break;
        }
    }

    function calculateScoreByCoords() {
        let score = lineData.reduce((previous, current) => {
            let deviation = turf.pointToLineDistance(turf.point(current), targetLine.features[0], {units: "meters"});
            
            let deviationScore = 100 * (Math.pow((deviation / 150), Math.log10(missionInfo.targetLineDistance)));
            return previous - deviationScore
        }, 100)

        setScores({...scores, burdell: score})
        return score;
    }

    function calculateScoreByArea() {
        let areaScore = (turf.area(pathPolygon)/missionInfo.targetLineDistance*5)^2;
        setScores({...scores, area: areaScore.toFixed(2)})
        return areaScore.toFixed(2)
    }

    function calculateClassicScore(maximumDeviation = missionInfo.maximumDeviation) {
        let classicScore = null;
        switch (true) {
            case (maximumDeviation <= distanceGoals.platinum):
                classicScore = "platinum";
                break;
            case (maximumDeviation <= distanceGoals.gold):
                classicScore = "gold";
                break;
            case (maximumDeviation <= distanceGoals.silver):
                classicScore = "silver";
                break;
            case (maximumDeviation <= distanceGoals.bronze):
                classicScore = "bronze";
                break;
            case (maximumDeviation > distanceGoals.bronze):
                classicScore = "no rank";
                break;
            default:
                break;
        }

        setScores({...scores, classic: classicScore})
        return classicScore;
    }

    function findMaxDeviation(testLine = lineData, target = targetLine) {
        let deviation = testLine.reduce((previousPoint, currentPoint) => {
            //let pointOnTarget = turf.nearestPointOnLine(targetLine, currentPoint);
            let distance = turf.pointToLineDistance(turf.point(currentPoint), target.features[0], {units: "meters"});
            
            return Math.max(previousPoint, distance)
        }, 0);
        
        return deviation;
    }

    return {
        actualPath, targetLine, missionInfo, scores,
        platinumBoundLine, goldBoundLine, silverBoundLine, bronzeBoundLine,
        pathPolygon,
        calculateNewScore
    }

}