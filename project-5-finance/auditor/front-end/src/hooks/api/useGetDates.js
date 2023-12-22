import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useAppContext } from '@appCore';
  import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetDates() {

  const { toast: { dispatch } } = useAppContext();

  let url = '/api/cost-record/created_years_months/';

    const result = useQuery({
        queryKey: ['getDates'],
        queryFn: () =>
        axios.get(url).then(
            (res) => {
                return res.data;
            },
          ),
          keepPreviousData: true,
          onError: error => {
            dispatch({type: 'SHOW_TOAST', payload: {
              reason: toastReasons.error,
              content: `${error.message}. Please, check logs.`
            }});
          },
      });

     
    return result;
}