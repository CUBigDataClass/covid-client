import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
var http = require("http");

class Comp extends Component {

    constructor(props) {
    super(props);

    this.state = {
      new_cases: [], 
      new_deaths: [],
      total_cases: [],
      total_deaths: []
    };
   
    this.getStats = this.getStats.bind(this);
  }

  getStats(url, param) {
    
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
          const parsedData = JSON.parse(rawData)
          if (param === "new_cases"){
            this.setState({new_cases: parsedData});
          } else if (param === "total_cases") {
            this.setState({total_cases: parsedData})
          } else if (param === "new_deaths") {
            this.setState({new_deaths: parsedData});
          } else {
            this.setState({total_deaths: parsedData});
          }
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }
  
componentDidMount() {

    // this.getStats("http://localhost:3001/data_nocoords?type=new_cases", "new_cases");
    // this.getStats("http://localhost:3001/data_nocoords?type=total_cases", "total_cases");
    // this.getStats("http://localhost:3001/data_nocoords?type=total_deaths", "total_deaths");
    // this.getStats("http://localhost:3001/data_nocoords?type=new_deaths", "new_deaths");

    // this.getStats("http://74.125.72.101:3001/data_nocoords?type=new_cases", "new_cases");
    // this.getStats("http://74.125.72.101:3001/data_nocoords?type=total_cases", "total_cases");
    // this.getStats("http://74.125.72.101:3001/data_nocoords?type=total_deaths", "total_deaths");
    // this.getStats("http://74.125.72.101:3001/data_nocoords?type=new_deaths", "new_deaths");


    this.getStats("http://35.193.65.75:3001/data_nocoords?type=new_cases", "new_cases");
    this.getStats("http://35.193.65.75:3001/data_nocoords?type=total_cases", "total_cases");
    this.getStats("http://35.193.65.75:3001/data_nocoords?type=total_deaths", "total_deaths");
    this.getStats("http://35.193.65.75:3001/data_nocoords?type=new_deaths", "new_deaths");

}
// 35.193.65.75

 render(){

             const columns = [

                 {
                     name: 'Country',
                     selector: 'country',
                     sortable: true,
                     left: true,
                     minWidth: '40px'
                 },
                 {
                     name: 'Total Cases',
                     selector: 'total_cases',
                     left: true,
                     maxWidth: '50px'

                 },
                 {
                     name: 'Total Deaths',
                     selector: 'total_deaths',
                     left: true,
                     maxWidth: '50px'

                 },
                 {
                     name: 'New Cases',
                     selector: 'new_cases',
                     left: true,
                     maxWidth: '50px'

                 },
                 {
                     name: "New Deaths",
                     selector: 'new_deaths',
                     left: true,
                     maxWidth: '50px'

                 },
             ];



function createData(name, new_cases, total_cases, new_deaths, total_deaths){
  return { "country":name, "new_cases": new_cases, "total_cases": total_cases, "new_deaths": new_deaths, "total_deaths": total_deaths };
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate-date <milliseconds);
    }

    sleep(1500);

    let dict = {}
    console.log('total deaths: ', this.state.total_deaths);
    let new_cases = this.state.new_cases
    for (var key in new_cases) {
        // console.log('key', key, 'stat: ', new_cases[key])
        if ((key!== "_id")&&(key!=="date"))
        {dict[key] = [new_cases[key]];}
    }
    for (var key in this.state.total_cases) {
        if ((key!== "_id")&&(key!=="date"))
        {dict[key].push(this.state.total_cases[key]);}
    }
    for (var key in this.state.new_deaths) {
        if ((key!= "_id")&&(key!="date"))
        {dict[key].push(this.state.new_deaths[key]);}
    }

    for (var key in this.state.total_deaths) {
        if ((key!= "_id")&&(key!="date"))
        {dict[key].push(this.state.total_deaths[key]);}
    }

    const rows =[];
    for (var key in dict) {
        rows.push(createData(key, dict[key][0], dict[key][1], dict[key][2], dict[key][3]))
    }
    console.log('rows: ', rows);

    return (
      <div className="container">
     
        <DataTable
          title="Country Specific Data"
          columns={columns}
          data={rows}
          fixedHeader={true}
          maxHeight= "500px"
          theme={'dark'}
          highlightOnHover
          dense={true}
        />
      </div>
    );
 }   
}
export default Comp;