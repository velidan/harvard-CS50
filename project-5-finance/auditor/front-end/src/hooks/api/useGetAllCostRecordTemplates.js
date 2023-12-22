import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { useAppContext } from "@appCore";
import { toastReasons } from "@appCore/reducers/toastReducer";

export function useGetAllCostRecordTemplates() {
  const {
    toast: { dispatch },
  } = useAppContext();

  const result = useQuery({
    queryKey: ["allCostRecordTemplates"],
    queryFn: () =>
      axios.get(`/api/cost-record/templates/`).then((res) => {
        return res.data;
      }),
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
