/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

export * from './authentication-interceptor/auth-bearer.interceptor';

export * from './mock/authentication.service.mock';
export * from './mock/identity-group.mock';
export * from './mock/identity-group.service.mock';
export * from './mock/identity-user.mock';
export * from './mock/identity-user.service.mock';
export * from './mock/jwt-helper.service.spec';
export * from './mock/oauth2.service.mock';

export * from './guard/auth-guard-base';
export * from './guard/auth-guard.service';
export * from './guard/auth-guard-ecm.service';
export * from './guard/auth-guard-bpm.service';
export * from './guard/auth-guard-sso-role.service';

export * from './services/authentication.service';
export * from './services/identity-group.interface';
export * from './services/identity-role.service';

export * from './services/identity-user.service';
export * from './services/jwt-helper.service';
export * from './services/oauth2.service';

export * from './services/identity-user.service.interface';
export * from './services/openid-configuration.interface';

export * from './models/oauth-config.model';
export * from './models/redirection.model';

export * from './models/identity-group.model';
export * from './models/identity-user.model';
export * from './models/identity-role.model';

export * from './interface/authentication.interface';

