import * as React from 'react';

import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import { withPrimaryLayout } from '@appHocs';
import { routes } from '@appCore';
import { CategoryPreview } from '@appComponents/category/CategoryPreview';

import { useGetAllCategories, usePagination } from '@appHooks';
import { Pagination } from '@appComponents/common';
import { CircularProgress } from '@mui/material';

export function _AllCategories() {

    const {
        page,
        paginate
    } = usePagination('Categories');
    const navigate = useNavigate();

    const { isPending, data } = useGetAllCategories(page);

    if (isPending)     return (
        <div className="flex items-center self-center justify-center h-full">
          <CircularProgress />
        </div>
      );

  
    return        <div className='common-wrapper categories'><div className="content-list">
    <h5 className="content-title text-center">Your cost categories</h5>
    {data.results.length ? (
      <div className="flex flex-col grow justify-between">
        <div>
          {data.results.map((category) => {
            return (
                <CategoryPreview 
                key={category.id}
                id={category.id}
                title={category.title}
                thumbnail={category.thumbnail}
                description={category.description}
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
            <i class="font-tech ">You have not created any category! </i>🥲
            </p>
            
            <Button style={{marginTop: 8}} variant="contained"
            onClick={() => {
                navigate(routes.createCategory);
            }} 
          >
              Create one
          </Button>
           </div>
    )}
  </div>
  </div>
}

export const AllCategories = withPrimaryLayout(_AllCategories);
