import { FormControl } from '@angular/forms';
import { StartTaskCloudService } from './../../services/start-task-cloud.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { RoleCloudModel } from '../../models/role-cloud.model';
import { UserCloudModel } from '../../models/user-cloud.model';
import { LogService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-cloud-people',
    templateUrl: './people-cloud.component.html',
    styleUrls: ['./people-cloud.component.scss']
})

export class PeopleCloudComponent implements OnInit {

    static ACTIVITI_ADMIN = 'ACTIVITI_ADMIN';
    static ACTIVITI_USER = 'ACTIVITI_USER';
    static ACTIVITI_MODELER = 'ACTIVITI_MODELER';

    users$: Observable<any[]>;

    searchUser: FormControl = new FormControl();

    users: any[] = [];

    @Output()
    selectedUser: EventEmitter<UserCloudModel> = new EventEmitter<UserCloudModel>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    constructor(private taskService: StartTaskCloudService,
                private logService: LogService) { }

    ngOnInit() {
        this.loadUsers();
        this.search();
    }

    search() {
        this.searchUser.valueChanges.subscribe((searchedWord) => {
            this.users$ = this.filterUsers(this.users, searchedWord);
        });
    }

    private loadUsers() {
        this.taskService.getUsers().subscribe((users: any) => {
            this.users = this.filterUsersByRole(users);
            },
            (error) => {
                this.error.emit(error);
                this.logService.error('An error occurred while fetching users');
            }
        );
    }

    private filterUsersByRole(users: UserCloudModel[]): UserCloudModel[] {
        let filteredUsers: any[] = [];
        users.forEach(user => {
            this.taskService.getRolesByUserId(user.id).subscribe((roles: RoleCloudModel[]) => {
                roles.forEach(role => {
                    if (this.hasRole(role)) {
                        filteredUsers.push(user);
                    }
                });
            },
            (error) => {
                this.error.emit(error);
                this.logService.error('An error occurred while fetching roles');
                }
            );
        });
        return filteredUsers;
    }

    private hasRole(role: RoleCloudModel): boolean {
        return (role.name === PeopleCloudComponent.ACTIVITI_ADMIN) || (role.name === PeopleCloudComponent.ACTIVITI_MODELER) || (role.name === PeopleCloudComponent.ACTIVITI_USER);
    }

    private filterUsers(users: UserCloudModel[], searchedWord: string) {
        let filteredUsers: UserCloudModel[];
        filteredUsers = this.removeDuplicates(users).filter((user) => this.findUserBySearchedWord(user.username, searchedWord));
        return of(filteredUsers);
    }

    findUserBySearchedWord(username: string, searchedWord: string): boolean {
        return username.toLowerCase().indexOf(searchedWord.toString().toLowerCase()) !== -1;
    }

    removeDuplicates(users: any[]): UserCloudModel[] {
        return _.uniqBy(users, 'username');
    }

    onSelect(selectedUser: UserCloudModel) {
        this.selectedUser.emit(selectedUser);
    }

    getDisplayName(model: any) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }
}
