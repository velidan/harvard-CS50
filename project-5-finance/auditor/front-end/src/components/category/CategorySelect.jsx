import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { useGetAllUnpaginatedCategories } from "@appHooks";
import { Button, CircularProgress } from "@mui/material";
import { routes } from "@appCore";

export function CategorySelect(props) {
  const { onChange, value, addUncategorized } = props;
  const navigate = useNavigate();
  const {
    isPending,
    error,
    data: unpaginatedData,
  } = useGetAllUnpaginatedCategories(addUncategorized);

  if (isPending) return <CircularProgress />;

  if (error) return "An error has occurred: " + error.message;

  if (!unpaginatedData.length) {
    return (
      <div className="category-select-none-result">
        <p className="category-select-none-result-descr font-tech font-italic ">
          You haven't created any category
        </p>
        <Button
          className="category-select-none-result-btn"
          variant="contained"
          onClick={() => {
            navigate(routes.createCategory);
          }}
        >
          Go to create category page
        </Button>
      </div>
    );
  }

  return (
    <Box className="category-select-wrapper" sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="category-select">Select Category</InputLabel>
        <Select
          labelId="category-select"
          id="category-select"
          value={value ? value : ""}
          label="Select Category"
          onChange={(event) => {
            onChange(event.target.value);
          }}
        >
          {unpaginatedData.map((o) => {
            return (
              <MenuItem key={o.id} value={o.id}>
                {o.title}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
