import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import L from 'leaflet';

import Main from '../hoc/Main';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
});

const mapStyles = {
    height: 500, 
    width: 'auto'
};

const markerOptions = {
    title: "MyPoint", 
    alt: "Marker", 
    draggable: true
};

export class MapComponent extends Component {
    state = {
        lat: 10.48801,
        lng: -66.879189,
        zoom: 5,
    }

    componentDidMount() {
        const { lat, lng, zoom } = this.state;
        const position = [lat, lng]
        this.map = L.map('map', {
          center: position,
          zoom: zoom,
          layers: [
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }),
          ]
        });
        this.marker = L.marker(position, markerOptions)
        .addTo(this.map).on('dragend', (e) => {
			const coord = String(this.marker.getLatLng()).split(',');
			const lat = coord[0].split('(');
			const lng = coord[1].split(')');
            this.marker.bindPopup("Latitude: " + lat[1] + " Longitude" + lng[0] + ".");
            this.setState({ lat: lat[1], lng: lng[0] });
		});
        this.map.on('click', (e) => {
            const coord = e.latlng.toString().split(',');
		    const lat = coord[0].split('(');
		    const lng = coord[1].split(')');
            this.marker.setLatLng(e.latlng);
            this.setState({ lat: lat[1], lng: lng[0] });
		});
    }

    render() {
        const { classes } = this.props;
        const { lat, lng } = this.state;

        return (
            <Main style={{flexGrow: 1}}>
                <div style={{flexGrow: 1}}>
                    <Grid container spacing={24}>
                        <Grid item xs={8}>
                            <Typography variant="h4" gutterBottom component="h2">
                                Drag the marker to choose a location
                            </Typography>
                            <div id="map" style={mapStyles}></div> 
                        </Grid>
                        <Grid item xs={4}>
                            <form className={classes.container} noValidate autoComplete="off">
                                <FormControl fullWidth className={classes.margin}>
                                    <InputLabel htmlFor="latitude">Latitude</InputLabel>
                                    <Input
                                        id="latitude"
                                        value={lng}
                                        readOnly
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <InputLabel htmlFor="longitude">Longitude</InputLabel>
                                    <Input
                                        id="longitude"
                                        value={lng}
                                        readOnly
                                    />
                                </FormControl>
                            </form>
                        </Grid>
                    </Grid>
                </div>
            </Main>
        );
    }
}

export default withStyles(styles)(MapComponent);