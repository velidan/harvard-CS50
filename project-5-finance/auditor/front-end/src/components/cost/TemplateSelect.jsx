import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useGetAllUnpaginatedCostTemplates } from "@appHooks";

export function TemplateSelect(props) {
  const { onChange, value } = props;
  const [val, setVal] = React.useState(val);

  const {
    isPending,
    error,
    data: unpaginatedData,
  } = useGetAllUnpaginatedCostTemplates();


  React.useEffect(() => {
    setVal(value);
  }, [value])

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  if (unpaginatedData.length === 0)
    return (
      <p className="no-templates-msg font-tech ">No Saved Templates yet!</p>
    );

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="templates-select-label">
          Select Cost Template
        </InputLabel>
        <Select
          labelId="cost-record-select"
          id="cost-select"
          value={val?.id || null}
          defaultValue=""
          label="Cost Template select"
          onChange={(event) => {
            const recordId = event.target.value;
            const record = unpaginatedData.find((o) => o.id === recordId);
            onChange(record);
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
