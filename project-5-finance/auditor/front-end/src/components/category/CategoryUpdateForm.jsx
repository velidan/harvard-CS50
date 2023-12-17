import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

import { withPrimaryLayout } from '@appHocs';


import { useUpdateCategory } from '@appHooks';


export function _CategoryUpdateForm(props) {
  const { id, categoryModel } = props;
  
  // TODO: service for headers
    const updateCategoryMutation  = useUpdateCategory(id);


      console.log('updateCategoryMutation  => ', updateCategoryMutation )

  const handleSubmit = (event) => {
      event.preventDefault();

      updateCategoryMutation .mutate(JSON.stringify({ 
        title: event.target.title.value, 
        description: event.target.description.value, 
      }))
}

    return (
        <main>
            <h1>Update Category</h1>

            {updateCategoryMutation .isLoading ? (
        'Updating...'
      ) : (
        <>
          {updateCategoryMutation .isError ? (
            <div>An error occurred: {updateCategoryMutation .error.message}</div>
          ) : null}

          {updateCategoryMutation.isSuccess ? <div>Updated!</div> : null}

          <form  onSubmit={handleSubmit} className='common-form flex-col'>
                    <FormControl>
                        <FormLabel>Enter Category title</FormLabel>
                        <TextField id="outlined-basic" label="Title" variant="outlined" defaultValue={categoryModel.title} name="title"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Enter Category description</FormLabel>
                        <TextField id="outlined-basic" defaultValue={categoryModel.description} label="Description" variant="outlined" name="description" />
                    </FormControl>
                    <Button type="submit">Update</Button>
                </form>
        </>
      )}
   



        </main>
       
    )
}

export const CategoryUpdateForm = withPrimaryLayout(_CategoryUpdateForm);
