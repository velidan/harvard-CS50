
import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

  export function useCreateCategory() {
    const { toast: { dispatch } } = useAppContext();

    return useMutation({
        mutationFn: (payload) => {
          return axios.post('/api/cost-category/', payload, {
            headers: getAxiosHeaders({
              'Content-Type': 'multipart/form-data'
            })
          })
        },
        onError: error => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.error,
            content: `${error.message}. Please, check logs.`
          }});
        },
        onSuccess: () => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.success,
            content: 'Category created'
          }});
        }

      })

}
