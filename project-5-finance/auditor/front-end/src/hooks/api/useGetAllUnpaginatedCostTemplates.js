
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetAllUnpaginatedCostTemplates() {


    const result = useQuery({
        queryKey: ['allUnpaginatedCostTemplates'],
        queryFn: () =>
        axios.get('http://127.0.0.1:8000/api/cost-record/all_unpaginated_templates/').then(
            (res) => {
                return res.data;
            },
          ),
          keepPreviousData: true,
      });

     
    return result;
}