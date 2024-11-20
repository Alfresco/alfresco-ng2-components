/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ContainerModel } from './container.model';
import { FormFieldModel } from './form-field.model';
import { FormFieldTypes } from './form-field-types';

describe('ContainerModel', () => {
    let field: FormFieldModel;

    beforeEach(() => {
        field = new FormFieldModel(null, {
            id: 'group-id',
            name: 'group-name',
            type: FormFieldTypes.GROUP,
            params: {
                allowCollapse: false,
                collapseByDefault: false,
                hideHeader: false
            },
            numberOfColumns: 1,
            tab: null
        });
    });

    it('should initialize with default values', () => {
        const container = new ContainerModel(field);

        expect(container.field).toBe(field);
        expect(container.columns).toEqual([]);
        expect(container.isExpanded).toBe(true);
        expect(container.rowspan).toBe(1);
        expect(container.colspan).toBe(1);
    });

    describe('isVisible getter', () => {
        it('should return true when field is visible', () => {
            const container = new ContainerModel(field);

            expect(container.isVisible).toBe(true);
        });

        it('should return false when field is NOT visible', () => {
            field.isVisible = false;
            const container = new ContainerModel(field);

            expect(container.isVisible).toBe(false);
        });
    });

    describe('isTypeFieldGroup getter', () => {
        it('should return true when field is a group', () => {
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
        });

        it('should return false when field is NOT a group', () => {
            const container = new ContainerModel(new FormFieldModel(null, { type: FormFieldTypes.CONTAINER }));

            expect(container.isTypeFieldGroup).toBe(false);
        });
    });

    describe('isCollapsible getter', () => {
        it('should return false when field is NOT a group', () => {
            const container = new ContainerModel(new FormFieldModel(null, { type: FormFieldTypes.CONTAINER }));

            expect(container.isTypeFieldGroup).toBe(false);
            expect(container.isCollapsible).toBe(false);
        });

        it('should return false when field is group and allowCollapse is false', () => {
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsible).toBe(false);
        });

        it('should return true when field is a group and allowCollapse is true', () => {
            field.params.allowCollapse = true;
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsible).toBe(true);
        });

        it('should return false when field is a group and allowCollapse is NOT set', () => {
            field.params.allowCollapse = undefined;
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsible).toBe(false);
        });
    });

    describe('isCollapsedByDefault getter', () => {
        it('should return false when field is NOT a group', () => {
            const container = new ContainerModel(new FormFieldModel(null, { type: FormFieldTypes.CONTAINER }));

            expect(container.isTypeFieldGroup).toBe(false);
            expect(container.isCollapsedByDefault).toBe(false);
        });

        it('should return false when field is group and collapseByDefault is false', () => {
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsedByDefault).toBe(false);
        });

        it('should return true when field is a group and collapseByDefault is true', () => {
            field.params.collapseByDefault = true;
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsedByDefault).toBe(true);
        });

        it('should return false when field is a group and collapseByDefault is NOT set', () => {
            field.params.collapseByDefault = undefined;
            const container = new ContainerModel(field);

            expect(container.isTypeFieldGroup).toBe(true);
            expect(container.isCollapsedByDefault).toBe(false);
        });
    });

    describe('hideHeader getter', () => {
        it('should return false when field is NOT a group', () => {
            const container = new ContainerModel(new FormFieldModel(null, { type: FormFieldTypes.CONTAINER }));

            expect(container.hideHeader).toBe(false);
        });

        it('should return false when field is a group and hideHeader is false', () => {
            const container = new ContainerModel(field);

            expect(container.hideHeader).toBe(false);
        });

        it('should return true when field is a group and hideHeader is true', () => {
            field.params.hideHeader = true;
            const container = new ContainerModel(field);

            expect(container.hideHeader).toBe(true);
        });

        it('should return false when field is a group and hideHeader is NOT set', () => {
            field.params.hideHeader = undefined;
            const container = new ContainerModel(field);

            expect(container.hideHeader).toBe(false);
        });
    });
});
