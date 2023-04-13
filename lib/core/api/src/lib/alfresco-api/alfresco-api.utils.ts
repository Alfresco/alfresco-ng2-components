/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { HttpEvent, HttpUploadProgressEvent, HttpEventType, HttpResponse, HttpParams, HttpParameterCodec, HttpUrlEncodingCodec } from '@angular/common/http';
import { Constructor } from '../types';

export const isHttpUploadProgressEvent = <T>(val: HttpEvent<T>): val is HttpUploadProgressEvent => val.type === HttpEventType.UploadProgress;
export const isHttpResponseEvent = <T>(val: HttpEvent<T>): val is HttpResponse<T> => val.type === HttpEventType.Response;
export const isDate = (value: unknown): value is Date => value instanceof Date;
export const isXML = (value: unknown): boolean => typeof value === 'string' && value.startsWith('<?xml');
export const isBlobResponse = (response: HttpResponse<any>, returnType: Constructor<unknown> | 'blob'): response is HttpResponse<Blob> => returnType === 'blob' || response.body instanceof Blob;
export const isConstructor = <T = unknown>(value: any): value is Constructor<T> => typeof value === 'function' && !!value?.prototype?.constructor.name;

const convertParamsToString = (value: any): any => isDate(value) ? value.toISOString() : value;
export const getQueryParamsWithCustomEncoder = (obj: Record<string | number, unknown>, encoder: HttpParameterCodec = new HttpUrlEncodingCodec()): HttpParams | undefined => {
    if (!obj) {
        return undefined;
    }

    let httpParams = new HttpParams({
        encoder
    });

    const params = removeNilValues(obj);

    for (const key in params) {

        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (value instanceof Array) {
                const array = value.map(convertParamsToString).filter(Boolean);
                httpParams = httpParams.appendAll({
                    [key]: array
                });
            } else {
                httpParams = httpParams.append(key, convertParamsToString(value));
            }
        }
    }

    return httpParams;
};

/**
 * Removes null and undefined values from an object.
 */
export const removeNilValues = (obj: Record<string | number, unknown>) => {

    if (!obj) {
        return {};
    }

    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        const isNil = value === undefined || value === null;
        return isNil ? acc : { ...acc, [key]: value };
    }, {});
};


export const convertObjectToFormData = (formParams: Record<string | number, string | Blob>): FormData => {

    const formData = new FormData();

    for (const key in formParams) {
        if (Object.prototype.hasOwnProperty.call(formParams, key)) {
            const value = formParams[key];
            if (value instanceof File) {
                formData.append(key, value, value.name);
            } else {
                formData.append(key, value);
            }
        }
    }

    return formData;
};
