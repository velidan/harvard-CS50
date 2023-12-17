import React, { createContext, useContext, useReducer } from 'react';

import { systemReducer, costReducer, categoryReducer } from './reducers';

const AppContext = createContext();


export const AppContextProvider = ({ children }) => {

  const [systemState, systemStateDispatch] = useReducer(systemReducer.reducer, systemReducer.initialState);
  const [costState, costStateDispatch] = useReducer(costReducer.reducer, costReducer.initialState);
  const [categoryState, categoryStateDispatch] = useReducer(categoryReducer.reducer, categoryReducer.initialState);


  return (
    <AppContext.Provider 
      value={{ 
        system: {
          state: systemState, 
          dispatch: systemStateDispatch 
        },
        cost: {
          state: costState, 
          dispatch: costStateDispatch 
        },
        category: {
          state: categoryState, 
          dispatch: categoryStateDispatch 
        },
      }}
    
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};