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

import { AfterContentInit, ContentChild, Directive, Input, TemplateRef, OnDestroy } from '@angular/core';
import { ViewerComponent } from '../components/viewer.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: 'adf-viewer-extension'
})
export class ViewerExtensionDirective implements AfterContentInit, OnDestroy {

    @ContentChild(TemplateRef)
    template: any;

    @Input()
    urlFileContent: string;

    @Input()
    extension: string;

    @Input()
    supportedExtensions: string[];

    templateModel: any;

    private onDestroy$ = new Subject<boolean>();

    constructor(private viewerComponent: ViewerComponent) {
    }

    ngAfterContentInit() {
        this.templateModel = { template: this.template, isVisible: false };

        this.viewerComponent.extensionTemplates.push(this.templateModel);

        this.viewerComponent.extensionChange
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(fileExtension => {
                this.templateModel.isVisible = this.isVisible(fileExtension);
            });

        if (this.supportedExtensions instanceof Array) {
            this.supportedExtensions.forEach((extension) => {
                this.viewerComponent.externalExtensions.push(extension);
            });
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    /**
     * check if the current extension in the viewer is compatible with this extension checking against supportedExtensions
     */
    isVisible(fileExtension): boolean {
        let supportedExtension: string;

        if (this.supportedExtensions && (this.supportedExtensions instanceof Array)) {
            supportedExtension = this.supportedExtensions.find((extension) => {
                return extension.toLowerCase() === fileExtension;

            });
        }

        return !!supportedExtension;
    }

}
