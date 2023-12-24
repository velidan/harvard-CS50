
import axios from 'axios';

import {
    useQuery,
  } from '@tanstack/react-query'
 
  import { useAppContext } from '@appCore';
import { toastReasons } from '@appCore/reducers/toastReducer';

export function useGetAllUnpaginatedCategories(addUncategorized) {
  const { toast: { dispatch } } = useAppContext();

    const result = useQuery({
        queryKey: ['allUnpaginatedCategories'],
        queryFn: () =>
        axios.get('/api/cost-category/all_unpaginated_categories/').then(
            (res) => {
     
                return addUncategorized && Boolean(res.data.length) ? [
                  {
                    id: 'uncategorized',
                    title: 'Uncategorized'
                  },
                  ...res.data,
                  
                ] : res.data;
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