import * as React from 'react';
import "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {
    useGetCostsTotalGroupedByCategory,
  } from "@appHooks";

const colorsCache = {}

export function PieDiagram(props) { 
    const {onSegmentClick, categoryId} = props;

    const pieRef = React.useRef(null);

    const [category, setCategory] = React.useState(categoryId);
    const [state, setState] = React.useState(null)


   

    const totalByCategoryRes = useGetCostsTotalGroupedByCategory();
    let totalByCategoriesValue = totalByCategoryRes.data?.total_by_categories;

    React.useEffect(() =>{
      
   
      let colors = []
      if (totalByCategoriesValue) {

      

        if (Object.keys(totalByCategoriesValue).includes('null')) {
          totalByCategoriesValue = {
            ...totalByCategoriesValue,
            'Uncategorized' : {
              id: 'uncategorized',
              total_sum: totalByCategoriesValue[null].total_sum,
              title: 'Uncategorized'
            }
          };
          delete totalByCategoriesValue[null];
        }



 
   
        // const keys = Object.keys(totalByCategoriesValue).map(o => o === 'null' ? 'Uncategorized' : o);
        const values =  category ? Object.values(totalByCategoriesValue).filter(o => {
          // let criteria = category === 'uncategorized' ? null : category;
          console.log('o.id => ', o.id)

          return o.id === category;
        }) : Object.values(totalByCategoriesValue)


        const keys = values.map(o => o.title);
        // const keys = values.map(o => o.id === 'null' ? 'Uncategorized' : o.title);
        const mappedValues = values.map(o => o.total_sum);
        for (let i = 0; i < values.length; i++) {
          const existingColor = colorsCache[values[i].id];

          if (existingColor) {
            colors.push(existingColor);
          } else {
            const genericColor = ("#" + Math.floor(Math.random() * 16777215).toString(16));
            colorsCache[values[i].id] = genericColor;
            colors.push(genericColor);
          }
          
          
        }
    
        const res = {
          labels: keys,
          datasets: [
            {
              label: "Total Costs",
              data: mappedValues,
              backgroundColor: colors,
              hoverOffset: 4,
            },
          ],
        };

        setState(res)
      }

    }, [totalByCategoriesValue, category])

    React.useEffect(() => {
      setCategory(categoryId);
    }, [categoryId])

    console.log('state', state);

    return Boolean(state?.labels?.length) ? <div className='pie-wrapper'>
        <Pie 
        onClick={evt => {

          const chart = pieRef.current;
          if (!chart) return;

          const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

          if (points.length) {
              const firstPoint = points[0];
              const label = chart.data.labels[firstPoint.index];
   
              let res;
              if (label === 'Uncategorized') {
                res = 'uncategorized'
              } else {
                res = totalByCategoriesValue[label].id;
              }
   
              setCategory(res);
              onSegmentClick(res)
          }


          console.log('args 0> ', pieRef);
        }}
        ref={pieRef} data={state} />
    </div> : <p className='pie-no-costs font-tech '>You haven't created any cost spending yet</p>
}