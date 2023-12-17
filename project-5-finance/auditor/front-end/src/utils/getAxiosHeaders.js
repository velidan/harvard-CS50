import { getCookie } from './getCookie';

export function getAxiosHeaders() {
    return  {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')  
    };
}