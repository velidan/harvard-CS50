import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Pagination } from '@appComponents/common';
import { useNavigate } from 'react-router-dom';
import { withPrimaryLayout } from '@appHocs';
import { routes } from '@appCore';
import { CostRecordPreview } from '@appComponents/cost/CostRecordPreview';
import Button from "@mui/material/Button";

import { useGetAllCostRecordTemplates, usePagination } from '@appHooks'
export function _AllCostRecordTemplates() {

    
    const {
        page,
        paginate
    } = usePagination('Cost Templates');
    const navigate = useNavigate();
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
      <div className='no-content-box center'>
            <p>
            <span className='no-content-box-intro'>Whoops</span>
            <i>You have not added any cost to templates! </i>🥲
            </p>
            
            <Button style={{marginTop: 8}} variant="contained"
            onClick={() => {
                navigate(routes.createCost);
            }} 
          >
              Create Cost Record
          </Button>
           </div>
    )}
  </div>

}

export const AllCostRecordTemplates = withPrimaryLayout(_AllCostRecordTemplates);
