import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';
import { queryClient } from '@appCore';

export function useUpdateCostRecord(id) {
  
  return useMutation({
        mutationFn: (payload) => {
          return axios.put(`http://127.0.0.1:8000/api/cost-record/${id}/`, payload, {
            headers: getAxiosHeaders()
          })
        },
        onSuccess: res => {
          queryClient.setQueryData(['costRecordDetails'], res.data);
          queryClient.refetchQueries('allUnpaginatedCostTemplates');
        }
      });
    }