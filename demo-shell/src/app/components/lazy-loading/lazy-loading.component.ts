import { Component } from '@angular/core';
import { ObjectDataTableAdapter, AuthenticationService } from '@alfresco/adf-core';

@Component({
    selector: 'app-lazy-component',
    template: `
        <adf-datatable [data]="data"></adf-datatable>

        <ul>
            <li>Global i18n: {{ 'APP_LAYOUT.DATATABLE_LAZY' | translate }}</li>
            <li>Local i18n (work in progress): {{ 'LAZY.TEXT' | translate }}</li>
            <li>isLoggedIn: {{ isLoggedIn }}</li>
            <li>ECM username: {{ username }}
        </ul>
    `
})
export class LazyLoadingComponent {

    data: ObjectDataTableAdapter;

    get isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    get username(): string {
        return this.auth.getEcmUsername();
    }

    constructor(private auth: AuthenticationService) {
        this.data = new ObjectDataTableAdapter(
            // data
            [
              {id: 1, name: 'Name 1'},
              {id: 2, name: 'Name 2'}
            ],
            // schema
            [
              {
                type: 'text',
                key: 'id',
                title: 'Id',
                sortable: true
              },
              {
                type: 'text',
                key: 'name',
                title: 'Name',
                cssClass: 'full-width',
                sortable: true
              }
            ]
        );
    }
}
