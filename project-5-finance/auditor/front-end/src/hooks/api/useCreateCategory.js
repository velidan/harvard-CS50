
import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

import { getAxiosHeaders } from '@appUtils';


  export function useCreateCategory() {

    return useMutation({
        mutationFn: (payload) => {
          return axios.post('http://127.0.0.1:8000/api/cost-category/', payload, {
            headers: getAxiosHeaders()
          })
        },
      })

}
