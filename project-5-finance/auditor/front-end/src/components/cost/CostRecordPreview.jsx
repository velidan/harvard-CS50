import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@appCore';

import { getAxiosHeaders, getCookie } from '@appUtils';

import {
    useMutation,
  } from '@tanstack/react-query'
  import axios from 'axios';

export function CostRecordPreview(props) {
    const { id, title, description, total } = props;
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: (payload) => {
          return axios.delete(`http://127.0.0.1:8000/api/cost-record/${id}`, {
            headers: getAxiosHeaders()
          })
        },
      })

      if (deleteMutation.isLoading) {
        return <span>Deleting...</span>;
      }
    
      if (deleteMutation.isError) {
        return <span>Error: {deleteMutation.error.message}</span>;
      }
    
      if (deleteMutation.isSuccess) {
        return <span>Cost Record deleted!</span>;
      }

    return (
        <div onClick={() => {
            console.log('load details');
            navigate(routes.getCostRecordRoute(id));
        }} className='category-preview' key={`category-${id}`}>
            <p><b>Title</b>: {title}</p>
            <p><b>Description</b>: {description}</p>
            <p><b>Total</b>: {total}</p>
            <button onClick={(e) => {
                e.stopPropagation();
                console.log('delete preview');
                deleteMutation.mutate();
            }}>Delete</button>
        </div>
    )
}