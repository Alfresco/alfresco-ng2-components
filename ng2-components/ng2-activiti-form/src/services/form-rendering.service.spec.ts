/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    AttachWidgetComponent,
    FormFieldModel,
    FormFieldTypes,
    UnknownWidgetComponent,
    UploadWidgetComponent
} from './../components/widgets/index';
import { DefaultTypeResolver, FormRenderingService } from './form-rendering.service';

describe('FormRenderingService', () => {

    let service: FormRenderingService;

    beforeEach(() => {
        service = new FormRenderingService();
    });

    it('should resolve Upload field as Attach widget', () => {
        let field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                link: 'link'
            }
        });
        let type = service.resolveComponentType(field);
        expect(type).toBe(AttachWidgetComponent);
    });

    it('should resolve Upload field as Upload widget', () => {
        let field = new FormFieldModel(null, {
            type: FormFieldTypes.UPLOAD,
            params: {
                link: null
            }
        });
        let type = service.resolveComponentType(field);
        expect(type).toBe(UploadWidgetComponent);
    });

    it('should resolve Unknown widget for Upload field', () => {
        let resolver = service.getComponentTypeResolver(FormFieldTypes.UPLOAD);
        let type = resolver(null);
        expect(type).toBe(UnknownWidgetComponent);
    });

    it('should resolve Uknown widget for unknown field type', () => {
        let resolver = service.getComponentTypeResolver('missing-type');
        let type = resolver(null);
        expect(type).toBe(UnknownWidgetComponent);
    });

    it('shoulld resolve custom value for unknown field type', () => {
        let resolver = service.getComponentTypeResolver('missing-type', AttachWidgetComponent);
        let type = resolver(null);
        expect(type).toBe(AttachWidgetComponent);
    });

    it('should fallback to default resolver when field type missing', () => {
        let resolver = service.getComponentTypeResolver(null);
        let type = resolver(null);
        expect(type).toBe(UnknownWidgetComponent);
    });

    it('should fallback to custom resolver when field type missing', () => {
        let resolver = service.getComponentTypeResolver(null, UploadWidgetComponent);
        let type = resolver(null);
        expect(type).toBe(UploadWidgetComponent);
    });

    it('should require field type to set resolver for type', () => {
        expect(
            () => service.setComponentTypeResolver(
                null,
                DefaultTypeResolver.fromType(UnknownWidgetComponent)
            )
        ).toThrowError('fieldType is null or not defined');
    });

    it('should require type resolver instance to set resolver for type', () => {
        expect(
            () => service.setComponentTypeResolver(
                FormFieldTypes.TEXT,
                null
            )
        ).toThrowError('resolver is null or not defined');
    });

    it('should fail overriding existing resolver without explicit flag', () => {
        expect(
            () => service.setComponentTypeResolver(
                FormFieldTypes.TEXT,
                DefaultTypeResolver.fromType(UnknownWidgetComponent)
            )
        ).toThrowError('already mapped, use override option if you intend replacing existing mapping.');
    });

    it('should override existing resolver with explicit flag', () => {
        let customResolver = DefaultTypeResolver.fromType(UnknownWidgetComponent);
        service.setComponentTypeResolver(FormFieldTypes.TEXT, customResolver, true);
        expect(service.getComponentTypeResolver(FormFieldTypes.TEXT)).toBe(customResolver);
    });

    it('should return default value when resolving with no field', () => {
        expect(service.resolveComponentType(null)).toBe(UnknownWidgetComponent);
    });

    it('should return custom value when resolving with no field', () => {
        expect(service.resolveComponentType(null, AttachWidgetComponent)).toBe(AttachWidgetComponent);
    });

});
