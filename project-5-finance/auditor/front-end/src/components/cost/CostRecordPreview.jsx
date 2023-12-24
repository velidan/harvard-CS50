import * as React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@appCore";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useDeleteCostRecord } from "@appHooks";

export function CostRecordPreview(props) {
  const { id, title, description, total } = props;
  const navigate = useNavigate();

  const deleteMutation = useDeleteCostRecord(id);

  return (
    <Paper className="preview" key={`record-${id}`}>
      <div className="preview-info">
        <p>
          <b>Title</b>: {title}
        </p>
        <p>
          <b>Description</b>: {description}
        </p>
        <p>
          <b>Total</b>: {total}
        </p>
      </div>

      <div className="actions">
        <Button
          variant="contained"
          onClick={() => {
            navigate(routes.getCostRecordRoute(id));
          }}
        >
          Details
        </Button>
        {deleteMutation.isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              deleteMutation.mutate();
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </Paper>
  );
}
