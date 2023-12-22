import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';
import { queryClient } from '@appCore';

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';


export function useUpdateCostRecord(id) {
  
  const { toast: { dispatch } } = useAppContext();

  return useMutation({
        mutationFn: (payload) => {
          return axios.put(`/api/cost-record/${id}/`, payload, {
            headers: getAxiosHeaders()
          })
        },
        onSuccess: res => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.success,
            content: 'Record updated'
          }});
          queryClient.setQueryData(['costRecordDetails'], res.data);
          queryClient.refetchQueries('allUnpaginatedCostTemplates');
        },
        onError: error => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.error,
            content: `${error.message}. Please, check logs.`
          }});
        },
      });
    }