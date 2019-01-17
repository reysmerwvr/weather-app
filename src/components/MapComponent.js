import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import L from 'leaflet';

import Main from '../hoc/Main';
import suggestions from '../city.list.json';
import { 
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
} from './SelectComponents'

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
    button: {
        margin: theme.spacing.unit,
    },
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
      display: 'flex',
      padding: 0,
    },
    valueContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flex: 1,
      alignItems: 'center',
      overflow: 'hidden',
    },
    chip: {
      margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
        0.08,
      ),
    },
    noOptionsMessage: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: 'absolute',
      left: 2,
      fontSize: 16,
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
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

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

export class MapComponent extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRadio = this.handleChangeRadio.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

        this.state = {
            lat: 10.48801,
            lng: -66.879189,
            zoom: 5,
            name: '',
            id: null,
            findBy: 'coordinates'
        };
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

    handleChange = event => {
        this.setState({
          [event.target.name]: event.target.value,
        });
    }

    handleChangeRadio = event => {
        this.setState({ findBy: event.target.value });
    };

    handleChangeSelect = name => value => {
        this.setState({
          [name]: value,
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { lat, lng, name } = this.state;
    }
  
    render() {
        const { classes, theme } = this.props;
        const { lat, lng, findBy } = this.state;
        const selectStyles = {
            input: base => ({
              ...base,
              color: theme.palette.text.primary,
              '& input': {
                font: 'inherit',
              },
            }),
        };

        return (
            <Main style={{flexGrow: 1}}>
                <div style={{flexGrow: 1}}>
                    <Grid container spacing={24}>
                        <Grid item xs={8}>
                            <div id="map" style={mapStyles}></div>
                            <Typography variant="h6" gutterBottom component="h2">
                                Drag the marker to choose a location or type a city name
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <form className={classes.container} noValidate autoComplete="off">
                                <FormControl fullWidth className={classes.margin}>
                                    <InputLabel htmlFor="latitude">Latitude</InputLabel>
                                    <Input
                                        id="latitude"
                                        value={lat}
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
                                <FormControl fullWidth className={classes.margin}>
                                    <NoSsr>
                                        <Select
                                            classes={classes}
                                            styles={selectStyles}
                                            options={suggestions}
                                            components={components}
                                            value={this.state.single}
                                            onChange={this.handleChangeSelect('name')}
                                            placeholder="Type a city name"
                                            isClearable
                                            isSearchable
                                        />
                                    </NoSsr>
                                </FormControl>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={findBy === 'coordinates'}
                                                onChange={this.handleChangeRadio}
                                                value="coordinates"
                                                name="radio-button-find-by"
                                                aria-label="Coordinates"
                                                color="primary"
                                            />
                                        }
                                        label="Coordinates"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={findBy === 'name'}
                                                onChange={this.handleChangeRadio}
                                                value="name"
                                                name="radio-button-find-by"
                                                aria-label="Name"
                                                color="secondary"
                                            />
                                        }
                                        label="Name"
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleSubmit}
                                >
                                    Load Data
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </div>
            </Main>
        );
    }
}

export default withStyles(styles, { withTheme: true })(MapComponent);