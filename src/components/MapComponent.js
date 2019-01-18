import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import Downshift from 'downshift';
import deburr from 'lodash/deburr';
import _ from 'lodash';
import L from 'leaflet';

import Main from '../hoc/Main';
import LoaderModal from '../components/LoaderModal';
import suggestions from '../city.list.json';
import { loadForecast, clearMessages } from '../actions';

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
    },
    donwshiftContainer: {
        flexGrow: 1,
        position: 'relative',
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
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

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeRadio = this.handleChangeRadio.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.handleChangeDownShift = this.handleChangeDownShift.bind(this);
        this.initMap = this.initMap.bind(this);

        this.state = {
            lat: 59.436958,
            lng: 24.753531,
            zoom: 5,
            name: '',
            id: null,
            findBy: 'coordinates',
            formError: 'You must to type a city name'
        };
    }

    componentDidMount() {
        this.initMap();
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        const { error, success } = nextProps;
        if (error !== prevState.error) {
            return { error };
        }
        if (success !== prevState.success) {
            return { success };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        const { error, success, clearMessages } = prevProps;
        const errorMessage = this.props.error;
        const successMessage = this.props.success;
        if (error !== errorMessage && errorMessage !== null) {
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.initMap();
            clearMessages();
        }
        if (success !== successMessage && successMessage !== null) {
            toast.success(successMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.initMap();
            clearMessages();
        }
    }

    initMap() {
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
            this.setState({ lat: lat[1].trim(), lng: lng[0].trim() });
		});
        this.map.on('click', (e) => {
            const coord = e.latlng.toString().split(',');
		    const lat = coord[0].split('(');
		    const lng = coord[1].split(')');
            this.marker.setLatLng(e.latlng);
            this.setState({ lat: lat[1].trim(), lng: lng[0].trim() });
		});
    }

    handleChangeDownShift = event => {
        if(event) {
            const city = event.split('-');
            const result = _.head(_.filter(suggestions, (suggestion) => 
                (suggestion.name === city[0].trim() && suggestion.country === city[1].trim())));
            if(result) {
                this.setState({ name: result.name, id: result.code });
            }
        }
        
    }

    handleChangeRadio = event => {
        this.setState({ findBy: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        const { findBy, name, formError } = this.state;
        if(findBy === 'city_name' && name === '') {
            toast.warn(formError, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            this.props.loadForecast({ ...this.state });
        }
        
    }

    getSuggestions(value) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
      
        return inputLength === 0
          ? []
          : suggestions.filter(suggestion => {
              const keep =
                count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;
      
              if (keep) {
                count += 1;
              }
      
              return keep;
            });
    }

    renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;
      
        return (
          <TextField
            label="City Name"
            InputProps={{
              inputRef: ref,
              classes: {
                root: classes.inputRoot,
                input: classes.inputInput,
              },
              ...InputProps,
            }}
            {...other}
          />
        );
    }

    renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1;
      
        return (
          <MenuItem
            {...itemProps}
            key={suggestion.code}
            selected={isHighlighted}
            component="div"
            style={{
              fontWeight: isSelected ? 500 : 400,
            }}
          >
            {`${suggestion.name} - ${suggestion.country}`}
          </MenuItem>
        );
    }
  
    render() {
        const { classes, loading } = this.props;
        const { lat, lng, findBy } = this.state;

        if (loading) {
            return (<LoaderModal loading={loading} />);
        }

        return (
            <Main style={{flexGrow: 1}}>
                <div style={{flexGrow: 1}}>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                    />
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
                                <FormControl 
                                    fullWidth 
                                    className={classes.margin}
                                >
                                    
                                    <div className={classes.root}>
                                        <Downshift 
                                            id="downshift-simple"
                                            onChange={this.handleChangeDownShift}
                                        >
                                            {({
                                                getInputProps,
                                                getItemProps,
                                                getMenuProps,
                                                highlightedIndex,
                                                inputValue,
                                                isOpen,
                                                selectedItem,
                                            }) => (
                                            <div className={classes.donwshiftContainer}>
                                                {
                                                    this.renderInput({
                                                        fullWidth: true,
                                                        classes,
                                                        InputProps: getInputProps({
                                                            placeholder: 'Type a city name'
                                                        }),
                                                    })
                                                }
                                                <div {...getMenuProps()}>
                                                {
                                                    isOpen ? (
                                                        <Paper className={classes.paper} square>
                                                        {
                                                            this.getSuggestions(inputValue).map((suggestion, index) =>
                                                                this.renderSuggestion({
                                                                    suggestion,
                                                                    index,
                                                                    itemProps: getItemProps({ item: `${suggestion.name} - ${suggestion.country}` }),
                                                                    highlightedIndex,
                                                                    selectedItem,
                                                                }),
                                                            )
                                                        }
                                                        </Paper>
                                                    ) : null
                                                }
                                                </div>
                                            </div>
                                            )}
                                        </Downshift>
                                    </div>
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
                                                checked={findBy === 'city_name'}
                                                onChange={this.handleChangeRadio}
                                                value="city_name"
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

const mapStateToProps = ({ forecasts }) => {
    const { error, success, loading, forecast } = forecasts;

    return { error, success, loading, forecast };
};

const mapDispatchToProps = { 
    loadForecast,
    clearMessages
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapComponent));