
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

export function useLogout() {

    const result = useQuery({
        queryKey: ['logout'],
        enabled: false,
        queryFn: () =>
        axios.get(`http://127.0.0.1:8000/logout`).then(
            () => {
               window?.location?.reload();
            },
          ),
      })


      return result;
    }
