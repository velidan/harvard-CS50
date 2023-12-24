import * as React from "react";

import { Pagination } from "@appComponents/common";
import Button from "@mui/material/Button";
import { withPrimaryLayout } from "@appHocs";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { CostRecordPreview } from "@appComponents/cost/CostRecordPreview";
import { CategorySelect } from "@appComponents/category";
import {
  useGetAllCostRecords,
  useGetCostsTotal,
  usePagination,
} from "@appHooks";
import { routes } from '@appCore';
import { PieDiagram } from "@appComponents/common";

export function _AllCostRecords() {
  const [category, setCategory] = React.useState(null);
  const [finalPage, setFinalPage] = React.useState(null);
  const navigate = useNavigate();

  const { page, paginate } = usePagination("Costs");


  React.useEffect(() => {

      setFinalPage(page);

  }, [page])

  const { isPending, data } = useGetAllCostRecords(finalPage, category);
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
      <div className="flex flex-col left-col">
        <div>
          <b className="filter-catetogy-title">Filter costs by category:</b>

          <div className="reset-category-actions">
            <CategorySelect
              addUncategorized
              value={category}
              onChange={(categoryId) => {
                setCategory(categoryId);
                setFinalPage(null);
              }}
            />

            {category && (
              <Button
                className="reset-category"
                variant="contained"
                onClick={() => {
                  setCategory(null);
                  setFinalPage(null);
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
           <div className="no-content-box">
            <p>
            <span className="no-content-box-intro">Whoops</span>  <br />
            <i>You have not created any cost record yet! </i>🥲
            </p>
            
            <Button style={{marginTop: 8}} variant="contained"
            onClick={() => {
                navigate(routes.createCostRecord);
            }} 
          >
              Create one
          </Button>
           </div>
          )}
        </div>
      </div>
      <div className="right-col">
        <h2 className="text-center">Total spent: {totalCostsValue}</h2>
        <PieDiagram 
          categoryId={category}
          onSegmentClick={ categoryId => {
          setCategory(categoryId);
          setFinalPage(null);
          console.log('categoryId', categoryId)
        }} />
      </div>
    </div>
  );
}

export const AllCostRecords = withPrimaryLayout(_AllCostRecords);
