import React from 'react';
import Map_Comp from './map.js';
import DataTable from './table.js';
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './app.css';
function App() {


  return (
      <div className='app'>
          <h1 align={'center'}>Covid Tracker</h1>
          <br/>
        <div className="container-fluid">

            <div className="row justify-content">
                <div className="col-sm-4">
                    <DataTable />
                </div>
                <div className="col-sm-8">
                    <Map_Comp />
                </div>
            </div>
        </div>
      </div>
  );
}

export default App;