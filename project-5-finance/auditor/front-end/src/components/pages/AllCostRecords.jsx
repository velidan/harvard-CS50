import * as React from 'react';

import { Pagination } from '@appComponents/common';

import { withPrimaryLayout } from '@appHocs';
import CircularProgress from '@mui/material/CircularProgress';

import { CostRecordPreview } from '@appComponents/cost/CostRecordPreview';
import { CategorySelect } from '@appComponents/category';
import { useGetAllCostRecords, useGetCostsTotalGroupedByCategory, useGetCostsTotal, usePagination } from '@appHooks'
import "chart.js/auto"
import { Pie } from 'react-chartjs-2';


export function _AllCostRecords() {

    const [ category, setCategory ] = React.useState(null);

    const {
        page,
        paginate
    } = usePagination('Costs');

    const { isPending, error, data } = useGetAllCostRecords(page, category);
    const res = useGetCostsTotal();
    const totalByCategoryRes = useGetCostsTotalGroupedByCategory();
    const totalByCategoriesValue = totalByCategoryRes.data?.total_by_categories
    const colors = [];
    let pieGeneratedData = null
    if (totalByCategoriesValue) {
        const keys = Object.keys(totalByCategoriesValue);
        const values = Object.values(totalByCategoriesValue);
        for(let i=0;i<values.length;i++){
            colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
      }

      pieGeneratedData = {
        labels: keys,
        datasets: [{
            label: 'Total Costs',
            data: values,
            backgroundColor: colors,
            hoverOffset: 4
          }]
      }



    }
   


    if (isPending) return (
      <div className='flex items-center justify-center h-full'>
        <CircularProgress />
      </div>
    )

    return <div>
        
        {pieGeneratedData && <Pie  data={pieGeneratedData} />}
    
<CategorySelect 
                        value={category} onChange={categoryId => {
                            setCategory(categoryId)
                        }}
                      />
                      <button onClick={() => {
                        setCategory(null);
                      }}>Reset Category</button>
        
        {data.results.length ? 
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
    
    : 'No Cost records'}
    </div>
}

export const AllCostRecords = withPrimaryLayout(_AllCostRecords);
