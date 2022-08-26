import { HttpEvent, HttpUploadProgressEvent, HttpEventType, HttpResponse, HttpParams, HttpParameterCodec } from '@angular/common/http';

export const isHttpUploadProgressEvent = <T>(val: HttpEvent<T>): val is HttpUploadProgressEvent => val.type === HttpEventType.UploadProgress;
export const isHttpResponseEvent = <T>(val: HttpEvent<T>): val is HttpResponse<T> => val.type === HttpEventType.Response;
export const isDate = (value: unknown): value is Date => value instanceof Date;
export const isXML = (value: unknown): boolean => typeof value === 'string' && value.startsWith('<?xml');
export const isBlobResponse = (response: HttpResponse<any>, returnType: any): response is HttpResponse<Blob> => returnType === 'blob' || response.body instanceof Blob;

const convertParamsToString = (value: any): any => isDate(value) ? value.toISOString() : value;
export const getQueryParamsWithCustomEncoder = (obj: Record<string | number, unknown>, encoder: HttpParameterCodec): HttpParams | undefined => {
    if (!obj) {
        return undefined;
    }

    let httpParams = new HttpParams({
        encoder
    });

    const params = removeUndefinedValues(obj);

    for (const key in params) {

        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (value instanceof Array) {
                const array = value.map(convertParamsToString);
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

export const removeUndefinedValues = (obj: Record<string | number, unknown>) => {

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
