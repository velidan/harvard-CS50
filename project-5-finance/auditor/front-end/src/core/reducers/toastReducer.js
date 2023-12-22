export const toastReasons = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning'
}
const initialState = {
    reason: toastReasons.success,
    content: null,
}

const reducer = (state, action) => {
    
    switch (action.type) {
      case 'SHOW_TOAST':
        const { content, reason } = action.payload;
        return {
          reason,
          content,
          show: true
        };
      case 'HIDE_TOAST':
        return {
            ...state,
            show: false
        }
      default:
        return state;
    }
  };

export const toastReducer = {
        initialState,
        reducer
}