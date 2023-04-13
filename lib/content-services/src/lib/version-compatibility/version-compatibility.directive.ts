/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { VersionCompatibilityService } from './version-compatibility.service';
import { take } from 'rxjs/operators';

@Directive({
    selector: '[adf-acs-version]'
})
export class VersionCompatibilityDirective {

    /** Minimum version required for component to work correctly . */
    @Input('adf-acs-version')
    set version(requiredVersion: string) {
        this.validateAcsVersion(requiredVersion);
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private versionCompatibilityService: VersionCompatibilityService
    ) {
    }

    private validateAcsVersion(requiredVersion: string) {
        this.versionCompatibilityService.acsVersionInitialized$.pipe(take(1)).subscribe(() => {
            this.viewContainer.clear();
            if (requiredVersion && this.versionCompatibilityService.isVersionSupported(requiredVersion)) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }
        });
    }
}
