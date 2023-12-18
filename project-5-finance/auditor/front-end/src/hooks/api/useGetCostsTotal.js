import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetCostsTotal(category = null) {

  let url = 'http://127.0.0.1:8000/api/cost-record/costs_total';
  if (category ) {
    url += `?category=${category}`
  } 

    const result = useQuery({
        queryKey: ['costsTotal', category],
        queryFn: () =>
        axios.get(url).then(
            (res) => {
                return res.data;
            },
          )
      });

     
    return result;
}