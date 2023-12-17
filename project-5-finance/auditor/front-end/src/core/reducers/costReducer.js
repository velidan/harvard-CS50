const initialState = {
    selectedTemplate: null,
}

const reducer =  (state, action) => {
    switch (action.type) {
      case 'SET_SELECTED_TEMPLATE':
        return {
          ...state,
          selectedTemplate: action.payload,
        };
      default:
        return state;
    }
  };

export const costReducer = {
        initialState,
        reducer
}