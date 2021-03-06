import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import history from '../helpers/history';
import { menuItems } from '../components/MenuItems';
import Main from '../hoc/Main';
import { signOut } from '../actions';
import Forecasts from './Forecasts';
import Precipitations from './Precipitations';
import Temperatures from './Temperatures';

const drawerWidth = 240;

const styles = theme => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing.unit * 7,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing.unit * 9,
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
      height: '100vh',
      overflow: 'auto',
      marginTop: 50
    },
    chartContainer: {
      marginLeft: -22,
    },
    tableContainer: {
      height: 320,
    },
    h5: {
      marginBottom: theme.spacing.unit * 2,
    },
});

class Dashboard extends Component {
  state = {
    open: true,
    ContentComponent: Forecasts
  };

  componentDidMount() {
    if(!this.props.user) {
      history.push('/login');
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps;
    if(match !== prevState.match) {
      let ContentComponent = prevState.component;
      const path = match.path;
      if(path) {
        switch(path) {
          case '/dashboard':
            ContentComponent = Forecasts;
            break;
          case '/temperatures':
            ContentComponent = Temperatures;
            break;
          case '/precipitations':
            ContentComponent = Precipitations;
            break;
          default:
            ContentComponent = Forecasts;
        }
      }
      return { ContentComponent, match }
    }
    return null;
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  
  render() {
    const { classes } = this.props;
    const { ContentComponent } = this.state;
    return (
      <Main>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
            className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden,
                )}
              >
              <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                Weather App
              </Typography>
          </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <List>{menuItems(this.props)}</List>
          </Drawer>
          <main className={classes.content}>
            <ContentComponent />
          </main>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { user } = auth;

  return { user };
};

const mapDispatchToProps = { signOut };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));