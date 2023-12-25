import * as React from "react";

import Checkbox from "@mui/material/Checkbox";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CircularProgress, FormControl, FormLabel } from "@mui/material";

import { CategorySelect } from "@appComponents/category";
import { useUpdateCostRecord } from "@appHooks";
import { TemplateSelect } from "@appComponents/cost/TemplateSelect";

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
  total: Yup.number().positive().required("Required").integer(),
});


export function _CostRecordUpdateForm(props) {
  const { id, costRecordModel } = props;

  const updateCostRecorddMutation = useUpdateCostRecord(id);

  const formik = useFormik({
    initialValues: {
      ...costRecordModel,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      updateCostRecorddMutation.mutate(JSON.stringify(values));
      formik.resetForm();
      setTemplate(null);
    },
  });



  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   updateCostRecorddMutation.mutate(
  //     JSON.stringify({
  //       title: event.target.title.value,
  //       description: event.target.description.value,
  //       total: event.target.total.value,
  //       template: event.target.template.checked,
  //       category: category,
  //     })
  //   );

  //   // could use formit but just to show how it could be handled without it
  //   event.target.title = ''
  //   event.target.description.value = ''
  //   event.target.total.value = ''
  //   event.target.template.checked = ''
  // };

  return (
    <main>
      <h3 className="update-cost-title">Update Cost Record</h3>

      {updateCostRecorddMutation.isLoading ? (
        <CircularProgress />
      ) : (
        <>

          <form
            onSubmit={formik.handleSubmit}
            className="common-form update-cost flex-col"
          >
            <FormControl>
              <FormLabel>Enter Cost title</FormLabel>
              <TextField
               id="title-basic"
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
                id="description-basic"
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
              <FormLabel>Total money spend</FormLabel>
              <TextField
                id="total-basic"
                label="Total Money Spend"
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
                                  formik.setFieldValue("template", !formik.values.template);
                                }}
                />
              </div>
            </FormControl>
            <Button className="submit-btn" variant="contained" type="submit" disabled={formik.isSubmitting}>
              Update
            </Button>
          </form>
        </>
      )}
    </main>
  );
}

export const CostRecordUpdateForm = _CostRecordUpdateForm;
