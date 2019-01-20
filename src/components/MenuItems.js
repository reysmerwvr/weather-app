import React from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BarChartIcon from '@material-ui/icons/BarChart';

export const menuItems = (props) => (
  <div>
    <NavLink to={'/dashboard'} activeClassName='selected'>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
    </NavLink>  
    <NavLink to={'/temperatures'} activeClassName='selected'>
        <ListItem button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Temperatures" />
        </ListItem>
    </NavLink>
    <NavLink to={'/precipitations'} activeClassName='selected'>
        <ListItem button>
            <ListItemIcon>
                <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Precipitations" />
        </ListItem>
    </NavLink>
    <NavLink 
      to={'/login'} 
      activeClassName={'menuListItem'} 
      onClick={() => props.signOut()}
    >    
        <ListItem button>
        <ListItemIcon>
            <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Exit" />
        </ListItem>
    </NavLink>
  </div>
);