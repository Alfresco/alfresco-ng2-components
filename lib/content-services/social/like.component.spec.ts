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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeComponent } from './like.component';
import { MaterialModule } from '../material.module';
import { RatingService } from './services/rating.service';

declare let jasmine: any;

describe('Like component', () => {

    let component: any;
    let fixture: ComponentFixture<LikeComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ MaterialModule ],
            declarations: [ LikeComponent ],
            providers: [ RatingService ]
        }).compileComponents();
    }));

    beforeEach(() => {
        jasmine.Ajax.install();
        fixture = TestBed.createComponent(LikeComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = 'test-id';
        fixture.detectChanges();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    function simulateResponseWithLikes(numberOfRatings: number) {
        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200, contentType: 'json',
            responseText: {
                entry: { id: 'likes', aggregate: { numberOfRatings } }
            }
        });
    }

    it('should load the likes by default on onChanges', async(() => {
        simulateResponseWithLikes(2);

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-like-counter').innerHTML).toBe('2');
        });
    }));

    it('should increase the number of likes when clicked', async(() => {
        component.likesCounter = 2;

        let likeButton: any = element.querySelector('#adf-like-test-id');
        likeButton.click();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-like-counter').innerHTML).toBe('3');
        });

        simulateResponseWithLikes(3);
    }));

    it('should decrease the number of likes when clicked and is already liked', async(() => {
        component.likesCounter = 2;
        component.isLike = true;

        let likeButton: any = element.querySelector('#adf-like-test-id');
        likeButton.click();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(element.querySelector('#adf-like-counter').innerHTML).toBe('1');
        });

        simulateResponseWithLikes(1);
    }));
});
