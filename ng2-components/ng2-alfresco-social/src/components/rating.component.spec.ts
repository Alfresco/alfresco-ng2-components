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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RatingComponent } from '../components/rating.component';
import { DebugElement }    from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { RatingService } from '../services/rating.service';

declare let jasmine: any;

describe('Rating component', () => {

    let component: any;
    let fixture: ComponentFixture<RatingComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                RatingComponent
            ],
            providers: [
                RatingService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RatingComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = 'test-id';

        fixture.detectChanges();
    });

    describe('Rendering tests', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('should rating component should be present', (done) => {
            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                expect(element.querySelector('#adf-rating-container')).not.toBe(null);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    entry: {
                        id: 'fiveStar',
                        aggregate: {
                            numberOfRatings: 1,
                            average: 4
                        }
                    }
                }
            });
        });

        it('should the star rating filled with the right grey/colored star', (done) => {
            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                fixture.detectChanges();

                expect(element.querySelectorAll('.adf-colored-star').length).toBe(3);
                expect(element.querySelectorAll('.adf-grey-star').length).toBe(2);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    entry: {
                        id: 'fiveStar',
                        aggregate: {
                            numberOfRatings: 4,
                            average: 3
                        }
                    }
                }
            });
        });

        it('should click on a star change your vote', (done) => {
            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                fixture.detectChanges();

                expect(element.querySelectorAll('.adf-colored-star').length).toBe(1);

                component.changeVote.subscribe(() => {
                    fixture.detectChanges();

                    expect(element.querySelectorAll('.adf-colored-star').length).toBe(3);

                    done();
                });

                let starThree: any = element.querySelector('#adf-colored-star-3');
                starThree.click();

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: {
                        'entry': {
                            'myRating': 3,
                            'ratedAt': '2017-04-06T14:36:40.731+0000',
                            'id': 'fiveStar',
                            'aggregate': {'numberOfRatings': 1, 'average': 3.0}
                        }
                    }
                });
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    'entry': {
                        myRating: 1,
                        'ratedAt': '2017-04-06T14:34:28.061+0000',
                        'id': 'fiveStar',
                        'aggregate': {'numberOfRatings': 1, 'average': 1.0}
                    }
                }
            });
        });

    });
});
