import * as React from 'react';
import { useParams   } from 'react-router-dom';

import {
    useQuery,
  } from '@tanstack/react-query'
  import axios from 'axios';

import { withPrimaryLayout } from '@appHocs';
import { CategoryUpdateForm } from '@appComponents/category';

export function _Category() {
    let { id } = useParams();

    const { isPending, error, data } = useQuery({
        queryKey: ['categoryDetails'],
        queryFn: () =>
        axios.get(`http://127.0.0.1:8000/api/cost-category/${id}`).then(
            (res) => {
                return res.data;
            },
          ),
      })

      console.log('data 0> ', data);

      if (isPending) return 'Fetching category details...'

      if (error) return 'An error has occurred: ' + error.message
    


    return (
        <div>
            <div>
                <h1><b>Title:</b> {data.title}</h1>
                <p><b>Description:</b> {data.description}</p>
                <p><b>ID:</b> ${data.id}</p>
            </div>
            {id && data && <CategoryUpdateForm id={id} categoryModel={data} />}
        </div>

    )
}

export const Category = withPrimaryLayout(_Category);
