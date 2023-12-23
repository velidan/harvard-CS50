import * as React from 'react';
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useAppContext } from '@appCore';
  import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetCategory(id) {
  const { toast: { dispatch } } = useAppContext();
    const result = useQuery({
        queryKey: ['categoryDetails'],
        queryFn: () =>
        axios.get(`/api/cost-category/${id}`).then(
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