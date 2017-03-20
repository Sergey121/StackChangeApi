import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';

import {toSearchParams, extractData} from '../utils/jsUtils';


@Injectable()
export class QuestionsService {
    constructor(@Inject(Http) http){

        this.http = http;
        this.rootUrl = `https://api.stackexchange.com/2.2/questions`

    }

    getAll(requestParams = {}) {
        let params = toSearchParams(requestParams);

        QuestionsService._setSite(params);

        return this.http.get(this.rootUrl, {search: params})
            .map(extractData);
    }

    get(id, requestParams) {
        let params = toSearchParams(requestParams);

        QuestionsService._setSite(params);
        params.set('filter', '!9YdnSIN18');

        return this.http.get(`${this.rootUrl}/${id}`, {search: params})
            .map(extractData);
    }

    static _setSite(params) {
        params.set('site', 'stackoverflow');
    }
}
