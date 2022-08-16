import { JsApiHttpParamEncoder } from './js-api-http-param-encoder';

describe('JsApiHttpParamEncoder', () => {
    it('should propely encode special "+" character', () => {

        const encoder = new JsApiHttpParamEncoder();

        const value = '2022-08-17T00:00:00.000+02:00';
        const encodeValue = '2022-08-17T00%3A00%3A00.000%2B02%3A00';

        expect(encoder.encodeValue(value)).toBe(encodeValue);
        expect(encoder.decodeValue(encodeValue)).toBe(value);

    });
});
