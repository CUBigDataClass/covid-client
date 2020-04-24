import React, { Component } from 'react';
import "leaflet/dist/leaflet.css";
import './graph.css';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
    VerticalGridLines,
    LineSeries,
    AreaSeries,
    Hint,
    Crosshair,
    HorizontalGridLines
} from 'react-vis';
var http = require("http");

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {

      url : "http://35.193.65.75:3001/",
      // url: "http://localhost:3001/",

      selectedStat: "total_cases",
      dates: [],
      country: "World",
      stats: [],
      call: true,
      countries: [],
      statTypes: [],
    };

    this.getDates = this.getDates.bind(this);
    this.getDataForCountry = this.getDataForCountry.bind(this);
    this.changeCountry = this.changeCountry.bind(this);
    this.changeStat = this.changeStat.bind(this);
  }
     

  changeCountry(country) {
    this.setState({country});
  }

  changeStat(stat) {
    this.setState({selectedStat: stat}, () =>
    this.getDates());
  }

  populateDropdown() {
    var stats = this.state.dates[0];

    let countries = [];
    Object.keys(stats).forEach(function(key) {
        if (key !== "_id" && key !== "date") {
            countries.push({value: key, display: key})
        }
    });

    let statTypes = [];
    statTypes.push({value: "total_cases", display: "Cumulative cases"});
    statTypes.push({value: "new_cases", display: "Daily cases"});
    statTypes.push({value: "total_deaths", display: "Cumulative deaths"});
    statTypes.push({value: "new_deaths", display: "Daily deaths"});

    this.setState({ countries, statTypes });
  }

  getDates() {
    var url = this.state.url + "timeline?type=" +  this.state.selectedStat;
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
              this.setState({dates: parsedData}, ()=>{
                  this.populateDropdown();
              });

          } catch (e) {
              console.error(e.message);
          }
      });
      }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }

  getDataForCountry() {
    var stats = [];
    for (var index in this.state.dates) {
        var stat = this.state.dates[index][this.state.country];
        if (stat == null) {
            stats.push({x: parseInt(index), y: 0})
        } else {
            stats.push({x: parseInt(index), y: stat})
        }
        
    }
    return stats;
  }
    _forgetValue = () => {
        this.setState({
            value: null
        });
    };

    _rememberValue = value => {
        this.setState({value});
    };
  render() {
    if (this.state.dates.length === 0) {
        this.getDates();
    }

    if (this.state.call) {
        var stats = this.getDataForCountry();

    }

    const stat = this.state.selectedStat;


    return (
      <div className="graph">
        <div className="row justify-content">
            <div className="col-sm-3" id="title" >
                COVID-19 Over Time
            </div>
            <div className="col-sm-9">
            Country: 	&nbsp;
                <select onChange={(e) => this.changeCountry(e.target.value)}>
                {this.state.countries.map((country) => <option key={country.value} value={country.value}>{country.display}</option>)}
                </select>
            &nbsp;&nbsp;&nbsp;&nbsp;
            Stat Type: 	&nbsp;
                <select onChange={(e) => this.changeStat(e.target.value)}>
                {this.state.statTypes.map((country) => <option key={country.value} value={country.value}>{country.display}</option>)}
                </select>
            </div>
        </div>
        {stat === "new_cases" || stat === "new_deaths" ? (
          <XYPlot height={650} width={window.innerWidth - 100} >
              <VerticalGridLines />
              <HorizontalGridLines />
            <VerticalBarSeries data={stats} style={{fill:"white", stroke: 'none', fillOpacity:'0.5'}} />
            <XAxis title="Days" position="end" style={{fill:"white", stroke: 'none'}}/>
            <YAxis title={stat} position="middle" left={55} style={{stroke: 'none', fill: 'white', fontWeight: 400}}/>
          </XYPlot>
        ) : (
          <XYPlot height={650} width={window.innerWidth - 100}  >
              <VerticalGridLines />
              <HorizontalGridLines />
            <AreaSeries
              data={stats}
              fill="white"
              stroke={"white"}
              opacity={0.5}
              style={{strokeLinejoin: 'round', strokeWidth: 4}}
                // onNearestX={(datapoint, event) => {
                //   console.log('graph data',datapoint);
                />
            <XAxis title="Days" position="end" style={{stroke: 'none', fill: 'white', fontWeight: 400}}/>
            <YAxis title={stat} position="middle" left={55} style={{stroke: 'none', fill: 'white', fontWeight: 400}}/>
          </XYPlot>
        )}
        
      </div>      
    );
  }
}

export default Graph;
