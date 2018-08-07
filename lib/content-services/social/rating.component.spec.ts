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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingComponent } from './rating.component';
import { setupTestBed } from '../../core/testing';
import { ContentTestingModule } from '../testing/content.testing.module';
import { of } from 'rxjs';
import { RatingService } from './services/rating.service';

describe('Rating component', () => {

    let component: any;
    let fixture: ComponentFixture<RatingComponent>;
    let element: HTMLElement;
    let service: RatingService;

    setupTestBed({
        imports: [ContentTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RatingComponent);
        service = TestBed.get(RatingService);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        component.nodeId = 'test-id';

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering tests', () => {

        it('should rating component should be present', (done) => {
            spyOn(service, 'getRating').and.returnValue(of({
                entry: {
                    id: 'fiveStar',
                    aggregate: {
                        numberOfRatings: 1,
                        average: 4
                    }
                }
            }));

            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                expect(element.querySelector('#adf-rating-container')).not.toBe(null);
                done();
            });
        });

        it('should the star rating filled with the right grey/colored star', (done) => {
            spyOn(service, 'getRating').and.returnValue(of({
                entry: {
                    id: 'fiveStar',
                    aggregate: {
                        numberOfRatings: 4,
                        average: 3
                    }
                }
            }));

            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                fixture.detectChanges();

                expect(element.querySelectorAll('.adf-colored-star').length).toBe(3);
                expect(element.querySelectorAll('.adf-grey-star').length).toBe(2);
                done();
            });
        });

        it('should click on a star change your vote', (done) => {
            spyOn(service, 'getRating').and.returnValue(of({
                'entry': {
                    myRating: 1,
                    'ratedAt': '2017-04-06T14:34:28.061+0000',
                    'id': 'fiveStar',
                    'aggregate': { 'numberOfRatings': 1, 'average': 1.0 }
                }
            }));

            spyOn(service, 'postRating').and.returnValue(of({
                'entry': {
                    'myRating': 3,
                    'ratedAt': '2017-04-06T14:36:40.731+0000',
                    'id': 'fiveStar',
                    'aggregate': { 'numberOfRatings': 1, 'average': 3.0 }
                }
            }));

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
            });

        });

    });
});
