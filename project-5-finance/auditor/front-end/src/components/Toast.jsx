import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function Toast() {
    const { toast: { state, dispatch } } = useAppContext();
  
    const handleClick = () => {
        dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.success,
            content: 'SUCCESSS'
        }});
    };
  
    const handleClose = (_event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      dispatch({type: 'HIDE_TOAST'});
    };
  
    const action = (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );
  
    return (

        <Snackbar
          open={state.show}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Note archived"
          action={action}
          severity="error"
        >
            <MuiAlert 
              onClose={handleClose} 
              severity={state.reason}
              sx={{ width: '100%' }}>
                    {state.content}
            </MuiAlert>
        </Snackbar>

    );
  }