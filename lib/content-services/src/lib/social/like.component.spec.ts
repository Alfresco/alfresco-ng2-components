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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeComponent } from './like.component';
import { setupTestBed } from '@alfresco/adf-core';

import { ContentTestingModule } from '../testing/content.testing.module';
import { of } from 'rxjs';
import { RatingService } from './services/rating.service';
import { TranslateModule } from '@ngx-translate/core';

describe('Like component', () => {

    let component: any;
    let fixture: ComponentFixture<LikeComponent>;
    let element: HTMLElement;
    let service: RatingService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(RatingService);

        spyOn(service, 'getRating').and.returnValue(of({
            entry: {
                id: 'likes',
                aggregate: { numberOfRatings: 2 }
            }
        }));

        fixture = TestBed.createComponent(LikeComponent);
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = 'test-id';
        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should load the likes by default on onChanges', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('2');
    });

    it('should increase the number of likes when clicked', async () => {
        spyOn(service, 'postRating').and.returnValue(of({
            entry: {
                id: 'likes',
                aggregate: { numberOfRatings: 3 }
            }
        }));

        const likeButton: any = element.querySelector('#adf-like-test-id');
        likeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('3');
    });

    it('should decrease the number of likes when clicked and is already liked', async () => {
        spyOn(service, 'deleteRating').and.returnValue(of(''));

        component.isLike = true;

        const likeButton: any = element.querySelector('#adf-like-test-id');
        likeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('1');
    });
});
