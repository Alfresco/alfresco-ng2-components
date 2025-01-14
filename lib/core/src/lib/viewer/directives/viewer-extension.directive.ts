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

import { AfterContentInit, ContentChild, DestroyRef, Directive, inject, Input, TemplateRef } from '@angular/core';
import { ViewerRenderComponent } from '../components/viewer-render/viewer-render.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
    selector: 'adf-viewer-extension',
    standalone: true
})
export class ViewerExtensionDirective implements AfterContentInit {
    @ContentChild(TemplateRef)
    template: any;

    @Input()
    urlFileContent: string;

    @Input()
    extension: string;

    @Input()
    supportedExtensions: string[];

    templateModel: any;

    private readonly destroyRef = inject(DestroyRef);

    constructor(private viewerComponent: ViewerRenderComponent) {}

    ngAfterContentInit() {
        this.templateModel = { template: this.template, isVisible: false };
        this.viewerComponent.extensionsSupportedByTemplates.push(...this.supportedExtensions);
        this.viewerComponent.extensionTemplates.push(this.templateModel);

        this.viewerComponent.extensionChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fileExtension) => {
            this.templateModel.isVisible = this.isVisible(fileExtension);
        });
    }

    /**
     * Check if the current extension in the viewer is compatible with this extension checking against `supportedExtensions`
     *
     * @param fileExtension file extension to check
     * @returns `true` if file extension is compatible, otherwise `false`
     */
    isVisible(fileExtension: string): boolean {
        let supportedExtension: string;

        if (this.supportedExtensions && this.supportedExtensions instanceof Array) {
            supportedExtension = this.supportedExtensions.find((extension) => extension.toLowerCase() === fileExtension);
        }

        return !!supportedExtension;
    }
}
