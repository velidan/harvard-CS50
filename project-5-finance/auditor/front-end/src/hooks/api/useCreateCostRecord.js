import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';

import { useAppContext, queryClient } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';


  export function useCreateCostRecord() {
    const { toast: { dispatch } } = useAppContext();
    return useMutation({
        mutationFn: (payload) => {
          return axios.post('/api/cost-record/', payload, {
            headers: getAxiosHeaders()
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
            content: 'Record created'
          }});
          queryClient.refetchQueries('allUnpaginatedCostTemplates');
        }
      })

}
