import * as React from 'react';

import { useLocation   } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

export function usePagination(title) {
    let location = useLocation();
    let search = useSearchParams();

    const [page, setPage] = React.useState(parseInt(search[0].get('page')));

    const paginate = (n) => {
        setPage(n)
        history.pushState({}, `${title} page: ${n}`, `${location.pathname}?page=${n}` );
    }

    return {
        page,
        paginate
    }

}
