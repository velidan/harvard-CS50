import * as React from 'react';
import { useParams  } from 'react-router-dom';

import { withPrimaryLayout } from '@appHocs';

import { CostRecordUpdateForm } from '@appComponents/cost';

import { useGetCostRecord } from '@appHooks';


export function _CostRecord() {
    let { id } = useParams();



    // const [category, setCategory] = React.useState(null);

    const { isPending, error, data } = useGetCostRecord(id);

      if (isPending) return 'Fetching cost record details...'

      if (error) return 'An error has occurred: ' + error.message
    


    return (
        <div>


  
      

     
            {data.template && <b>In templates!</b>}

            <div>
                <h1><b>Title:</b> {data.title}</h1>
                <p><b>Description:</b> {data.description}</p>
                <p><b>ID:</b> {data.id}</p>
                <p><b>Total:</b> {data.total}</p>
            </div>

            {data && id && <CostRecordUpdateForm id={id} costRecordModel = {data} />}
            
        </div>

    )
}

export const CostRecord = withPrimaryLayout(_CostRecord);
