import { Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
export declare class AlfrescoTranslationLoader {
    private http;
    private prefix;
    private suffix;
    constructor(http: Http);
    getTranslation(lang: string): Observable<any>;
}
