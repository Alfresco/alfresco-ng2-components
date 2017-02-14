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

import {
    Directive,
    ContentChild,
    TemplateRef,
    AfterContentInit,
    Input
} from '@angular/core';
import { ViewerComponent } from '../components/viewer.component';

@Directive({
    selector: 'extension-viewer'
})
export class ExtensionViewerDirective implements AfterContentInit {

    @ContentChild(TemplateRef)
    template: any;

    @Input()
    urlFileContent: string;

    @Input()
    supportedExtensions: string[];

    templateModel: any;

    constructor(private viewerComponent: ViewerComponent) {
    }

    ngAfterContentInit() {
        this.templateModel = {template: this.template, isVisible: false};

        this.viewerComponent.extensionTemplates.push(this.templateModel);

        this.viewerComponent.extensionChange.subscribe((fileExtension) => {
            this.templateModel.isVisible = this.isVisible(fileExtension);
        });

        if (this.supportedExtensions instanceof Array) {
            this.supportedExtensions.forEach((extension) => {
                this.viewerComponent.externalExtensions.push(extension);
            });
        }
    }

    /**
     * check if the current extension in the viewer is compatible with this extension checking against supportedExtensions
     *
     * @returns {boolean}
     */
    isVisible(fileExtension) {
        let supportedExtension: string;

        if (this.supportedExtensions && (this.supportedExtensions instanceof Array)) {
            supportedExtension = this.supportedExtensions.find((extension) => {
                return extension.toLowerCase() === fileExtension;

            });
        }

        return !!supportedExtension;
    }

}
