import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import DrawerMUI from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { navItems, checkIsActivePath } from './navItems';

import { useAppContext, routes } from '@appCore';


const drawerWidth = 240;

export function Drawer(props) {
    const { window } = props;
    const navigate = useNavigate();
    const { system: { state, dispatch } } = useAppContext();


    const closeDrawer = () => {
      dispatch({ type: 'SET_DRAWER_OPEN', payload: false });
    };


    const drawerContent = (
    <Box onClick={closeDrawer} sx={{ textAlign: 'center' }}>

      <div className='app-title'>
              <Typography variant="h6" sx={{ my: 2 }}>
                Finance Auditor
              
              </Typography>
              { state.userName && <Typography
              variant="h6"
              component="div"
            >
              <small>Logged as: <b>{state.userName}</b></small>
            </Typography>
}
          </div>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
            className={checkIsActivePath(item.path) ? 'active nav-item mobile' : 'nav-item mobile'}
            onClick={e =>  {
   
                if (item.path === routes.logout) {
                  triggerLogout();
                  return;
                }
                navigate(item.path)
              }} 
              sx={{ textAlign: 'center' }}
              >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    )

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <nav>
        <DrawerMUI
          container={container}
          variant="temporary"
          open={state.isDrawerOpen}
          onClose={closeDrawer}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </DrawerMUI>
      </nav>  
    );
}
