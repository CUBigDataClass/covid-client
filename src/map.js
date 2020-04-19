import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import data from './countries'

class Map_Comp extends Component {

  render() {
    var centerLat = (data.minLat + data.maxLat) / 2;
    var distanceLat = data.maxLat - data.minLat;
    var bufferLat = distanceLat * 0.05;
    var centerLong = (data.minLong + data.maxLong) / 2;
    var distanceLong = data.maxLong - data.minLong;
    var bufferLong = distanceLong * 0.05;
    return (
      <div>
        <Map
          style={{ height: "750px", width: '100%' }}
          zoom={1}
          center={[centerLat, centerLong]}
          bounds={[
            [data.minLat - bufferLat, data.minLong - bufferLong],
            [data.maxLat + bufferLat, data.maxLong + bufferLong]
          ]}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          
          {data.country.map((country, k) => {
            return (
              <CircleMarker
                key={k}
                color={'red'}
                fillColor={'red'}
                center={[country["coordinates"][1], country["coordinates"][0]]}
                radius={20 * Math.log(country["deaths"]/500)}
                fillOpacity={0.5}
                stroke={false}
              >
                <Tooltip direction="right" offset={[-8, -2]} opacity={1}>
                  <span>{country["name"] + ": " + "Death Toll: " + " " + country["deaths"]}</span>
                </Tooltip>
              </CircleMarker>)
          })
          }
        </Map>
      </div>
    );
  }
}

export default Map_Comp;