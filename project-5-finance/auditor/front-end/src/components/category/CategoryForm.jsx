import * as React from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";

import { useCreateCategory } from "@appHooks";
import { useUpdateCategory } from "@appHooks";
import { getUrlFromSelectedFile } from "@appUtils";

import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

export function CategoryForm(props) {
  const {
    id,
    categoryModel,
    onReset,
    onPickThumbnail,
    onUpdateTitle,
    onUpdateDescription,
    mode,
  } = props;

  console.log('categoryModel', categoryModel)

  const mutation =
    mode === "create" ? useCreateCategory() : useUpdateCategory(id);

  React.useEffect(() => {
    if (mutation.isError) {
      onSubmitError();
    }
  }, [mutation.isError]);

  const formik = useFormik({
    initialValues: {
      ...categoryModel,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      formData.append("title", values.title);
      formData.append("description", values.description);

      mutation.mutate(formData);

      if (mode === "create") {
        formik.resetForm();
        onReset();
      }

      return Promise.resolve();
    },
  });

  React.useEffect(() => {
    if (categoryModel.id) {
      formik.setValues(categoryModel);
    }
   
  }, [categoryModel])


  return (
    <main>
      <form onSubmit={formik.handleSubmit} className="common-form  flex-col">
        <FormControl>
          <FormLabel>Enter Category title</FormLabel>
          <TextField
            id="cat-title-basic"
            label="Title"
            variant="outlined"
            name="title"
            onChange={(e) => {
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
            id="cat-description-basic"
            label="Description"
            variant="outlined"
            name="description"
            onChange={(e) => {
              onUpdateDescription?.(e.target.value);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            error={formik.errors.description}
            helperText={formik.errors.description}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Pick Category thumbnail</FormLabel>
          <label className="file-pick-label">
            Pick
            <input
              accept=".png, .jpg, .jpeg, .webp"
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                getUrlFromSelectedFile(files, (url) => {
                  onPickThumbnail(url);
                });
                formik.setFieldValue("thumbnail", files[0]);
              }}
            />
          </label>
        </FormControl>
        <Button
          className="submit-btn"
          variant="contained"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </main>
  );
}
