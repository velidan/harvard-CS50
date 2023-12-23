import * as React from 'react';
import "chart.js/auto";
import { Pie } from "react-chartjs-2";
import {
    useGetCostsTotalGroupedByCategory,
  } from "@appHooks";

export function PieDiagram() {

    const totalByCategoryRes = useGetCostsTotalGroupedByCategory();
    const totalByCategoriesValue = totalByCategoryRes.data?.total_by_categories;

    let pieGeneratedData = null;
    const colors = [];

    if (totalByCategoriesValue) {
      const keys = Object.keys(totalByCategoriesValue).map(o => o === 'null' ? 'Uncategorized' : o);
      const values = Object.values(totalByCategoriesValue)
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

    return colors.length && pieGeneratedData ? <div className='pie-wrapper'>
        <Pie data={pieGeneratedData} />
    </div> : <b>You haven't created any cost spending yet</b>
}