import * as React from 'react';

import axios from 'axios';
import {
    useMutation,
  } from '@tanstack/react-query'

  import Checkbox from '@mui/material/Checkbox';



import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CircularProgress, FormControl, FormLabel } from '@mui/material';

import { withPrimaryLayout } from '@appHocs';

import { CategorySelect } from '@appComponents/category';
import { useUpdateCostRecord } from '@appHooks';
import { TemplateSelect } from '@appComponents/cost/TemplateSelect';


export function _CostRecordUpdateForm(props) {
  const { id, costRecordModel } = props;
  const [ category, setCategory ] = React.useState(costRecordModel.category || null);
  
    const updateCostRecorddMutation = useUpdateCostRecord(id);


      console.log('updateCostRecorddMutation => ', updateCostRecorddMutation)

  const handleSubmit = (event) => {
      event.preventDefault();

      updateCostRecorddMutation.mutate(JSON.stringify({ 
        title: event.target.title.value, 
        description: event.target.description.value, 
        total: event.target.total.value,
        template: event.target.template.checked,
        category: category
      }))
}

    return (
        <main>
            <h3>Update Cost Record</h3>

            {updateCostRecorddMutation.isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {updateCostRecorddMutation.isError ? (
            <div>An error occurred: {updateCostRecorddMutation.error.message}</div>
          ) : null}

          {updateCostRecorddMutation.isSuccess ? <div>Cost Record Updated!</div> : null}

          <TemplateSelect />


          <form  onSubmit={handleSubmit} className='common-form update-cost flex-col'>
                    <FormControl>
                        <FormLabel>Enter Cost title</FormLabel>
                        <TextField id="outlined-basic" label="Title" variant="outlined" defaultValue={costRecordModel.title} name="title"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Enter Cost description</FormLabel>
                        <TextField id="outlined-basic" defaultValue={costRecordModel.description} label="Description" variant="outlined" name="description" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Total money spend</FormLabel>
                        <TextField id="outlined-basic" defaultValue={costRecordModel.total} label="Total Money Spend" variant="outlined" name="total" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Select Category</FormLabel>
                        <CategorySelect 
                        value={category} onChange={categoryId => {
                            setCategory(categoryId)
                        }}
                      />
                    </FormControl>
                    <FormControl className='template-group'>
                    <div>
                        <FormLabel>Add to templates?</FormLabel>
                        <Checkbox name="template" inputProps={ { 'aria-label': 'Save as template' } } 
                        onChange={() => {
                            console.log('Toggle !!!!')
                        }} defaultChecked={costRecordModel.template} />
                    </div>
                        
                    </FormControl>
                    <Button className='submit-btn' variant='contained' type="submit">Update</Button>
                </form>
        </>
      )}
   



        </main>
       
    )
}

export const CostRecordUpdateForm = _CostRecordUpdateForm;
