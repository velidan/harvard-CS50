
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 

  import { useAppContext } from '@appCore';
  import { toastReasons } from '@appCore/reducers/toastReducer';
export function useLogout() {

  const { toast: { dispatch } } = useAppContext();

    const result = useQuery({
        queryKey: ['logout'],
        enabled: false,
        queryFn: () =>
        axios.get(`/logout`).then(
            () => {
               window?.location?.reload();
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
