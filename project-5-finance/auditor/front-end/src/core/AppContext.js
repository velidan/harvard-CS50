import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const initialState = {
    isDrawerOpen: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DRAWER_OPEN':
        return {
          ...state,
          isDrawerOpen: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};