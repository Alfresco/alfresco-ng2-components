/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { CardViewSelectNodeItemModel } from './card-view-select-node-item.model';

describe('CardViewSelectNodeItemModel', () => {
    it('should have the smartFolderTemplate type', () => {
        const itemModel = new CardViewSelectNodeItemModel({ label: 'Template', value: undefined, key: 'template' });

        expect(itemModel.type).toBe('smartFolderTemplate');
    });

    it('should return the raw value as display value when no display name is set', () => {
        const itemModel = new CardViewSelectNodeItemModel({ label: 'Template', value: 'node-id', key: 'template' });

        expect(itemModel.displayValue).toBe('node-id');
    });

    it('should prefer the display name over the value as display value', () => {
        const itemModel = new CardViewSelectNodeItemModel({ label: 'Template', value: 'node-id', key: 'template' });
        itemModel.displayName = 'My Template';

        expect(itemModel.displayValue).toBe('My Template');
    });

    it('should fall back to the value when the display name is empty', () => {
        const itemModel = new CardViewSelectNodeItemModel({ label: 'Template', value: 'node-id', key: 'template' });
        itemModel.displayName = undefined;

        expect(itemModel.displayValue).toBe('node-id');
    });

    it('should update the value through setValue', () => {
        const itemModel = new CardViewSelectNodeItemModel({ label: 'Template', value: undefined, key: 'template' });
        itemModel.setValue('new-node-id');

        expect(itemModel.value).toBe('new-node-id');
    });
});
