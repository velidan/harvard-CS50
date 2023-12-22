import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';
import * as Yup from 'yup';
import { CategoryCard } from '@appComponents/category';
import { withPrimaryLayout } from '@appHocs';

import { useFormik } from 'formik';


import { useCreateCategory } from '@appHooks';
import { getUrlFromSelectedFile } from '@appUtils'

const initialCategory = {
  title: '', 
  description: '', 
  thumbnail: null
}

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


export function _CreateCategory() {
  const [thumbnail, setThumbnail] = React.useState(null)
 
  const formik = useFormik({
    initialValues: {
      ...initialCategory
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const formData = new FormData();
      formData.append('thumbnail', values.thumbnail);
      formData.append('title', values.title);
      formData.append('description', values.description);

      createCategoryMutation.mutate(formData)
      formik.resetForm();
    },
  });
  
  // TODO: service for headers
    const createCategoryMutation = useCreateCategory()


    return (
        <main>
              <div class="complex-content-grid">
                <div>
                <h1>Create New Category</h1>
                <form  onSubmit={formik.handleSubmit} className='common-form flex-col' >
                    <FormControl>
                        <FormLabel>Enter Category title</FormLabel>
                        <TextField 
                        id="outlined-basic" 
                        label="Title" 
                        variant="outlined" 
                        name="title"
                        onChange={formik.handleChange}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        error={formik.errors.description}
                        helperText={formik.errors.description}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Pick Category thumbnail</FormLabel>
                        <input accept='.png, .jpg, .jpeg, .webp' type='file' onChange={e => {
                          const fileUrl = e.target.value;
                          const files = e.target.files;
                          getUrlFromSelectedFile(files, (url) => {
                            setThumbnail(url);
                          })
                          console.log('files', files, fileUrl)
                          formik.setFieldValue('thumbnail', files[0])
                        }} />
                    </FormControl>
                    <Button type="submit" disabled={formik.isSubmitting}>Submit</Button>
                </form>

                </div>
                <div>
                  <h5>Category Preview</h5>
                  <CategoryCard
                    thumbnailUrl={thumbnail}
                    title={formik.values.title}
                    description={formik.values.description}
                  />
                </div>
              </div>
          



            





        </main>
       
    )
}

export const CreateCategory = withPrimaryLayout(_CreateCategory);
