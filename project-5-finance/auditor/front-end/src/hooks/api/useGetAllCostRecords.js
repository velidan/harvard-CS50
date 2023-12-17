import axios from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetAllCostRecords() {

    const result = useQuery({
        queryKey: ['allCostRecords'],
        queryFn: () =>
        axios.get(`http://127.0.0.1:8000/api/cost-record/`).then(
            (res) => {
                return res.data;
            },
          ),
      })

     
    return result;
}