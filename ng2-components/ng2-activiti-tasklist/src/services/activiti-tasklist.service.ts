/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { AlfrescoSettingsService } from 'ng2-alfresco-core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FilterModel } from '../models/filter.model';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';

import { TaskDetailsModel } from '../models/task-details.model';

@Injectable()
export class ActivitiTaskListService {

    constructor(private http: Http, public alfrescoSettingsService: AlfrescoSettingsService) {
    }

    /**
     * Retrive all the Tasks filters
     * @returns {Observable<any>}
     */
    getTaskListFilters(): Observable<any> {
        return Observable.fromPromise(this.callApiTaskFilters())
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    /**
     * Retrive all the tasks created in activiti
     * @returns {any}
     */
    getTasks(filter: FilterModel): Observable<any> {
        let data: any = {};
        // data.filterId = filter.id;
        // data.filter = filter.filter;
        data = filter.filter;
        data.text = filter.filter.name;
        data = JSON.stringify(data);


        return Observable.fromPromise(this.callApiTasksFiltered(data))
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getTaskDetails(id: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiTaskDetails(id))
            .map(res => res.json())
            .map((details: any) => {
                return new TaskDetailsModel(details);
            })
            .catch(this.handleError);
    }

    getTaskComments(id: string): Observable<Comment[]> {
        return Observable.fromPromise(this.callApiTaskComments(id))
            .map(res => res.json())
            .map((response: any) => {
                let comments: Comment[] = [];
                response.data.forEach((comment) => {
                    let user = new User(
                        comment.createdBy.id, comment.createdBy.email, comment.createdBy.firstName, comment.createdBy.lastName);
                    comments.push(new Comment(comment.id, comment.message, comment.created, user));
                });
                return comments;
            })
            .catch(this.handleError);
    }

    addTaskComment(id: string, message: string): Observable<Comment[]> {
        return Observable.fromPromise(this.callApiAddTaskComment(id, message))
            .map(res => res.json())
            .map((response: any) => {
                let comments: Comment[] = [];
                response.data.forEach((comment) => {
                    let user = new User(
                        comment.createdBy.id, comment.createdBy.email, comment.createdBy.firstName, comment.createdBy.lastName);
                    comments.push(new Comment(comment.id, comment.message, comment.created, user));
                });
                return comments;
            })
            .catch(this.handleError);
    }

    getTaskChecklist(id: string): Observable<TaskDetailsModel[]> {
        return Observable.fromPromise(this.callApiTaskChecklist(id))
            .map(res => res.json())
            .map((response: any) => {
                let checklists: TaskDetailsModel[] = [];
                response.data.forEach((checklist) => {
                    checklists.push(new TaskDetailsModel(checklist));
                });
                return checklists;
            })
            .catch(this.handleError);
    }

    completeTask(id: string): Observable<TaskDetailsModel> {
        return Observable.fromPromise(this.callApiCompleteTask(id))
            .catch(this.handleError);
    }

    private callApiTasksFiltered(data: Object) {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + '/api/enterprise/tasks/query';
        // let url = 'http://localhost:9999/activiti-app/app/rest/filter/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        // let body = JSON.stringify(data);
        let options = new RequestOptions({headers: headers});

        return this.http
            .post(url, data, options).toPromise();
    }

    private callApiTaskFilters() {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + '/api/enterprise/filters/tasks';
        // let url = 'http://localhost:9999/activiti-app/app/rest/filters/tasks';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options).toPromise();
    }

    private callApiTaskDetails(id: string) {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + `/api/enterprise/tasks/${id}`;
        // let url = 'http://localhost:9999/activiti-app/app/rest/tasks/' + id;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options).toPromise();
    }

    private callApiTaskComments(id: string) {
        let url = `${this.basePath}/api/enterprise/tasks/${id}/comments`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options).toPromise();
    }

    private callApiAddTaskComment(id: string, message: string) {
        let url = `${this.basePath}/api/enterprise/tasks/${id}/comments`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let body = JSON.stringify({message: message});
        let options = new RequestOptions({headers: headers});

        return this.http
            .post(url, body, options).toPromise();
    }

    private callApiTaskChecklist(id: string) {
        let url = `${this.basePath}/api/enterprise/tasks/${id}/checklist`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .get(url, options).toPromise();
    }

    private callApiCompleteTask(id: string) {
        let url = this.alfrescoSettingsService.getBPMApiBaseUrl() + `/api/enterprise/tasks/${id}/action/complete`;
        // let url = `http://localhost:9999/activiti-app/app/rest/tasks/${id}/action/complete`;
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        let options = new RequestOptions({headers: headers});

        return this.http
            .put(url, options).toPromise();
    }


    /**
     * The method write the error in the console browser
     * @param error
     * @returns {ErrorObservable}
     */
    public handleError(error: Response): Observable<any> {
        console.error('Error when logging in', error);
        return Observable.throw(error || 'Server error');
    }

}
