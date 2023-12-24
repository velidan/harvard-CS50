import axios from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetAllCostRecords(page = null, categoryId=undefined) {

  const { toast: { dispatch } } = useAppContext();

  let url = '/api/cost-record/';
  
  if (page) {
    url += `?page=${page}`
  }
  
  if (categoryId && categoryId !== 'uncategorized') {
    const char = url.includes('?') ? '&' : '?'
    url += `${char}category=${categoryId}`
  } 
  
  if (categoryId === 'uncategorized') {
    const char = url.includes('?') ? '&' : '?'
    url += `${char}uncategorized=true`
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