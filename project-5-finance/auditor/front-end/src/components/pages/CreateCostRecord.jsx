import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

import { withPrimaryLayout } from '@appHocs';

import { TemplateSelect } from '@appComponents/cost';
import { useCreateCostRecord } from '@appHooks';

export function _CreateCostRecord() {

  const [template, setTemplate] = React.useState(null);


  // TODO: service for headers
    const createCostRecordMutation = useCreateCostRecord();


      console.log('createCostRecordMutation => ', createCostRecordMutation)

const handleSubmit = (event) => {
      event.preventDefault();

      createCostRecordMutation.mutate(JSON.stringify({ 
        title: event.target.title.value, 
        description: event.target.description.value, 
        total: event.target.total.value, 
        }))
}

    return (
        <main>
            <h1>Create Cost Record</h1>

            {createCostRecordMutation.isLoading ? (
        'Creating...'
      ) : (
        <>
          {createCostRecordMutation.isError ? (
            <div>An error occurred: {createCostRecordMutation.error.message}</div>
          ) : null}

          {createCostRecordMutation.isSuccess ? <div>Record added!</div> : null}

          <TemplateSelect  value={template} onChange={template => {
                setTemplate(template);
            }} />

          <form  onSubmit={handleSubmit} className='common-form flex-col'>
                    <FormControl>
                        <FormLabel>Enter Cost title</FormLabel>
                        <TextField id="outlined-basic" label="Title" variant="outlined" name="title"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Enter Cost description</FormLabel>
                        <TextField id="outlined-basic" label="Description" variant="outlined" name="description" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Total money spend</FormLabel>
                        <TextField id="outlined-basic" label="Total Money Spend" variant="outlined" name="total" />
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
        </>
      )}
   



        </main>
       
    )
}

export const CreateCostRecord = withPrimaryLayout(_CreateCostRecord);
