import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useSearchParams } from 'react-router-dom';

export function useGetAllCategories(page = null) {

  const [searchParams] = useSearchParams();
  const titleFilter = searchParams.get('title');

  let url = 'http://127.0.0.1:8000/api/cost-category/';
  if (page && !titleFilter ) {
    url += `?page=${page}`
  } else if (titleFilter) {
    url += `?title__icontains=${titleFilter}`
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