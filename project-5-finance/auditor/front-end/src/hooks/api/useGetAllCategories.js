import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useSearchParams } from 'react-router-dom';

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetAllCategories(page = null) {
  const { toast: { dispatch } } = useAppContext();
  const [searchParams] = useSearchParams();
  const titleFilter = searchParams.get('title');

  let url = '/api/cost-category/';
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
          onError: error => {
            dispatch({type: 'SHOW_TOAST', payload: {
              reason: toastReasons.error,
              content: `${error.message}. Please, check logs.`
            }});
          },
      });

     
    return result;
}