import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetCostsTotal(category = null) {

  const { toast: { dispatch } } = useAppContext();

  let url = '/api/cost-record/costs_total';
  if (category ) {
    url += `?category=${category}`
  } 

    const result = useQuery({
        queryKey: ['costsTotal', category],
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
      });

     
    return result;
}