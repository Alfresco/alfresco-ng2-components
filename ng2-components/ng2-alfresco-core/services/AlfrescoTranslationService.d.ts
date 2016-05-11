import { Http } from 'angular2/http';
import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Observable';
export declare class AlfrescoTranslationLoader implements TranslateLoader {
    private http;
    private prefix;
    private suffix;
    constructor(http: Http);
    getTranslation(lang: string): Observable<any>;
}
