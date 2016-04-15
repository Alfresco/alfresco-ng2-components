import {Injectable} from 'angular2/core';
import {Http, Response, RequestOptions, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {FolderEntity} from "./core/entities/folder.entity";
import {DocumentEntity} from "./core/entities/document.entity";

@Injectable()
export class AlfrescoService {
    constructor(private http: Http) {}

    private _host: string = 'http://192.168.99.100:8080';
    private _baseUrl: string = this._host + '/alfresco/service/slingshot/doclib/doclist/all/site/';

    getFolder(folder: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:admin')
        });
        let options = new RequestOptions({ headers: headers });
        return this.http
            .get(this._baseUrl + folder, options)
            .map(res => <FolderEntity> res.json())
            .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }

    getDocumentThumbnailUrl(document: DocumentEntity) {
        return this._host + '/alfresco/service/api/node/' + document.nodeRef.replace('://', '/') + '/content/thumbnails/doclib?c=queue&amp;ph=true&amp;lastModified=1';
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
