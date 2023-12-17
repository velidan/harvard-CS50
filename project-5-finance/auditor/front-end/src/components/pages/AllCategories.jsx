import * as React from 'react';



import { withPrimaryLayout } from '@appHocs';

import { CategoryPreview } from '@appComponents/category/CategoryPreview';

import { useGetAllCategories, usePagination } from '@appHooks';
import { Pagination } from '@appComponents/common';

export function _AllCategories() {

    const {
        page,
        paginate
    } = usePagination('Categories');


    const { isPending, error, data } = useGetAllCategories(page);

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    

    

    return data.results.length ? 
    <div>


  
    {data.results.map(category => {
        return (
            <CategoryPreview 
                key={category.id}
                id={category.id}
                title={category.title}
                description={category.description}
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
    
    : 'No Categories'
}

export const AllCategories = withPrimaryLayout(_AllCategories);
