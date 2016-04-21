import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {FolderEntity} from "./core/entities/folder.entity";
import {DocumentEntity} from "./core/entities/document.entity";

@Injectable()
export class AlfrescoService {
    constructor(private http: Http) {}

    private _host: string = 'http://127.0.0.1:8080';
    private _baseUrlPath: string = '/alfresco/service/slingshot/doclib/doclist/all/site/';

    public get host():string {
        return this._host;
    }

    public set host(value:string) {
        this._host = value;
    }

    private getBaseUrl():string {
        return this.host + this._baseUrlPath;
    }

    getFolder(folder: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:admin')
        });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this.getBaseUrl() + folder, options)
            .map(res => <FolderEntity> res.json())
            .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getDocumentThumbnailUrl(document: DocumentEntity) {
        return this._host + '/alfresco/service/api/node/' + document.nodeRef.replace('://', '/') + '/content/thumbnails/doclib?c=queue&amp;ph=true&amp;lastModified=1';
    }

    getContentUrl(document: DocumentEntity) {
        return this._host + '/alfresco/service/' + document.contentUrl;
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
