import { HttpParameterCodec } from '@angular/common/http';

// The default implementation of HttpParameterCodec from angular
// does not encode some special characters like + with is causing issues with the alfresco js API and returns 500 error

export class AlfrescoApiParamEncoder implements HttpParameterCodec {

    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}
