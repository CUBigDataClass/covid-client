import React from 'react';
import MapComp from './components/map.js';
import Box from "@material-ui/core/Box";
import Table from './components/table.js';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './app.css';
import Graph from './components/graph.js';

function App() {

  return (
      <div className='app'>
          <h1 align={'center'} >Covid Tracker</h1>
          <br/>
        <div className="container-fluid">
             <MapComp></MapComp>
        </div>
        <br/>
        <div className="container-fluid justify-content-center">
                <div className="row justify-content-center">
                    <div clasName={"col-5"}>
                      <Table></Table>
                    </div>
                    <div clasName={"col-5"} >
                        <Graph></Graph>
                    </div>
                </div>
        </div>

        <br />
          <Box className={"footer"} color="#424242" p={1} id={"box"} >
              <hr color={'#424242'} />
              <p id="footer-content">Copyright © 2020 - Matthew Donovan, Maura Winstanley, Kyle Bremont, Alison Ostlund </p>
          </Box>
      </div>
  );
}

export default App;