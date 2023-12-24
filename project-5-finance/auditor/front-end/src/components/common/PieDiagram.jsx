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
    const totalByCategoriesValue = totalByCategoryRes.data?.total_by_categories;

    React.useEffect(() =>{
      
      console.log('category ------>', category);
      let colors = []
      if (totalByCategoriesValue) {

        const mappedTotalByCategoriesValue = {
          ...totalByCategoriesValue,
          'Uncategorized' : {
            id: 'uncategorized',
            total_sum: totalByCategoriesValue[null].total_sum,
            title: 'Uncategorized'
          }
        }

        delete mappedTotalByCategoriesValue[null];
        console.log('mappedTotalByCategoriesValue ==> ' , mappedTotalByCategoriesValue);

 
   
        // const keys = Object.keys(totalByCategoriesValue).map(o => o === 'null' ? 'Uncategorized' : o);
        const values =  category ? Object.values(mappedTotalByCategoriesValue).filter(o => {
          // let criteria = category === 'uncategorized' ? null : category;
          console.log('o.id => ', o.id)

          return o.id === category;
        }) : Object.values(mappedTotalByCategoriesValue)


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

/*
    let pieGeneratedData = null;
    const colors = [];

    if (totalByCategoriesValue) {
      console.log('totalByCategoriesValue', totalByCategoriesValue)
      const keys = Object.keys(totalByCategoriesValue).map(o => o === 'null' ? 'Uncategorized' : o);
      const values = Object.values(totalByCategoriesValue).map(o => o.total_sum);
      for (let i = 0; i < values.length; i++) {
        colors.push("#" + Math.floor(Math.random() * 16777215).toString(16));
      }
  
      pieGeneratedData = {
        labels: keys,
        datasets: [
          {
            label: "Total Costs",
            data: values,
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
    }
*/


    return state ? <div className='pie-wrapper'>
        <Pie 
        onClick={evt => {

          const chart = pieRef.current;
          if (!chart) return;

          const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

          if (points.length) {
              const firstPoint = points[0];
              const label = chart.data.labels[firstPoint.index];
              const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
              console.log('label -> ', label);
              console.log('value -> ', value);
              console.log("totalByCategoriesValue ", totalByCategoriesValue)

              let res;
              if (label === 'Uncategorized') {
                res = 'uncategorized'
              } else {
                res = totalByCategoriesValue[label].id;
              }
              console.log('res ->> ', res);
              
              setCategory(res);
              onSegmentClick(res)
          }


          console.log('args 0> ', pieRef);
        }}
        ref={pieRef} data={state} />
    </div> : <b>You haven't created any cost spending yet</b>
}