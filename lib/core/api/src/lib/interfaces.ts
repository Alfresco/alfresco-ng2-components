/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export interface SecurityOptions {
    readonly withCredentials?: boolean;
    readonly authentications?: Authentication;
    readonly defaultHeaders?: Record<string, string>;
}

export interface Oauth2 {
    refreshToken?: string;
    accessToken?: string;
}

export interface BasicAuth {
    username?: string;
    password?: string;
    ticket?: string;
}

export interface Authentication {
    basicAuth?: BasicAuth;
    oauth2?: Oauth2;
    cookie?: string;
    type?: string;
}

export interface RequestOptions {
    httpMethod?: string;
    pathParams?: any;
    queryParams?: any;
    headerParams?: any;
    formParams?: any;
    bodyParam?: any;
    returnType?: any;
    responseType?: string;
    accepts?: string[];
    contentTypes?: string[];
    readonly accept?: string;
    readonly contentType?: string;
}
