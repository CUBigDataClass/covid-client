import React, { Component } from 'react';
import { Map, CircleMarker, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
var http = require("http");

class MapComp extends Component {
  constructor(props) {
    super(props);

    this.state = {

      url : "http://35.188.77.106:3001/",
      countries : [],
      coordinates: [],
      minLat: -6.1751,
      maxLat: 55.7558,
      minLong: 37.6173,
      maxLong: 139.6917,
      selectedStat: "total_cases",
      statTypes: []
    };
    this.getStats = this.getStats.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.changeStat= this.changeStat.bind(this);

  }
     

  populateDropdown() {
    let statTypes = []
    statTypes.push({value: "total_cases", display: "Cumulative cases"});
    statTypes.push({value: "new_cases", display: "Daily cases"});
    statTypes.push({value: "total_deaths", display: "Cumulative deaths"});
    statTypes.push({value: "new_deaths", display: "Daily deaths"});

    this.setState({statTypes});
  }

  changeStat(stat) {
    this.setState({selectedStat: stat}, () =>
    this.getStats());
  }

  getCoordinates() {
    var url = this.state.url + "coords"
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
              var coordinates = {};
              for (let i = 0; i < parsedData.length; i++) {
                coordinates[parsedData[i]._id] = [parsedData[i].longitude, parsedData[i].latitude]
              }
              this.setState({coordinates})

          } catch (e) {
              console.error(e.message);
          }
      });
      }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  getStats() {
    var url = this.state.url + "data?type=" +  this.state.selectedStat;
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
              console.log(rawData)
              this.setState({countries: parsedData})

          } catch (e) {
              console.error(e.message);
          }
      });
      }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  componentDidMount() {
    this.populateDropdown();
  }

  render() {
    var centerLat = (this.state.minLat + this.state.maxLat) / 2;
    var distanceLat = this.state.maxLat - this.state.minLat;
    var bufferLat = distanceLat * 0.05;
    var centerLong = (this.state.minLong + this.state.maxLong) / 2;
    var distanceLong = this.state.maxLong - this.state.minLong;
    var bufferLong = distanceLong * 0.05;

    if (this.state.coordinates.length === 0) {
      this.getCoordinates();
    }
    
    if (this.state.countries.length === 0) {
      this.getStats();
    }

    return (

      <div>
        <div>
         Data type: <select onChange={(e) => this.changeStat(e.target.value)}>
            {this.state.statTypes.map((stat) => <option key={stat.value} value={stat.value}>{stat.display}</option>)}
            </select>
          </div>
        <Map
          style={{ height: "700px", width: '100%' }}
          zoom={1}
          minZoom={2}
          center={[centerLat, centerLong]}
          bounds={[
            [this.state.minLat - bufferLat, this.state.minLong - bufferLong],
            [this.state.maxLat + bufferLat, this.state.maxLong + bufferLong]
          ]}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {this.state.countries.map((country, k) => {
          console.log(country)
            if (this.state.coordinates[country["country"]] !== undefined) {
              return (
                <CircleMarker
                  key={k}
                  color={(((this.state.selectedStat === 'total_cases') || (this.state.selectedStat === 'new_cases'))? 'blue' : 'red')}
                  fillColor={(((this.state.selectedStat === 'total_cases') || (this.state.selectedStat === 'new_cases'))? 'blue' : 'red')}
                  center={this.state.coordinates[country["country"]]}
                  radius={4 * Math.log(country["stat"])}
                  fillOpacity={.5}
                  stroke={false}
                                >
                  <Tooltip direction="right" offset={[-8, -2]} opacity={.8}>
                    
                    <span>{country["country"] + " " + this.state.selectedStat + ": " + country["stat"]}</span>
                  </Tooltip>
                </CircleMarker>)
            }
          })
          }
        }
        </Map>
      </div>      
    );
  }
}

export default MapComp;
