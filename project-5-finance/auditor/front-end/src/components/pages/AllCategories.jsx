import * as React from 'react';



import { withPrimaryLayout } from '@appHocs';

import { CategoryPreview } from '@appComponents/category/CategoryPreview';

import { useGetAllCategories, usePagination } from '@appHooks';
import { Pagination } from '@appComponents/common';
import { CircularProgress } from '@mui/material';

export function _AllCategories() {

    const {
        page,
        paginate
    } = usePagination('Categories');


    const { isPending, error, data } = useGetAllCategories(page);

    if (isPending)     return (
        <div className="flex items-center justify-center h-full">
          <CircularProgress />
        </div>
      );

  
    return        <div className="content-list">
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
      "No Categories"
    )}
  </div>

}

export const AllCategories = withPrimaryLayout(_AllCategories);
