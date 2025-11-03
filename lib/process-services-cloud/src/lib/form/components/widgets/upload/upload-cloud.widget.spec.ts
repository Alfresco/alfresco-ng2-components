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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCloudWidgetComponent } from './upload-cloud.widget';
import { FormFieldModel, FormModel, ThumbnailService, NotificationService } from '@alfresco/adf-core';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';

describe('UploadCloudWidgetComponent', () => {
    let fixture: ComponentFixture<UploadCloudWidgetComponent>;
    let widget: UploadCloudWidgetComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [UploadCloudWidgetComponent],
            providers: [
                { provide: ThumbnailService, useValue: {} },
                { provide: ProcessCloudContentService, useValue: {} },
                { provide: NotificationService, useValue: {} }
            ]
        });

        fixture = TestBed.createComponent(UploadCloudWidgetComponent);
        widget = fixture.componentInstance;
    });

    describe('event tracking', () => {
        let eventSpy: jasmine.Spy;

        beforeEach(() => {
            eventSpy = spyOn(widget, 'event').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {});
            fixture.detectChanges();
        });

        it('should call event method only once when widget is clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            fixture.debugElement.nativeElement.dispatchEvent(clickEvent);

            expect(eventSpy).toHaveBeenCalledTimes(1);
            expect(eventSpy).toHaveBeenCalledWith(clickEvent);
        });
    });
});
