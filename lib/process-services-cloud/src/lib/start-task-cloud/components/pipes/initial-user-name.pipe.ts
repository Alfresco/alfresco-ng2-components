import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserCloudModel } from '../../models/user-cloud.model';

@Pipe({
  name: 'initialUserNamePipe'
})
export class InitialUserNamePipe implements PipeTransform {

    constructor(private sanitized: DomSanitizer) {
    }

    transform(user: UserCloudModel, className: string = '', delimiter: string = ''): SafeHtml {
        let result: SafeHtml = '';
        if (user) {
            let initialResult = this.getInitialUserName(user.firstName, user.lastName, delimiter);
            result = this.sanitized.bypassSecurityTrustHtml(`<div id="user-initials-image" class="${className}">${initialResult}</div>`);
        }
        return result;
    }

    getInitialUserName(firstName: string, lastName: string, delimiter: string) {
        firstName = (firstName ? firstName[0] : '');
        lastName = (lastName ? lastName[0] : '');
        return firstName + delimiter + lastName;
    }

}
