import * as React from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { withPrimaryLayout } from "@appHocs";
import {
  CategoryCard,
  CategoryForm,
} from "@appComponents/category";

import { useGetCategory } from "@appHooks";

export function _Category() {
  let { id } = useParams();

  const [state, setState] = React.useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const { isPending, data } = useGetCategory(id);

  const handleField = (fieldName) => (val) => {
    setState({
      ...state,
      [fieldName]: val,
    });
  };

  React.useEffect(() => {
    if (data) {
      setState(data);
    }
  }, data);

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  return (
    <main>
      <div className="complex-content-grid create-category update common-wrapper">
        <div>
          <h3>Update Category</h3>
          {id && data && (
            <CategoryForm
              mode="update"
              id={id}
              categoryModel={data}
              onSubmitError={() => {
                setState(data);
              }}
              onPickThumbnail={handleField("thumbnail")}
              onUpdateTitle={handleField("title")}
              onUpdateDescription={handleField("description")}
            />
          )}
        </div>
        <div className="category-preview-box">
          <div className="category-preview-wrapper">
            <h3 className="text-center">Category Preview</h3>
            <CategoryCard
              thumbnailUrl={state.thumbnail}
              title={state.title}
              description={state.description}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export const Category = withPrimaryLayout(_Category);
