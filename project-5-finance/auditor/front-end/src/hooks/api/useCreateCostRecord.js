import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';
import { queryClient } from '@appCore';


  export function useCreateCostRecord() {

    return useMutation({
        mutationFn: (payload) => {
          return axios.post('http://127.0.0.1:8000/api/cost-record/', payload, {
            headers: getAxiosHeaders()
          })
        },
        onSuccess: () => {
          queryClient.refetchQueries('allUnpaginatedCostTemplates');
        }
      })

}
