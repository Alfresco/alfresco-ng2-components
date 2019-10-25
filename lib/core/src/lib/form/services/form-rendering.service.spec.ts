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

import { DynamicComponentResolver } from '../../index';
import {
    FormFieldModel,
    FormFieldTypes,
    UnknownWidgetComponent,
    UploadWidgetComponent,
    TextWidgetComponent,
    JsonWidgetComponent
} from './../components/widgets/index';
import { FormRenderingService } from './form-rendering.service';

describe('FormRenderingService', () => {

    let service: FormRenderingService;

    beforeEach(() => {
        service = new FormRenderingService();
    });

    it('should resolve Upload field as Upload widget', () => {
        const field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                link: null
            }
        });
        const type = service.resolveComponentType(field);
        expect(type).toBe(UploadWidgetComponent);
    });

    it('should resolve Upload widget for Upload field', () => {
        const resolver = service.getComponentTypeResolver(FormFieldTypes.UPLOAD);
        const type = resolver(null);
        expect(type).toBe(UploadWidgetComponent);
    });

    it('should resolve Unknown widget for unknown field type', () => {
        const resolver = service.getComponentTypeResolver('missing-type');
        const type = resolver(null);
        expect(type).toBe(UnknownWidgetComponent);
    });

    it('should resolve Text widget for readonly field type', () => {
        const resolver = service.getComponentTypeResolver('readonly');
        const type = resolver(null);
        expect(type).toBe(TextWidgetComponent);
    });

    it('should fallback to default resolver when field type missing', () => {
        const resolver = service.getComponentTypeResolver(null);
        const type = resolver(null);
        expect(type).toBe(UnknownWidgetComponent);
    });

    it('should fallback to custom resolver when field type missing', () => {
        const resolver = service.getComponentTypeResolver(null, UploadWidgetComponent);
        const type = resolver(null);
        expect(type).toBe(UploadWidgetComponent);
    });

    it('should require field type to set resolver for type', () => {
        expect(
            () => service.setComponentTypeResolver(
                null,
                DynamicComponentResolver.fromType(UnknownWidgetComponent)
            )
        ).toThrowError('type is null or not defined');
    });

    it('should require type resolver instance to set resolver for type', () => {
        expect(
            () => service.setComponentTypeResolver(
                FormFieldTypes.TEXT,
                null
            )
        ).toThrowError('resolver is null or not defined');
    });

    it('should fail overriding existing resolver with explicit flag', () => {
        expect(
            () => service.setComponentTypeResolver(
                FormFieldTypes.TEXT,
                DynamicComponentResolver.fromType(UnknownWidgetComponent),
                false
            )
        ).toThrowError('already mapped, use override option if you intend replacing existing mapping.');
    });

    it('should override existing resolver with explicit flag', () => {
        const customResolver = DynamicComponentResolver.fromType(UnknownWidgetComponent);
        service.setComponentTypeResolver(FormFieldTypes.TEXT, customResolver, true);
        expect(service.getComponentTypeResolver(FormFieldTypes.TEXT)).toBe(customResolver);
    });

    it('should override existing resolver without explicit flag', () => {
        const customResolver = DynamicComponentResolver.fromType(UnknownWidgetComponent);
        service.setComponentTypeResolver(FormFieldTypes.TEXT, customResolver);
        expect(service.getComponentTypeResolver(FormFieldTypes.TEXT)).toBe(customResolver);
    });

    it('should return default value when resolving with no field', () => {
        expect(service.resolveComponentType(null)).toBe(UnknownWidgetComponent);
    });

    it('should return custom value when resolving with no field', () => {
        expect(service.resolveComponentType(null, UploadWidgetComponent)).toBe(UploadWidgetComponent);
    });

    it('should resolve Display Text Widget for JSON field type', () => {
        const resolver = service.getComponentTypeResolver('json');
        const type = resolver(null);
        expect(type).toBe(JsonWidgetComponent);
    });

});
