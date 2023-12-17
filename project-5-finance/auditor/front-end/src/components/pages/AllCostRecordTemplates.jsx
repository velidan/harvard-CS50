import * as React from 'react';

import { Pagination } from '@appComponents/common';

import { withPrimaryLayout } from '@appHocs';

import { CostRecordPreview } from '@appComponents/cost/CostRecordPreview';

import { useGetAllCostRecordTemplates, usePagination } from '@appHooks'
export function _AllCostRecordTemplates() {

    
    const {
        page,
        paginate
    } = usePagination('Cost Templates');

    const { isPending, error, data } = useGetAllCostRecordTemplates();


     

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
    
    : 'No Cost Templates'
}

export const AllCostRecordTemplates = withPrimaryLayout(_AllCostRecordTemplates);
