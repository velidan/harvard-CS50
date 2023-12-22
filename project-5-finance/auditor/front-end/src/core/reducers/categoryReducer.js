const initialState = {
    selectedCategory: null,
}

const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_SELECTED_CATEGORY':
        return {
          ...state,
          selectedCategory: action.payload,
        };
      default:
        return state;
    }
  };

export const categoryReducer = {
        initialState,
        reducer
}