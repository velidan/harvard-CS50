import * as React from 'react';

import * as ReactDOM from "react-dom/client";
import { Outlet, Link } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";


import { AppContextProvider, routes } from './core';
import { Home, Error, CostRecord, CreateCostRecord, Contact, AllCategories, About, Category, AllCostRecords, AllCostRecordTemplates } from './components/pages';
import { CreateCategory } from './components/pages/CreateCategory';

import { queryClient } from '@appCore';

const router = createBrowserRouter([
    {
      path: routes.home,
      element: <Home />,
    },
    {
      path: routes.contact,
      element: <Contact />,
    },
    {
      path: routes.about,
      element: <About />,
    },
    {
      path: routes.costRecords,
      element: <AllCostRecords />,
    },
    {
      path: routes.costRecordTemplates,
      element: <AllCostRecordTemplates />,
    },
    {
      path: routes.costRecord,
      element: <CostRecord />,
    },
    {
      path: routes.createCostRecord,
      element: <CreateCostRecord />,
    },
    {
      path: routes.categories,
      element: <AllCategories />,
    },
    {
      path: routes.category,
      element: <Category />,
    },
    {
      path: routes.createCategory,
      element: <CreateCategory />,
    },
    {
      path: "/*",
      element: <Error />,

    },
  ]);

function _App() {
    return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
          <React.StrictMode>
          <RouterProvider router={router} />
          </React.StrictMode>
      </AppContextProvider>
    </QueryClientProvider>
    )
}

export const App = _App;