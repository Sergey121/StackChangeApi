import {URLSearchParams} from '@angular/http';

export let extractData = (res) => {
    let body = res.json();
    return body || { };
};

export let toSearchParams = ((requestData = {}) => {
    let params = new URLSearchParams();
    Object.keys(requestData).map(key => {
        params.set(key, requestData[key]);
    });
    return params;
});
