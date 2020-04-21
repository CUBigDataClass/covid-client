import React from 'react';
import MapComp from './map.js';
import DataTable from './table_new.js';
import Box from "@material-ui/core/Box";
import Comp from './comp.js';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './app.css';

function App() {

  return (
      <div className='app'>
          <h1 align={'center'} >Covid Tracker</h1>
          <br/>
        <div className="container-fluid">
            <div className="row justify-content">
                <div className="col-sm-4">
                    <Comp />
                   
                </div>
                <div className="col-sm-8">
                    <MapComp />
                </div>
            </div>
        </div>
            <br/>
          <div className="container-fluid">
            <div className="row justify-content-center" >
                <p> Slider here ??</p>
            </div>
        </div>
          <Box className={"footer"} color="#424242" p={1} id={"box"} >
              <hr color={'#424242'} />
              <p id="footer-content">Copyright © 2020 - Matthew Donovan, Maura Winstanley, Kyle Bremont, Alison Ostlund </p>
          </Box>
      </div>
  );
}

export default App;