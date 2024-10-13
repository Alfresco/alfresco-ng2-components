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

import { Injectable } from '@angular/core';
import { AuthenticationService, BasicAlfrescoAuthService } from '@alfresco/adf-core';
import { take } from 'rxjs/operators';

@Injectable()
export class ContentAuthLoaderService {
    constructor(private readonly basicAlfrescoAuthService: BasicAlfrescoAuthService, private readonly authService: AuthenticationService) {}

    init(): void {
        this.authService.onLogin.pipe(take(1)).subscribe({
            next: async () => {
                if (this.authService.isOauth() && (this.authService.isALLProvider() || this.authService.isECMProvider())) {
                    await this.basicAlfrescoAuthService.requireAlfTicket();
                }
            }
        });
    }
}
