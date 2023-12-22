import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@appCore';
import CircularProgress from "@mui/material/CircularProgress";

import { useDeleteCostRecord } from '@appHooks';

export function CostRecordPreview(props) {
    const { id, title, description, total } = props;
    const navigate = useNavigate();

    const deleteMutation = useDeleteCostRecord(id);
    
    return (
        <div onClick={() => {
            console.log('load details');
            navigate(routes.getCostRecordRoute(id));
        }} className='category-preview' key={`category-${id}`}>
            <p><b>Title</b>: {title}</p>
            <p><b>Description</b>: {description}</p>
            <p><b>Total</b>: {total}</p>
            
            { deleteMutation.isLoading ? <CircularProgress /> : <button onClick={(e) => {
                e.stopPropagation();
                console.log('delete preview');
                deleteMutation.mutate();
            }}>Delete</button> }
        </div>
    )
}