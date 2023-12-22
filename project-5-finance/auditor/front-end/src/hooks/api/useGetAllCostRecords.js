import axios from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetAllCostRecords(page = null, categoryId=null) {

  const { toast: { dispatch } } = useAppContext();

  let url = '/api/cost-record/';
  if (page && !categoryId) {
    url += `?page=${page}`
  } else if (categoryId) {
    url += `?category=${categoryId}`
  }

    const result = useQuery({
        queryKey: ['allCostRecords', page, categoryId],
        queryFn: () =>
        axios.get(url).then(
            (res) => {
                return res.data;
            },
          ),
        onError: error => {
            dispatch({type: 'SHOW_TOAST', payload: {
              reason: toastReasons.error,
              content: `${error.message}. Please, check logs.`
            }});
        },
      })

     
    return result;
}