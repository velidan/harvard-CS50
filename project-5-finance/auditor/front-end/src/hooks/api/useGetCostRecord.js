import * as React from 'react';
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetCostRecord(id) {

    const result = useQuery({
        queryKey: ['costRecordDetails'],
        queryFn: () =>
        axios.get(`http://127.0.0.1:8000/api/cost-record/${id}`).then(
            (res) => {
                return res.data;
            },
          ),
      })

     
    return result;
}