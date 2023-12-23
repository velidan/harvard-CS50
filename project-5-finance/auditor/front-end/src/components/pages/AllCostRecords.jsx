import * as React from "react";

import { Pagination } from "@appComponents/common";
import Button from "@mui/material/Button";
import { withPrimaryLayout } from "@appHocs";
import CircularProgress from "@mui/material/CircularProgress";

import { CostRecordPreview } from "@appComponents/cost/CostRecordPreview";
import { CategorySelect } from "@appComponents/category";
import {
  useGetAllCostRecords,
  useGetCostsTotal,
  usePagination,
} from "@appHooks";

import { PieDiagram } from "@appComponents/common";

export function _AllCostRecords() {
  const [category, setCategory] = React.useState(null);

  const { page, paginate } = usePagination("Costs");

  const { isPending, data } = useGetAllCostRecords(page, category);
  const { data: totalCostsValue } = useGetCostsTotal();
  console.log("totalCostsValue -L>> ", totalCostsValue);

  if (isPending)
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );

  return (
    <div className="complex-content-grid common-wrapper records">
      <div className="flex flex-col">
        <div>
          <b>Filter costs by category:</b>

          <div className="reset-category-actions">
            <CategorySelect
              value={category}
              onChange={(categoryId) => {
                setCategory(categoryId);
              }}
            />

            {category && (
              <Button
                className="reset-category"
                variant="contained"
                onClick={() => {
                  setCategory(null);
                }}
              >
                Reset Category
              </Button>
            )}
          </div>
        </div>

        <div className="content-list">
          <h5 className="content-title">Your spent cost records</h5>
          {data.results.length ? (
            <div className="flex flex-col grow justify-between">
              <div>
                {data.results.map((cost) => {
                  return (
                    <CostRecordPreview
                      key={cost.id}
                      id={cost.id}
                      title={cost.title}
                      description={cost.description}
                      total={cost.total}
                    />
                  );
                })}
              </div>
             

              <Pagination
                page={!page ? 1 : page}
                count={data.total_pages}
                onChange={(pageNumber) => {
                  paginate(pageNumber);
                }}
              />
            </div>
          ) : (
            "No Cost records"
          )}
        </div>
      </div>
      <div>
        <h2 className="text-center">Total spent: {totalCostsValue}</h2>
        <PieDiagram />
      </div>
    </div>
  );
}

export const AllCostRecords = withPrimaryLayout(_AllCostRecords);
