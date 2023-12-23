import * as React from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

import { withPrimaryLayout } from '@appHocs';


import { useUpdateCategory } from '@appHooks';
import { getUrlFromSelectedFile } from '@appUtils'

import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string()
  .min(2, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required'),
  description: Yup.string()
  .min(2, 'Too Short!')
  .max(50, 'Too Long!')
  .required('Required')
});


export function CategoryUpdateForm(props) {
  const { id, categoryModel, onPickThumbnail, onUpdateTitle, onUpdateDescription } = props;
  
  const updateCategory = useUpdateCategory(id)

  const formik = useFormik({
    initialValues: {
      ...categoryModel
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const formData = new FormData();
      formData.append('thumbnail', values.thumbnail);
      formData.append('title', values.title);
      formData.append('description', values.description);

      updateCategory.mutate(formData)
    },
  });

    return (
        <main>
            <h3>Update Category</h3>

            <form  onSubmit={formik.handleSubmit} className='common-form  flex-col' >
                    <FormControl>
                        <FormLabel>Enter Category title</FormLabel>
                        <TextField 
                        id="outlined-basic" 
                        label="Title" 
                        variant="outlined" 
                        name="title"
                        onChange={e => {
                          onUpdateTitle?.(e.target.value);
                          formik.handleChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        error={formik.errors.title}
                        helperText={formik.errors.title}
                        />

                    </FormControl>
                    
                    <FormControl>
                        <FormLabel>Enter Category description</FormLabel>
                        <TextField 
                        id="outlined-basic" 
                        label="Description" 
                        variant="outlined" 
                        name="description"
                        onChange={
                          e => {
                            onUpdateDescription?.(e.target.value);
                            formik.handleChange(e);
                          }
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        error={formik.errors.description}
                        helperText={formik.errors.description}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Pick Category thumbnail</FormLabel>
                        <label className='file-pick-label' >
                          Pick
                        <input accept='.png, .jpg, .jpeg, .webp' type='file' onChange={e => {
                          const fileUrl = e.target.value;
                          const files = e.target.files;
                          getUrlFromSelectedFile(files, (url) => {
                            onPickThumbnail(url);
                          })
                          console.log('files', files, fileUrl)
                          formik.setFieldValue('thumbnail', files[0])
                        }} />
                        </label>
                        
                    </FormControl>
                    <Button className='submit-btn' variant='contained' type="submit" disabled={formik.isSubmitting}>Submit</Button>
                </form>


        </main>
       
    )
}

