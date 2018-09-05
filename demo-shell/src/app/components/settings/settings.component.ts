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

import { Component } from '@angular/core';
import { LogService } from '@alfresco/adf-core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-settings',
    templateUrl: 'settings.component.html'
})
export class SettingsComponent {

    constructor(private router: Router,
                public logService: LogService) {
    }

    onError(error: string) {
        this.logService.log(error);
    }

    onCancel() {
        this.router.navigate(['/login']);
    }

    onSuccess() {
        this.router.navigate(['/login']);
    }
}
