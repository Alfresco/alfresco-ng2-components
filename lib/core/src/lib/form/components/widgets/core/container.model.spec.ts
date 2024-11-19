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

    it('should return correct visibility', () => {
        const container = new ContainerModel(field);
        expect(container.isVisible).toBe(true);

        field.isVisible = false;
        expect(container.isVisible).toBe(false);
    });

    it('should return correct group status', () => {
        let container = new ContainerModel(field);
        expect(container.isGroup).toBe(true);

        container = new ContainerModel(new FormFieldModel(null, { type: FormFieldTypes.CONTAINER }));
        expect(container.isGroup).toBe(false);
    });

    it('should return correct collapsible status', () => {
        const container = new ContainerModel(field);
        expect(container.isCollapsible).toBe(false);

        field.params.allowCollapse = true;
        expect(container.isCollapsible).toBe(true);

        field.params.allowCollapse = undefined;
        expect(container.isCollapsible).toBe(false);
    });

    it('should return correct collapsed by default status', () => {
        const container = new ContainerModel(field);
        expect(container.isCollapsedByDefault).toBe(false);

        field.params.collapseByDefault = true;
        expect(container.isCollapsedByDefault).toBe(true);

        field.params.collapseByDefault = undefined;
        expect(container.isCollapsedByDefault).toBe(false);
    });

    it('should return correct hide header status', () => {
        const container = new ContainerModel(field);
        expect(container.hideHeader).toBe(false);

        field.params.hideHeader = true;
        expect(container.hideHeader).toBe(true);

        field.params.hideHeader = undefined;
        expect(container.hideHeader).toBe(false);
    });
});
