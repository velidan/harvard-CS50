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

import { useLogout } from '@appHooks';
import { navItems, checkIsActivePath } from './navItems';

export function AppBar() {

  const { system: { state, dispatch } } = useAppContext();
  const navigate = useNavigate();

  const { refetch: triggerLogout } = useLogout();

  const openDrawer = () => {
    dispatch({type: 'SET_DRAWER_OPEN', payload: true});
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarMUI component="nav" className='app-bar'>
        <div className="nav-content-desktop">
        <Toolbar style={{justifyContent: 'space-between'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={openDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <div className='app-title'>
            <Typography
              variant="h6"
      
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              Finance Auditor
              </Typography>
             {state.userName && <Typography
              variant="h6"

              component="div"
              sx={{ flexGrow: 1, fontSize: 12, display: { xs: 'none', sm: 'block' } }}
            >
              <small>Logged as: <b>{state.userName}</b></small>
            </Typography>} 
          </div>

          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button 
                className={checkIsActivePath(item.path) ? 'active nav-item' : 'nav-item'}
                key={item.label} 
                sx={{ color: '#fff' }}
                onClick={() =>  {
                if (item.path === routes.logout) {
                  triggerLogout();
                  return;
                }
                navigate(item.path)
              }}>
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
        </div>
      </AppBarMUI>
      <Drawer />
    </Box>
  );
}
