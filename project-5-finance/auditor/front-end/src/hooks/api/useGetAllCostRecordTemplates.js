import axios from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetAllCostRecordTemplates() {

    const result = useQuery({
        queryKey: ['allCostRecordTemplates'],
        queryFn: () =>
        axios.get(`http://127.0.0.1:8000/api/cost-record/templates/`).then(
            (res) => {
                return res.data;
            },
          ),
      })

     
    return result;
}