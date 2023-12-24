import * as React from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { withPrimaryLayout } from "@appHocs";

import { CostRecordUpdateForm } from "@appComponents/cost";

import { useGetCostRecord } from "@appHooks";
import { Divider } from "@mui/material";

export function _CostRecord() {
  let { id } = useParams();

  const { isPending, data } = useGetCostRecord(id);

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="complex-content-grid cost">
      <div>
        {data && id && <CostRecordUpdateForm id={id} costRecordModel={data} />}
      </div>

      <div className="cost-record-preview-box">
        <div className="cost-record-preview ">
          <h3>
            <b>Title:</b> {data.title}
          </h3>
          <p>
            <b>Description:</b> {data.description}
          </p>
          <p>
            <b>ID:</b> {data.id}
          </p>
          <p>
            <b>Total:</b> {data.total}
          </p>
          <Divider className="divider" />
          <b className="template-remark">
            {data.template && <i>Cost record in templates!</i>}
          </b>
        </div>
      </div>
    </div>
  );
}

export const CostRecord = withPrimaryLayout(_CostRecord);
