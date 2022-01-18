import React, {useEffect, useState, forwardRef, useRef, useImperativeHandle} from 'react';
import * as turf from '@turf/turf';

import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import {useGeographic} from 'ol/proj';
import {buffer} from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style, Text} from 'ol/style';
import './MapContainer.css';

const MapContainer = forwardRef((props, ref) => {

    useGeographic();
    
    const [mapExtent, setMapExtent] = useState();
    const [map, setMap] = useState();

    const mapDiv = useRef();
    const mapRef = useRef();
        mapRef.current = map;

    const styles = {
        'actualPath': [
            new Style({
                stroke: new Stroke({
                color: '#6deef2',
                width: 4,
            })
        })],
        'targetLine': [
                new Style({
                    stroke: new Stroke({
                    color: '#00000022',
                    width: 4
                })
            }), 
                new Style({
                    stroke: new Stroke({
                    color: '#f9e8e8',
                    width: 2,
                })
            })],
        'platinumBoundLine': new Style({
            stroke: new Stroke({
                color: '#35c622aa',
                width: 2,
            })
        }),
        'goldBoundLine': new Style({
            stroke: new Stroke({
                color: '#ebe766aa',
                width: 2,
            })
        }),
        'silverBoundLine': new Style({
            stroke: new Stroke({
                color: '#f7952caa',
                width: 2,
            })
        }),
        'bronzeBoundLine': new Style({
            stroke: new Stroke({
                color: '#ea3636aa',
                width: 2,
            })
        }),
        'pathPolygon': new Style({
                fill: new Fill({
                    color: '#ffffff66'
                })
            })
    }

    useEffect(() => {

        const initialMap = new Map({
            target: mapDiv.current,
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            attributions: ['Powered by Esri',
                                           'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                            attributionsCollapsible: false,
                            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            maxZoom: 23
                        })
                    }),
                    new VectorLayer({
                        source: new VectorSource()
                    })
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 2,
                }),
                controls: []
            })
         
        setMap(initialMap);
    }, [])

    useEffect(() => {

        if(props.lineLayers.length) {
            let listen = mapRef.current.on('pointermove', mouseHandler);
            mapRef.current.updateSize();
            return mapRef.current.un('pointermove', listen);
        }
    }, [props.lineLayers])

    useEffect(() => {

        if(props.lineLayers.length) {
            let newLayers = props.lineLayers.map(element => {
                if (element) {
                    if (element['type'] === "FeatureCollection") {
                        return new VectorLayer({
                            properties: {name: element['id']},
                            source: new VectorSource({features: new GeoJSON().readFeatures(element)}),
                            style: styles[element['id']]
                        })
                    }
                }
            })

            if(props.pathPolygon) {
                newLayers.push(new VectorLayer({
                    properties: {name: "pathPolygon"},
                    source: new VectorSource({features: new GeoJSON().readFeatures(props.pathPolygon)}),
                    style: styles['pathPolygon']
                }))
            }

            newLayers.push(new VectorLayer({
                properties: {name: "hoverLine"},
                source: new VectorSource(null),
                style: new Style({
                    stroke: new Stroke({
                        color: 'red',
                        width: 2
                    }),
                })
            }))

            let extent = newLayers[0].getSource().getExtent();
            let newExtent = buffer(extent, 0.1);

            if (!mapExtent) {
                map.getView().fit(newExtent, {padding: [0, 0, 0, map.getSize()[0] * 0.2]});
                setMapExtent(newExtent);
            }

            newLayers.unshift(new TileLayer({
            source: new XYZ({
                attributions: ['Powered by Esri',
                               'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                attributionsCollapsible: false,
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                maxZoom: 23
              })
            }))

            map.setLayers(newLayers);
        }
        
    }, [props.lineLayers])

    useImperativeHandle(ref, () => ({
        showLayer: (layerName) => {showLayer(layerName)},
        hideLayer: (layerName) => {hideLayer(layerName)}
    }));

    function showLayer(layerName) {
        map.getLayers().getArray()
            .filter(layer => layer.get('name') === layerName)
            .forEach(layer => layer.setStyle(styles[layerName]));
    }

    function hideLayer(layerName) {
        map.getLayers().getArray()
            .filter(layer => layer.get('name') === layerName)
            .forEach(layer => {
                if(layer.get('name') === "pathPolygon") {
                    layer.setStyle(new Style({
                        fill: new Fill({
                        color: '#ffffff00'
                    })}))
                } else {
                    layer.setStyle(new Style({}))
                }
            });
    }

    function mouseHandler(e) {

        mapRef.current.forEachFeatureAtPixel(e.pixel, function (f) {
            let hoverLineLayer = mapRef.current.getLayers().getArray().find(layer => {return layer.get("name") === "hoverLine"});

            if(f.getId() === "pathPolygon" || f.getId() === "hoverLayer") {

            //When hovering over area covered by actualPath, get the closest point on targetLine,
            //then get distance along targetLine which can be used to find current bearing
                //let closestPointToMouse = turf.point(newSource.getGeometry().getClosestPoint(e.coordinate))
                let closestPointToMouse = turf.nearestPointOnLine(props.lineLayers[0], turf.point(e.coordinate));
                let closestPointDistanceOnLine = turf.distance(closestPointToMouse, props.lineLayers[0].features[0].geometry.coordinates[0]);
                
            //Find two points on either side of closet hover point and use them to find targetLine bearing.
                let firstBearingPoint;
                if (closestPointDistanceOnLine < 1) {
                    firstBearingPoint = turf.point(props.lineLayers[0].features[0].geometry.coordinates[0]);
                } else {
                    firstBearingPoint = turf.along(props.lineLayers[0].features[0], closestPointDistanceOnLine - 1);
                }
                let secondBearingPoint = turf.along(props.lineLayers[0].features[0], closestPointDistanceOnLine + 1) && turf.point(props.lineLayers[0].features[0].geometry.coordinates[props.lineLayers[0].features[0].geometry.coordinates.length - 1]);
                let currentBearing = turf.bearing(firstBearingPoint, secondBearingPoint);
                
            //Create a line at hover point using the bearing found above,
            //then use that to measure distance between
            //targetLine and actualPath 
                let testLine = turf.lineChunk(
                    turf.lineString([
                        turf.destination(closestPointToMouse, (props.maximumDeviation + 1) / 1000, currentBearing + 90).geometry.coordinates,
                        turf.destination(closestPointToMouse, (props.maximumDeviation + 1) / 1000, currentBearing - 90).geometry.coordinates
                    ]), 10);
                let targetLineIntersect = turf.lineIntersect(testLine, props.lineLayers[0]).features[0].geometry.coordinates;
                let actualPathIntersect = turf.lineIntersect(testLine, props.lineLayers[5]);
                    
            //The there was more than one intersect found, use the one with the largest distance
                let farthestIntersect = closestPointToMouse;
                turf.featureEach(actualPathIntersect, function (currentFeature, featureIndex) {
                    if(turf.distance(closestPointToMouse, turf.getCoord(currentFeature)) > turf.distance(closestPointToMouse, farthestIntersect)) {
                        farthestIntersect = turf.getCoord(currentFeature);
                    }
                });
                
            //Create and display the line showing the distance between actualPath and targetLine.
                let measuredLine = turf.lineString([targetLineIntersect, farthestIntersect]);
                    measuredLine.id = "hoverLayer";
                let newLineDistance = (turf.length(measuredLine) * 1000).toFixed(2);
                
                hoverLineLayer.setSource(new VectorSource({features: new GeoJSON().readFeatures(measuredLine)}))
                hoverLineLayer.setStyle(new Style({
                    stroke: new Stroke({
                        color: 'orange',
                        width: 2
                    }),
                    text: new Text({
                        text: `${newLineDistance}m`,
                        font: '16px Calibri,sans-serif',
                        fill: new Fill({color: '#000'}),
                        stroke: new Stroke({
                            color: '#fff', 
                            width: 2
                        })
                    })
                }))
                
            } else {
                hoverLineLayer.setSource(null);
            }
           return true;
        })
    }
    
    return (
        <div ref={mapDiv} className="map-container"></div>
    )
})

export default MapContainer