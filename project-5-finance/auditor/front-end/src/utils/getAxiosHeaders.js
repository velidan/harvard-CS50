import { getCookie } from './getCookie';

export function getAxiosHeaders(headers = {}) {
    return  {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
        ...headers
    };
}