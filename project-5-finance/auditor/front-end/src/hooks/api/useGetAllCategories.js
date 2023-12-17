import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useGetAllCategories(page = null) {

  let url = 'http://127.0.0.1:8000/api/cost-category/';
  if (page) {
    url += `?page=${page}`
  }

    const result = useQuery({
        queryKey: ['allCategories', page],
        queryFn: () =>
        axios.get(url).then(
            (res) => {
                return res.data;
            },
          ),
          keepPreviousData: true,
      });

     
    return result;
}