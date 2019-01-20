import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'moment';
import _ from 'lodash';

import Main from '../hoc/Main';
import LoaderModal from '../components/LoaderModal';
import { SimpleLineChart } from '../components/SimpleLineChart';

import { getTemperatures } from '../actions';

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
    chartContainer: {
      marginLeft: -22,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

class Temperatures extends Component {
    
    constructor(props) {
        super(props);

        this.loadDataState = this.loadDataState.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        this.state = {
            temperaturesByCityName: {},
            temperaturesByCityAndDate: {},
            dailyCitiesTemperatures: {},
            temperaturesList: [],
            datesByCity: {},
            weaklyData: [],
            dailyData: [],
            cities: [],
            dates: [],
            city: '',
            date: ''
        };
    }

    componentDidMount() {
        this.props.getTemperatures();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { temperaturesList, error } = nextProps
        if (error !== prevState.error) {
            return { error };
        }
        if (temperaturesList !== prevState.temperaturesList) {
            return { temperaturesList };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        const { error, temperaturesList } = prevProps;
        const errorMessage = this.props.error;
        const upcomingTemperaturesList = this.props.temperaturesList;
        if (error !== errorMessage) {
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        if (temperaturesList !== upcomingTemperaturesList) {
            this.loadDataState(upcomingTemperaturesList);
        }
    }

    handleCityChange = event => {
        const { datesByCity, dailyCitiesTemperatures } = this.state;
        let { dates, weaklyData } = this.state;
        const cityValue = event.target.value;
        if(_.size(datesByCity) > 0) {
            dates = datesByCity[cityValue];
        }
        if(_.size(dailyCitiesTemperatures) > 0) {
            weaklyData = dailyCitiesTemperatures[cityValue];
        }
        this.setState({ 
            [event.target.name]: cityValue,
            weaklyData,
            dailyData: [],
            date: '',
            dates
        });
    };

    handleDateChange = event => {
        const { city, temperaturesByCityAndDate } = this.state;
        let { dailyData } = this.state;
        const cityDate = event.target.value;
        if(_.size(temperaturesByCityAndDate) > 0) {
            dailyData = temperaturesByCityAndDate[city][cityDate];
            for(let index in dailyData) {
                dailyData[index].datetime_of_data =
                Moment(dailyData[index].datetime_of_data).format("HH:mm");
            }
        }
        this.setState({ 
            [event.target.name]: cityDate,
            dailyData
        });
    };

    loadDataState(temperaturesList) {
        let { 
            temperaturesByCityName, 
            temperaturesByCityAndDate, 
            dailyCitiesTemperatures,
            datesByCity, 
            cities,
        } = this.state;
        temperaturesByCityName = _.groupBy(temperaturesList, 
            (temperature) => { return temperature.city.name; });
        cities = _.keys(temperaturesByCityName);
        _.forEach(temperaturesByCityName, (temperaturesByNameArray, cityName) => {
            const temperaturesByDate = _.groupBy(temperaturesByNameArray, 
                (temperature) => { return Moment(temperature.datetime_of_data).format('YYYY-MM-DD'); });
            if(_.size(temperaturesByDate) > 0) {
                temperaturesByCityAndDate[cityName] = temperaturesByDate;
                datesByCity[cityName] = _.keys(temperaturesByDate);
                let auxArray = [];
                _.forEach(temperaturesByDate, (temperaturesByDateArray, date) => {
                    const tempAverage = _.meanBy(temperaturesByDateArray, 
                        (temperatures) => { return temperatures.temp_day; });
                    auxArray.push({ 
                        temp_day : parseFloat(tempAverage).toFixed(2), 
                        datetime_of_data: date 
                    });
                });
                dailyCitiesTemperatures[cityName] = auxArray;
            }
        });
        this.setState({ 
            temperaturesByCityName,
            temperaturesByCityAndDate,
            dailyCitiesTemperatures,
            datesByCity,
            cities
        });
    }

    render() {
        const { classes, loading } = this.props;
        const { cities, dates, city, date, dailyData, weaklyData } = this.state;
        if (loading) {
            return (<LoaderModal loading={loading} />);
        }
        return (
            <Main>
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
                <div className={classes.appBarSpacer} />
                <Typography variant="h4" gutterBottom component="h2">
                    Daily Report
                </Typography>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="city-simple">City</InputLabel>
                    <Select
                        value={city}
                        onChange={this.handleCityChange}
                        inputProps={{
                            name: 'city',
                            id: 'city-simple',
                        }}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        { 
                            (_.size(cities) > 0) && cities.map((city, index) => {
                                return (
                                    <MenuItem 
                                        key={index} 
                                        value={city}
                                    >
                                    {city}
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="city-simple">Available Dates</InputLabel>
                    <Select
                        value={date}
                        onChange={this.handleDateChange}
                        inputProps={{
                            name: 'date',
                            id: 'date-simple',
                        }}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        { 
                            (_.size(dates) > 0) && dates.map((date, index) => {
                                return (
                                    <MenuItem 
                                        key={index} 
                                        value={date}
                                    >
                                    {date}
                                    </MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
                <Typography component="div" className={classes.chartContainer}>
                    <SimpleLineChart
                        data={dailyData}
                        XAxisDataKey='datetime_of_data'
                        YAxisDataKey='temp_day'
                        stroke='#82ca9d'
                        XLabel='Hour'
                        XUnit='h'
                        YLabel='Temperature'
                        YUnit='°C'
                        lineName='Temperature/Hour'
                    />
                </Typography>
                <Typography variant="h4" gutterBottom component="h2">
                    Weekly Report
                </Typography>
                <Typography component="div" className={classes.chartContainer}>
                    <SimpleLineChart
                        data={weaklyData}
                        stroke='#8884d8'
                        XAxisDataKey='datetime_of_data'
                        YAxisDataKey='temp_day'
                        XLabel='Day'
                        XUnit={null}
                        YLabel='Temperature'
                        YUnit='°C'
                        lineName='Temperature/Day'
                    />
                </Typography>
            </Main>
        );
    }
}

const mapStateToProps = ({ temperatures }) => {
    const { temperaturesList, error, loading } = temperatures;
  
    return { temperaturesList, error, loading };
  };
  
const mapDispatchToProps = { getTemperatures };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Temperatures));