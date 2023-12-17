import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

import { withPrimaryLayout } from '@appHocs';

import { useCreateCategory } from '@appHooks';

export function _CreateCategory() {

  
  // TODO: service for headers
    const createCategoryMutation = useCreateCategory()


const handleSubmit = (event) => {
      event.preventDefault();

      createCategoryMutation.mutate(JSON.stringify({ 
        title: event.target.title.value, 
        description: event.target.description.value 
        }))
}

    return (
        <main>
            <h1>Create New Category</h1>

            {createCategoryMutation.isLoading ? (
        'Creating...'
      ) : (
        <>
          {createCategoryMutation.isError ? (
            <div>An error occurred: {createCategoryMutation.error.message}</div>
          ) : null}

          {createCategoryMutation.isSuccess ? <div>Category created!</div> : null}

          <form  onSubmit={handleSubmit} className='common-form flex-col'>
                    <FormControl>
                        <FormLabel>Enter Category title</FormLabel>
                        <TextField id="outlined-basic" label="Title" variant="outlined" name="title"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Enter Category description</FormLabel>
                        <TextField id="outlined-basic" label="Description" variant="outlined" name="description" />
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
        </>
      )}
   



        </main>
       
    )
}

export const CreateCategory = withPrimaryLayout(_CreateCategory);
