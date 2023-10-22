import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import DrawerMUI from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import Typography from '@mui/material/Typography';

import { useAppContext } from '@appCore';

const drawerWidth = 240;

const navItems = ['Home', 'About', 'Contact'];

export function Drawer(props) {
    const { window } = props;

    const { state, dispatch } = useAppContext();
   

    const closeDrawer = () => {
        dispatch({ type: 'SET_DRAWER_OPEN', payload: false });
    };


    const drawerContent = (
    <Box onClick={closeDrawer} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => {
                console.log("drawer list item click")
            }} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
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
