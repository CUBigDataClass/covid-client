import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

var http = require("http");

class Map_Comp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries : [],
      minLat: -6.1751,
      maxLat: 55.7558,
      minLong: 37.6173,
      maxLong: 139.6917,
    };
    this.getStats = this.getStats.bind(this);
  }

  getStats() {
    var url = "http://localhost:3001/data?type=total_deaths"
    http.get(url, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      // validate respose
      let error;
      if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
      }

      res.setEncoding('utf8');
      let rawData = '';

      res.on('data', (chunk) => { rawData += chunk; });

      // parse response and update current anagrams
      res.on('end', () => {
          try {
              const parsedData = JSON.parse(rawData);
              this.setState({countries: parsedData["result"]})

          } catch (e) {
              console.error(e.message);
          }
      });
      }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  render() {
    var centerLat = (this.state.minLat + this.state.maxLat) / 2;
    var distanceLat = this.state.maxLat - this.state.minLat;
    var bufferLat = distanceLat * 0.05;
    var centerLong = (this.state.minLong + this.state.maxLong) / 2;
    var distanceLong = this.state.maxLong - this.state.minLong;
    var bufferLong = distanceLong * 0.05;

    if (this.state.countries.length == 0) {
      this.getStats();
    }

    return (
      <div>
        <Map
          style={{ height: "750px", width: '100%' }}
          zoom={1}
          center={[centerLat, centerLong]}
          bounds={[
            [this.state.minLat - bufferLat, this.state.minLong - bufferLong],
            [this.state.maxLat + bufferLat, this.state.maxLong + bufferLong]
          ]}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {this.state.countries.map((country, k) => {
            
            return (
              <CircleMarker
                key={k}
                color={'red'}
                fillColor={'red'}
                center={[country["coordinates"][1], country["coordinates"][0]]}
                radius={5*Math.log(country["stat"])}
                fillOpacity={0.5}
                stroke={false}
              >
                <Tooltip direction="right" offset={[-8, -2]} opacity={1}>
                  <span>{country["country"] + ": " + "death toll: " + " " + country["stat"]}</span>
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
