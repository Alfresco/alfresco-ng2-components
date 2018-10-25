import { FormControl } from '@angular/forms';
import { StartTaskCloudService } from './../../services/start-task-cloud.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'adf-cloud-people',
  templateUrl: './people-cloud.component.html',
  styleUrls: ['./people-cloud.component.scss']
})

export class PeopleCloudComponent implements OnInit {

    users$: Observable<any[]>;

    searchUser: FormControl = new FormControl();

    constructor(private taskService: StartTaskCloudService) {
        this.loadUsers();
    }

    ngOnInit() {

    }

    private loadUsers(): void {
        this.searchUser.valueChanges.subscribe((value) => {
            this.users$ = this.taskService.getUsers().pipe(
                map((response) => {
                    return this.filterUsers(response, value).map(user => {
                        return user;
                    });
                })
            );
        });
        // this.users$ = this.searchUser.valueChanges.pipe(
        //     startWith(''),
        //     map((value) => {
        //     if (value && value.trim()) {
        //         this.taskService.getUsers().pipe(
        //                 map((response) => {
        //                     return this.filterUsers(response, value).map(user => {
        //                         return user;
        //                     });
        //                 })
        //             );
        //         } else {
        //             return of([]);
        //         }
        //     })
        // );
    }

    filterUsers(users: any[], searchedWord: string) {
        let filtered: any[];
        filtered = users.filter((user) => this.findAssigneeBySearchedWord(user.username, searchedWord));
        return filtered;
    }

    findAssigneeBySearchedWord(username: string, searchedWord: string): boolean {
        return username.toLowerCase().indexOf(searchedWord.toLowerCase()) !== -1;
    }

    onItemSelect(item: any) {
        // todo
    }

    getDisplayName(model: any) {
        if (model) {
            let displayName = `${model.firstName || ''} ${model.lastName || ''}`;
            return displayName.trim();
        }
        return '';
    }

}
