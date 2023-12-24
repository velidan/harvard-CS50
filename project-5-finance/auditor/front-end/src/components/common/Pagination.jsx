import * as React from "react";

import MUIPagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export function Pagination(props) {
  const { count, page, onChange } = props;

  return count > 1 ? (
    <div className="pagination">
      <Stack spacing={2}>
        <MUIPagination
          page={page}
          count={count}
          variant="outlined"
          color="primary"
          onChange={(_e, pageNumber) => {
            onChange(pageNumber);
          }}
          shape="rounded"
        />
      </Stack>
    </div>
  ) : null;
}
