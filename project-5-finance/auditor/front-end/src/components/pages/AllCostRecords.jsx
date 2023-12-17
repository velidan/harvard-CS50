import * as React from 'react';

import { Pagination } from '@appComponents/common';

import { withPrimaryLayout } from '@appHocs';

import { CostRecordPreview } from '@appComponents/cost/CostRecordPreview';

import { useGetAllCostRecords, usePagination } from '@appHooks'
export function _AllCostRecords() {

    
    const {
        page,
        paginate
    } = usePagination('Costs');

    const { isPending, error, data } = useGetAllCostRecords();


     

    if (isPending) return 'Loading...'
   
    if (error) return 'An error has occurred: ' + error.message


    return data.results.length ? 
    <div>


  
    {data.results.map(cost => {
        return (
            <CostRecordPreview 
            key={cost.id}
            id={cost.id}
            title={cost.title}
            description={cost.description}
            total={cost.total}
        />
        )
    }) } 

        <Pagination 
            page={!page ? 1 : page} 
            count={data.total_pages} 
            onChange={(pageNumber) => {
                paginate(pageNumber);
            }}
        />

      </div>
    
    : 'No Cost records'
}

export const AllCostRecords = withPrimaryLayout(_AllCostRecords);
