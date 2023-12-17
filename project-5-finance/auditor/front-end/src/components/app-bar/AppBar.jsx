import * as React from 'react';
import AppBarMUI from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useAppContext } from '@appCore';
import { Drawer } from './Drawer';

import {  routes } from '@appCore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  {
    label: 'Home',
    path: routes.home
  }, 
  {
    label: 'Create Category',
    path: routes.createCategory
  },
  {
    label: 'Categories',
    path: routes.categories
  }, 
  {
    label: 'Costs',
    path: routes.costRecords
  }, 
  {
    label: 'Cost Templates',
    path: routes.costRecordTemplates
  }, 
  {
    label: 'Create Cost Record',
    path: routes.createCostRecord
  }, 
  {
    label: 'About',
    path: routes.about
  }, 
  {
    label: 'Contact',
    path: routes.contact
  }, 
  {
    label: 'Logout',
    path: routes.logout
  }, 

];

export function AppBar() {

  const { system: { dispatch } } = useAppContext();
  const navigate = useNavigate();


  const openDrawer = () => {
    dispatch({type: 'SET_DRAWER_OPEN', payload: true});
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarMUI component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={openDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.label} sx={{ color: '#fff' }} onClick={() =>  {
                navigate(item.path)
              }}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBarMUI>
      <Drawer />
    </Box>
  );
}
