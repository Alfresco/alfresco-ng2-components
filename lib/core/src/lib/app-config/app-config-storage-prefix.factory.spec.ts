/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { of } from 'rxjs';
import { StoragePrefixFactory, StoragePrefixFactoryService } from './app-config-storage-prefix.factory';
import { AppConfigService } from './app-config.service';

type TestAppConfigService = Pick<AppConfigService, 'select'>;

describe('StoragePrefixFactory', () => {
    it('should get prefix set in app.config.json', () => {
        const appConfigPrefix = 'prefix-from-app-config-json';
        const appConfigService: TestAppConfigService = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select(_property: string) {
                return of(appConfigPrefix);
            }
        };

        const prefixFactory = new StoragePrefixFactory(appConfigService as AppConfigService);

        prefixFactory.getPrefix().subscribe((prefix) => {
            expect(prefix).toBe(appConfigPrefix);
        });
    });

    it('should work with NO prefix set in app.config.json', () => {
        const appConfigPrefix = undefined;
        const appConfigService: TestAppConfigService = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select(_property: string) {
                return of(appConfigPrefix);
            }
        };

        const prefixFactory = new StoragePrefixFactory(appConfigService as AppConfigService);

        prefixFactory.getPrefix().subscribe((prefix) => {
            expect(prefix).toBe(appConfigPrefix);
        });
    });

    it('should return prefix from provided factory, when NO prefix is set in app.config.json', () => {
        const appConfigPrefix = undefined;
        const appConfigService: TestAppConfigService = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select(_property: string) {
                return of(appConfigPrefix);
            }
        };

        const externalPrefixFactory: StoragePrefixFactoryService = {
            getPrefix() {
                return of('prefix-from-factory');
            }
        };

        const prefixFactory = new StoragePrefixFactory(
            appConfigService as AppConfigService,
            externalPrefixFactory
        );

        prefixFactory.getPrefix().subscribe((prefix) => {
            expect(prefix).toBe('prefix-from-factory');
        });
    });

    it('should return prefix from app.config.json even when factory is provided', () => {
        const appConfigPrefix = 'prefix-from-app-config-json';

        const appConfigService: TestAppConfigService = {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            select(_property: string) {
                return of(appConfigPrefix);
            }
        };

        const externalPrefixFactory: StoragePrefixFactoryService = {
            getPrefix() {
                return of('prefix-from-factory');
            }
        };

        const prefixFactory = new StoragePrefixFactory(
            appConfigService as AppConfigService,
            externalPrefixFactory
        );

        prefixFactory.getPrefix().subscribe((prefix) => {
            expect(prefix).toBe(appConfigPrefix);
        });
    });
});
