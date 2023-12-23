import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';
import { queryClient } from '@appCore';

import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';


export function useUpdateCategory(id) {
  
  const { toast: { dispatch } } = useAppContext();

  return useMutation({
        mutationFn: (payload) => {
          return axios.put(`/api/cost-category/${id}/`, payload, {
            headers: getAxiosHeaders({
              'Content-Type': 'multipart/form-data'
            })
          })
        },
        onSuccess: res => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.success,
            content: 'Category updated'
          }});
          queryClient.setQueryData(['categoryDetails'], res.data)
        },
        onError: error => {
          dispatch({type: 'SHOW_TOAST', payload: {
            reason: toastReasons.error,
            content: `${error.message}. Please, check logs.`
          }});
          
        },
        
      });
    }