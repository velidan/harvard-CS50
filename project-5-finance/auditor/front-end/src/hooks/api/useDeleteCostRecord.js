import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';

import { useAppContext, queryClient } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';


  export function useDeleteCostRecord(id) {
    const { toast: { dispatch } } = useAppContext();
    return useMutation({
        mutationFn: (payload) => {
          return axios.delete(`/api/cost-record/${id}`, {
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
            content: 'Record deleted'
          }});
          queryClient.refetchQueries('allCostRecords');
        }
      })

}
