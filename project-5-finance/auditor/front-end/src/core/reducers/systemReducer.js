const initialState = {
    isDrawerOpen: false,
}

const reducer =  (state, action) => {
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

export const systemReducer = {
        initialState,
        reducer
}