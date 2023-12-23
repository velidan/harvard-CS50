import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useDeleteCategory } from '@appHooks';
import { routes } from '@appCore';

export function CategoryPreview(props) {
    const { id, title, description, thumbnail } = props;
    const navigate = useNavigate();

    const deleteMutation = useDeleteCategory(id);
    
  console.log('thumbnail -> ', thumbnail)
    return (

      <Paper className='preview category' key={`record-${id}`}>
        {thumbnail ? <img className='category-thumbnail-preview' src={thumbnail} alt={`category ${title} thumbnail`} /> : <div
        className='category-thumbnail-preview-placeholder'
        >No thumbnail</div> }
      <div className='preview-info'>
          <p><b>Title</b>: {title}</p>
          <p><b>Description</b>: {description}</p>
      </div>

      
      <div className='actions'>
          <Button variant="contained"
          onClick={() => {
              navigate(routes.getCategoryRoute(id));
          }} 
          >
              Details
          </Button>
          { deleteMutation.isLoading ? <CircularProgress /> : <Button  variant="contained" color="error" onClick={(e) => {
      e.stopPropagation();
      deleteMutation.mutate();
          }}>Delete</Button> }
      </div>

  </Paper>

     
    )
}
