
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useAppContext } from '@appCore';
  import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetAllUnpaginatedCostTemplates() {

    const { toast: { dispatch } } = useAppContext();

    const result = useQuery({
        queryKey: ['allUnpaginatedCostTemplates'],
        queryFn: () =>
        axios.get('/api/cost-record/all_unpaginated_templates/').then(
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