import * as React from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";

import Checkbox from "@mui/material/Checkbox";

import * as Yup from "yup";
import { useFormik } from "formik";

import { withPrimaryLayout } from "@appHocs";
import { CategorySelect } from "@appComponents/category";
import { TemplateSelect } from "@appComponents/cost";
import { useCreateCostRecord } from "@appHooks";

const initalRecord = {
  title: "",
  description: "",
  total: "",
  template: false,
  category: null,
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  description: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  total: Yup.number().positive().required("Required").integer(),
});

export function _CreateCostRecord() {
  const [template, setTemplate] = React.useState(null);

  const createCostRecordMutation = useCreateCostRecord();

  const formik = useFormik({
    initialValues: {
      ...initalRecord,
      template: false
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createCostRecordMutation.mutate(JSON.stringify(values));
      formik.resetForm();
      setTemplate(null);
    },
  });

  return (
    <main className="create-cost-wrapper">
      <h3 className="text-center">Create Cost Record</h3>

      <div className="create-cost-predefined">
        <h5 className="text-center">Select predefined template</h5>
        <TemplateSelect
          value={template}
          onChange={(template) => {
            setTemplate(template);
            formik.setValues({
              ...template,
              template: false
            });
          }}
        />
      </div>

      <form onSubmit={formik.handleSubmit} className="common-form create-cost ">
        <FormControl>
          <FormLabel>Enter Cost title</FormLabel>
          <TextField
            id="outlined-basic"
            label="Required"
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
          <FormLabel>Enter Cost description</FormLabel>
          <TextField
            id="outlined-basic"
            label="Required"
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
          <FormLabel>Total money spend</FormLabel>
          <TextField
            id="outlined-basic"
            label="Required"
            variant="outlined"
            name="total"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.total}
            error={formik.errors.total}
            helperText={formik.errors.total}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Select Category</FormLabel>
          <CategorySelect
            value={formik.values.category}
            onChange={(categoryId) => {
              formik.setFieldValue("category", categoryId);
            }}
          />
        </FormControl>
        <FormControl className="template-group">
          <div>
            <FormLabel>Add to templates?</FormLabel>
            <Checkbox
              name="template"
              inputProps={{ "aria-label": "Save as template" }}
              checked={formik.values.template}
              onChange={() => {
                formik.setFieldValue("template", !formik.values.checked);
              }}
            />
          </div>
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

export const CreateCostRecord = withPrimaryLayout(_CreateCostRecord);
