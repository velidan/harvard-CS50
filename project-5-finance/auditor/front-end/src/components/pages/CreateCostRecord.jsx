import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

import Checkbox from '@mui/material/Checkbox';

import { withPrimaryLayout } from '@appHocs';
import { CategorySelect } from '@appComponents/category';
import { TemplateSelect } from '@appComponents/cost';
import { useCreateCostRecord } from '@appHooks';

const initalRecord = {
  title: '', 
  description: '', 
  total: 0,
  template: false,
  category: null
}


export function _CreateCostRecord() {

  // const [template, setTemplate] = React.useState(null);
  const [record, setRecord] = React.useState(initalRecord);



  const handleField = (fieldName, value) => {
    setRecord({
      ...record,
      [fieldName]: value
    })
  }

  console.log('record  ->>>> ', record);

  // TODO: service for headers
    const createCostRecordMutation = useCreateCostRecord();



const handleSubmit = (event) => {
      event.preventDefault();

      createCostRecordMutation.mutate(JSON.stringify(record))
      setRecord({...initalRecord});
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

          <TemplateSelect  value={record.template} onChange={template => {
                setRecord(template);
            }} />

          <form  onSubmit={handleSubmit} className='common-form flex-col'>
                    <FormControl>
                        <FormLabel>Enter Cost title</FormLabel>
                        <TextField id="outlined-basic" label="Title" variant="outlined" name="title"
                        
                        value={record.title}
                        onChange={(event) => {
                          handleField('title', event.target.value);
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Enter Cost description</FormLabel>
                        <TextField id="outlined-basic" label="Description" variant="outlined" name="description"
                        
                        value={record.description}
                        onChange={(event) => {
                          handleField('description', event.target.value);
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Total money spend</FormLabel>
                        <TextField id="outlined-basic" label="Total Money Spend" variant="outlined" name="total"
                        
                        value={record.total}
                        onChange={(event) => {
                          handleField('total', parseFloat(event.target.value || 0));
                        }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Select Category</FormLabel>
                        <CategorySelect 
                        value={record.category} onChange={categoryId => {
                          handleField('category', categoryId)
                        }}
                      />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Add to templates?</FormLabel>
                        <Checkbox name="template" inputProps={ { 'aria-label': 'Save as template' } } 
                        checked={record.checked}
                        onChange={() => {
                          handleField('checked', !record.checked)
                        }} />
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
        </>
      )}
   



        </main>
       
    )
}

export const CreateCostRecord = withPrimaryLayout(_CreateCostRecord);
