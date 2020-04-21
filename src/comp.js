import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DataTable, { createTheme } from 'react-data-table-component';
// import { createMuiTheme, ThemeProvider  } from '@material-ui/core/styles';
var http = require("http");
// const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

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

              const parsedData = JSON.parse(rawData);
              
              if (param == "new_cases"){
                // console.log('new_cases')
              

                this.setState({new_cases: parsedData});
                
              } else if (param == "total_cases") {

                this.setState({total_cases: parsedData});
                // console.log('IN cases')
                
              } else if (param == "new_deaths") {
                
                this.setState({new_deaths: parsedData});
                // console.log('in deaths len: ', this.state.new_deaths.length)
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

    this.getStats("http://localhost:3001/data_nocoords?type=new_cases", "new_cases");
    this.getStats("http://localhost:3001/data_nocoords?type=total_cases", "total_cases");
    this.getStats("http://localhost:3001/data_nocoords?type=total_deaths", "total_deaths");
    this.getStats("http://localhost:3001/data_nocoords?type=new_deaths", "new_deaths");

   

  }




 render(){

  const columns = [
 
    { name: 'Country', selector: 'country', sortable: true },
    {
        
        name: 'Total Cases',
        selector: 'total_cases',
    
    },
    {
        name: 'Total Deaths',
        selector: 'total_deaths',
     
    },
    {
        name: 'New Cases',
        selector: 'new_cases'
     
    },
    {
      name: "New Deaths",
      selector: 'new_deaths',
      // label: 'New Deaths',
      // minWidth: 100,
      // align: 'center',
      // format: (value) => value.toLocaleString(),
  },
];
function createData(name, new_cases, total_cases, new_deaths, total_deaths){
  
  return { "country":name, "new_cases": new_cases, "total_cases": total_cases, "new_deaths": new_deaths, "total_deaths": total_deaths };
}
  
    let dict = {} 
    // console.log('fuck')
    // console.log(this.state)
    console.log('total deaths: ', this.state.total_deaths)
    let new_cases = this.state.new_cases
    for (var key in new_cases) {
      // console.log('key', key, 'stat: ', new_cases[key])
      if ((key!= "_id")&&(key!="date"))
      {dict[key] = [new_cases[key]];}
    }
    for (var key in this.state.total_cases) {
      if ((key!= "_id")&&(key!="date"))
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
      // console.log(key, dict[key])
      rows.push(createData(key, dict[key][0], dict[key][1], dict[key][2], dict[key][3]))
    }
    console.log('rows: ', rows)
    // const classes = this.useStyles();
    
    

    return (
      <div className="container">
     
        <DataTable
          title="COvid Cunt"
          columns={columns}
          data={rows}
          fixedHeader={true}
          maxHeight= "500px"
        />
      </div> 


    );
    
                 
          
 }   
}
export default Comp;