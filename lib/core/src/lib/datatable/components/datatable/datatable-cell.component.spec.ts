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

import { DateCellComponent } from './date-cell.component';
import { Subject } from 'rxjs';
import { AlfrescoApiServiceMock, AppConfigService, StorageService } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';

describe('DataTableCellComponent', () => {
    let alfrescoApiService: AlfrescoApiServiceMock;

    beforeEach(() => {
        alfrescoApiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService());
    });

    it('should use medium format by default', () => {
        const component = new DateCellComponent(null, null, new AppConfigService(null));
        expect(component.format).toBe('medium');
    });

    it('should use column format', () => {
        const component = new DateCellComponent(null, <any> {
            nodeUpdated: new Subject<any>()
        }, new AppConfigService(null));
        component.column = {
            key: 'created',
            type: 'date',
            format: 'longTime'
        };

        component.ngOnInit();
        expect(component.format).toBe('longTime');
    });

    it('should update cell data on alfrescoApiService.nodeUpdated event', () => {
        const component = new DateCellComponent(
            null,
            alfrescoApiService,
            new AppConfigService(null)
        );

        component.column = {
            key: 'name',
            type: 'text'
        };

        component.row = <any> {
            cache: {
                name: 'some-name'
            },
            node: {
                entry: {
                    id: 'id',
                    name: 'test-name'
                }
            }
        };

        component.ngOnInit();

        alfrescoApiService.nodeUpdated.next(<Node> {
            id: 'id',
            name: 'updated-name'
        });

        expect(component.row['node'].entry.name).toBe('updated-name');
        expect(component.row['cache'].name).toBe('updated-name');
    });

    it('not should update cell data if ids don`t match', () => {
        const component = new DateCellComponent(
            null,
            alfrescoApiService,
            new AppConfigService(null)
        );

        component.column = {
            key: 'name',
            type: 'text'
        };

        component.row = <any> {
            cache: {
                name: 'some-name'
            },
            node: {
                entry: {
                    id: 'some-id',
                    name: 'test-name'
                }
            }
        };

        component.ngOnInit();

        alfrescoApiService.nodeUpdated.next(<Node> {
            id: 'id',
            name: 'updated-name'
        });

        expect(component.row['node'].entry.name).not.toBe('updated-name');
        expect(component.row['cache'].name).not.toBe('updated-name');
    });
});
