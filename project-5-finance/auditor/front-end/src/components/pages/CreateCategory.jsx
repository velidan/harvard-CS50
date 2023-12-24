import * as React from 'react';

import { CategoryCard, CategoryForm } from '@appComponents/category';
import { withPrimaryLayout } from '@appHocs';


import { useCreateCategory } from '@appHooks';

const initialCategory = {
  title: '', 
  description: '', 
  thumbnail: null
}



export function _CreateCategory() {

  const [state, setState] = React.useState({
    title: "",
    description: "",
    thumbnail: null,
  });


  const handleField = (fieldName) => (val) => {
    setState({
      ...state,
      [fieldName]: val,
    });
  };
  


    return (
        <main>
              <div className="complex-content-grid create-category common-wrapper">
                <div className='create-category-lef-col'>
                <h3>Create New Category</h3>

                <CategoryForm
                mode="create"
                categoryModel={state}
                onPickThumbnail={handleField("thumbnail")}
                onUpdateTitle={handleField("title")}
                onUpdateDescription={handleField("description")}
                
              />

                </div>
                <div className='category-preview-wrapper create-category-right-col' >
                  <h3 className='text-center'>Category Preview</h3>
                  <CategoryCard
                    thumbnailUrl={state.thumbnail}
                    title={state.title}
                    description={state.description}
                  />
                </div>
              </div>

        </main>
       
    )
}

export const CreateCategory = withPrimaryLayout(_CreateCategory);
