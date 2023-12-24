import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Pagination } from '@appComponents/common';

import { withPrimaryLayout } from '@appHocs';

import { CostRecordPreview } from '@appComponents/cost/CostRecordPreview';

import { useGetAllCostRecordTemplates, usePagination } from '@appHooks'
export function _AllCostRecordTemplates() {

    
    const {
        page,
        paginate
    } = usePagination('Cost Templates');

    const { isPending, data } = useGetAllCostRecordTemplates(page);


     

    if (isPending) return (
        <div className='flex items-center justify-center h-full'>
          <CircularProgress />
        </div>
      )

    return        <div className="common-wrapper content-list">
    <h5 className="content-title text-center">Your cost records templates</h5>
    {data.results.length ? (
      <div className="flex flex-col grow justify-between">
        <div>
          {data.results.map((cost) => {
            return (
              <CostRecordPreview
                key={cost.id}
                id={cost.id}
                title={cost.title}
                description={cost.description}
                total={cost.total}
              />
            );
          })}
        </div>
       

        <Pagination
          page={!page ? 1 : page}
          count={data.total_pages}
          onChange={(pageNumber) => {
            paginate(pageNumber);
          }}
        />
      </div>
    ) : (
      "No Cost records"
    )}
  </div>

}

export const AllCostRecordTemplates = withPrimaryLayout(_AllCostRecordTemplates);
