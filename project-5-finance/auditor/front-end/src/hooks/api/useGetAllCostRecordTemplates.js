import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { useAppContext } from "@appCore";
import { toastReasons } from "@appCore/reducers/toastReducer";

export function useGetAllCostRecordTemplates(page = null) {
  const {
    toast: { dispatch },
  } = useAppContext();


  let url = '/api/cost-record/templates/';
  if (page ) {
    url += `?page=${page}`
  }


  const result = useQuery({
    queryKey: ["allCostRecordTemplates", page],
    queryFn: () =>
      axios.get(url).then((res) => {
        return res.data;
      }),
      keepPreviousData: true,
    onError: (error) => {
      dispatch({
        type: "SHOW_TOAST",
        payload: {
          reason: toastReasons.error,
          content: `${error.message}. Please, check logs.`,
        },
      });
    },
  });

  return result;
}
