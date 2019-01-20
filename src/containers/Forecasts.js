import React, { Component } from 'react';

import Main from '../hoc/Main';
import MapComponent from '../components/MapComponent';

class Forecasts extends Component {
    render() {
        return (
            <Main>
                <MapComponent />
            </Main>
        );
    }
}

export default Forecasts;