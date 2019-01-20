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

import { getPrecipitations } from '../actions';

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

class Precipitations extends Component {
    
    constructor(props) {
        super(props);

        this.loadDataState = this.loadDataState.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);

        this.state = {
            precipitationsByCityName: {},
            precipitationsByCityAndDate: {},
            dailyCitiesTemperatures: {},
            precipitationsList: [],
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
        this.props.getPrecipitations();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { precipitationsList, error } = nextProps
        if (error !== prevState.error) {
            return { error };
        }
        if (precipitationsList !== prevState.precipitationsList) {
            return { precipitationsList };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        const { error, precipitationsList } = prevProps;
        const errorMessage = this.props.error;
        const upcomingTemperaturesList = this.props.precipitationsList;
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
        if (precipitationsList !== upcomingTemperaturesList) {
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
        const { city, precipitationsByCityAndDate } = this.state;
        let { dailyData } = this.state;
        const cityDate = event.target.value;
        if(_.size(precipitationsByCityAndDate) > 0) {
            dailyData = precipitationsByCityAndDate[city][cityDate];
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

    loadDataState(precipitationsList) {
        let { 
            precipitationsByCityName, 
            precipitationsByCityAndDate, 
            dailyCitiesTemperatures,
            datesByCity, 
            cities,
        } = this.state;
        precipitationsByCityName = _.groupBy(precipitationsList, 
            (precipitation) => { return precipitation.city.name; });
        cities = _.keys(precipitationsByCityName);
        _.forEach(precipitationsByCityName, (precipitationsByNameArray, cityName) => {
            const precipitationsByDate = _.groupBy(precipitationsByNameArray, 
                (precipitation) => { return Moment(precipitation.datetime_of_data).format('YYYY-MM-DD'); });
            if(_.size(precipitationsByDate) > 0) {
                precipitationsByCityAndDate[cityName] = precipitationsByDate;
                datesByCity[cityName] = _.keys(precipitationsByDate);
                let auxArray = [];
                _.forEach(precipitationsByDate, (precipitationsByDateArray, date) => {
                    const tempAverage = _.meanBy(precipitationsByDateArray, 
                        (precipitations) => { return precipitations.precipitation_value; });
                    auxArray.push({ 
                        precipitation_value : parseFloat(tempAverage).toFixed(2), 
                        datetime_of_data: date 
                    });
                });
                dailyCitiesTemperatures[cityName] = auxArray;
            }
        });
        this.setState({ 
            precipitationsByCityName,
            precipitationsByCityAndDate,
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
                        YAxisDataKey='precipitation_value'
                        stroke='#82ca9d'
                        XLabel='Hour'
                        XUnit='h'
                        YLabel='Pecipitation'
                        YUnit='mm'
                        lineName='Pecipitation/Hour'
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
                        YAxisDataKey='precipitation_value'
                        XLabel='Day'
                        XUnit={null}
                        YLabel='Pecipitation'
                        YUnit='mm/3h'
                        lineName='Pecipitation/Day'
                    />
                </Typography>
            </Main>
        );
    }
}

const mapStateToProps = ({ precipitations }) => {
    const { precipitationsList, error, loading } = precipitations;
  
    return { precipitationsList, error, loading };
  };
  
const mapDispatchToProps = { getPrecipitations };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Precipitations));