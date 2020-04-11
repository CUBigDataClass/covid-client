// import React, {Component} from 'react';
// import {render} from 'react-dom';
// import MapGL from 'react-map-gl';

// const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxvczEzOTEiLCJhIjoiY2s4cWpnZ24wMDRuYTNnbjB0dGMxbG5teSJ9.eixUyeHH4MIKgSn7jhK2_Q'; // Set your mapbox token here

// class Root extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             viewport: {
//                 latitude: 37.8,
//                 longitude: -122.4,
//                 zoom: 14,
//                 bearing: 0,
//                 pitch: 0
//             }
//         };
//     }

//     render() {
//         return (
//             <MapGL
//                 {...this.state.viewport}
//                 width="100vw - 20"
//                 height="100vh"
//                 mapStyle="mapbox://styles/mapbox/dark-v9"
//                 onViewportChange={viewport => this.setState({viewport})}
//                 mapboxApiAccessToken={MAPBOX_TOKEN}
//             />
//         );
//     }
// }
// export default Root;


// document.body.style.margin = 0;
// render(<Root />, document.body.appendChild(document.createElement('div')));

import * as React from 'react';
import {Component} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';

import ControlPanel from './control-panel';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWxvczEzOTEiLCJhIjoiY2s4cWpnZ24wMDRuYTNnbjB0dGMxbG5teSJ9.eixUyeHH4MIKgSn7jhK2_Q'; // Set your mapbox token here

export default class Root extends Component {
  state = {
    viewport: {
      latitude: 40.67,
      longitude: -103.59,
      zoom: 3,
      bearing: 0,
      pitch: 0
    }
  };

  _sourceRef = React.createRef();

  _onViewportChange = viewport => this.setState({viewport});

  _onClick = event => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = this._sourceRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      this._onViewportChange({
        ...this.state.viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  render() {
    const {viewport} = this.state;

    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id]}
        onClick={this._onClick}
      >
        <Source
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          ref={this._sourceRef}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        <ControlPanel containerComponent={this.props.containerComponent} />
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<Root />, container);
}