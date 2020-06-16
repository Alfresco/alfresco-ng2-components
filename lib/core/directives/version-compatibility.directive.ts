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

import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { VersionCompatibilityService } from '../services/version-compatibility.service';
import { VersionModel } from '../models/product-version.model';

@Directive({
    
    selector: '[adf-ecm-version]'
})
export class VersionCompatibilityDirective {

    /** Minimum version required for component to work correctly . */
    @Input('adf-ecm-version')
    set version(requiredVersion: string) {
        this.validateVersion(requiredVersion);
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private versionCompatibilityService: VersionCompatibilityService
    ) {
    }

    private validateVersion(requiredVersion: string) {
        if (requiredVersion && this.isVersionSupported(requiredVersion)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    private parseVersion(version: string): VersionModel {
        const major = version.split('.')[0];
        const minor = version.split('.')[1] || '0';
        const patch = version.split('.')[2] || '0';

        return {
            major: major,
            minor: minor,
            patch: patch
        } as VersionModel;
    }

    private isVersionSupported(requiredVersion: string): boolean {
        const parsedRequiredVersion = this.parseVersion(requiredVersion);
        const currentVersion = this.versionCompatibilityService.getEcmVersion();

        let versionSupported = false;

        if (currentVersion) {
            if (+currentVersion.major > +parsedRequiredVersion.major) {
                versionSupported = true;
            } else if (currentVersion.major === parsedRequiredVersion.major &&
                +currentVersion.minor > +parsedRequiredVersion.minor) {
                versionSupported = true;
            } else if (currentVersion.major === parsedRequiredVersion.major &&
                currentVersion.minor === parsedRequiredVersion.minor &&
                +currentVersion.patch >= +parsedRequiredVersion.patch) {
                versionSupported = true;
            }
        }

        return versionSupported;
    }

}
