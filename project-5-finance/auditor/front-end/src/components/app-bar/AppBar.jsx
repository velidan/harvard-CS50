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

const navItems = ['Home', 'About', 'Contact'];

export function AppBar() {

  const { dispatch } = useAppContext();

  const openDrawer = () => {
      dispatch({ type: 'SET_DRAWER_OPEN', payload: true });
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
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBarMUI>
      <Drawer />
    </Box>
  );
}
