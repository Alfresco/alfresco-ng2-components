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

import {
    Component,
    Input,
    ComponentRef,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    EventEmitter,
    Output,
    DestroyRef,
    inject
} from '@angular/core';
import { ExtensionService } from '../../services/extension.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-preview-extension',
    standalone: true,
    template: `<div #content></div>`
})
export class PreviewExtensionComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('content', { read: ViewContainerRef, static: true })
    content: ViewContainerRef;

    /** ID string of the component to preview. */
    @Input()
    id: string;

    /** Identifier of a node that is opened by the viewer. */
    @Input()
    nodeId: string = null;

    /** URL of the content in the repository. */
    @Input()
    url: string;

    /** File extension (.jpg, .png, etc) for the viewer. */
    @Input()
    extension: string;

    @Output()
    contentLoaded = new EventEmitter<void>();

    private readonly destroyRef = inject(DestroyRef);
    private componentRef: ComponentRef<any>;

    constructor(private extensionService: ExtensionService) {}

    ngOnInit() {
        if (!this.id) {
            return;
        }

        const componentType = this.extensionService.getComponentById(this.id);
        if (componentType) {
            this.content.clear();
            this.componentRef = this.content.createComponent(componentType, { index: 0 });
            this.updateInstance();
        }
    }

    ngOnChanges() {
        this.updateInstance();
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    private updateInstance() {
        if (this.componentRef?.instance) {
            this.componentRef.setInput('url', this.url);
            this.componentRef.setInput('extension', this.extension);
            this.componentRef.setInput('nodeId', this.nodeId);

            if (this.componentRef.instance?.contentLoaded) {
                this.componentRef.instance.contentLoaded.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
                    this.contentLoaded.emit();
                });
            }
        }
    }
}
