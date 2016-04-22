import {Login} from './src/login.component';
import {Authentication} from './src/authentication.service';

export * from './src/login.component';
export * from './src/authentication.service';

export default {
    directives: [Login],
    providers: [Authentication]
}

export const ALFRESCO_LOGIN_DIRECTIVES: [any] = [Login];
export const ALFRESCO_AUTHENTICATION: [any] = [Authentication];
