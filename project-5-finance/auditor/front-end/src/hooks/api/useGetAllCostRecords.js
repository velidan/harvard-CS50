import axios from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'


export function useGetAllCostRecords(page = null, categoryId=null) {

  console.log('categoryId -> ', categoryId);
  let url = 'http://127.0.0.1:8000/api/cost-record/';
  if (page && !categoryId) {
    url += `?page=${page}`
  } else if (categoryId) {
    url += `?category=${categoryId}`
  }

    const result = useQuery({
        queryKey: ['allCostRecords', page, categoryId],
        queryFn: () =>
        axios.get(url).then(
            (res) => {
                return res.data;
            },
          ),
      })

     
    return result;
}