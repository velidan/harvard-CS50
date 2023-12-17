
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetAllUnpaginatedCategories() {


    const result = useQuery({
        queryKey: ['allUnpaginatedCategories'],
        queryFn: () =>
        axios.get('http://127.0.0.1:8000/api/cost-category/all_unpaginated_categories/').then(
            (res) => {
                return res.data;
            },
          ),
          keepPreviousData: true,
      });

     
    return result;
}