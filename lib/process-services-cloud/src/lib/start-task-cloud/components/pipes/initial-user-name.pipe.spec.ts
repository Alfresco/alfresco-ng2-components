import { InitialUserNamePipe } from './initial-user-name.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { UserCloudModel } from '../../models/user-cloud.model';

class FakeSanitizer extends DomSanitizer {

    constructor() {
        super();
    }

    sanitize(html) {
        return html;
    }

    bypassSecurityTrustHtml(value: string): any {
        return value;
    }

    bypassSecurityTrustStyle(value: string): any {
        return null;
    }

    bypassSecurityTrustScript(value: string): any {
        return null;
    }

    bypassSecurityTrustUrl(value: string): any {
        return null;
    }

    bypassSecurityTrustResourceUrl(value: string): any {
        return null;
    }
}

describe('InitialUserNamePipe', () => {

    let pipe: InitialUserNamePipe;
    let fakeUser: UserCloudModel;

    beforeEach(() => {
        pipe = new InitialUserNamePipe(new FakeSanitizer());
        fakeUser = {username: 'username', firstName: 'first-name', lastName: 'last-name'};
    });

    it('should return a div with the user initials', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">FF</div>');
    });

    it('should apply the style class passed in input', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser, 'fake-class-to-check');
        expect(result).toBe('<div id="user-initials-image" class="fake-class-to-check">FF</div>');
    });

    it('should return a single letter into div when lastName is undefined', () => {
        fakeUser.firstName = 'FAKE-NAME';
        fakeUser.lastName = undefined;
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">F</div>');
    });

    it('should return a single letter into div when firstname is null', () => {
        fakeUser.firstName = undefined;
        fakeUser.lastName = 'FAKE-SURNAME';
        let result = pipe.transform(fakeUser);
        expect(result).toBe('<div id="user-initials-image" class="">F</div>');
    });

    it('should return an empty string when user is null', () => {
        let result = pipe.transform(null);
        expect(result).toBe('');
    });
});
