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
import { LikeComponent } from '../components/like.component';
import { DebugElement }    from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { RatingService } from '../services/rating.service';

declare let jasmine: any;

describe('Like component', () => {

    let component: any;
    let fixture: ComponentFixture<LikeComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                LikeComponent
            ],
            providers: [
                RatingService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LikeComponent);

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

        it('should like component should be present', (done) => {
            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                expect(element.querySelector('#adf-like-test-id')).not.toBe(null);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    entry: {
                        id: 'likes',
                        aggregate: {
                            numberOfRatings: 1
                        }
                    }
                }
            });

        });

        it('should like component show the number of likes', (done) => {
            fixture.detectChanges();

            component.ngOnChanges().subscribe(() => {
                expect(element.querySelector('#adf-like-counter').innerHTML).not.toBe(1);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: {
                    entry: {
                        id: 'likes',
                        aggregate: {
                            numberOfRatings: 1
                        }
                    }
                }
            });
        });

        describe('User actions', () => {

            it('should like component update the number of likes when clicked', (done) => {
                fixture.detectChanges();

                expect(element.querySelector('#adf-like-counter').innerHTML).toBe('0');

                component.ngOnChanges().subscribe(() => {
                    component.changeVote.subscribe(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('1');
                    });

                    let likeButton: any = element.querySelector('#adf-like-test-id');
                    likeButton.click();

                    component.changeVote.subscribe(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('2');
                    });

                    jasmine.Ajax.requests.mostRecent().respondWith({
                        status: 200,
                        contentType: 'json',
                        responseText: {
                            'entry': {
                                'myRating': true,
                                'ratedAt': '2017-04-06T15:25:50.305+0000',
                                'id': 'likes',
                                'aggregate': {'numberOfRatings': 2}
                            }
                        }
                    });

                    done();
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: {
                        entry: {
                            id: 'likes',
                            aggregate: {
                                numberOfRatings: 1
                            }
                        }
                    }
                });
            });

            it('should like component decrease the number of likes when clicked and is already liked', (done) => {
                fixture.detectChanges();

                expect(element.querySelector('#adf-like-counter').innerHTML).toBe('0');

                component.ngOnChanges().subscribe(() => {
                    fixture.detectChanges();

                    let likeButton: any = element.querySelector('#adf-like-test-id');
                    likeButton.click();

                    component.changeVote.subscribe(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#adf-like-counter').innerHTML).toBe('0');
                    });

                    jasmine.Ajax.requests.mostRecent().respondWith({
                        status: 204,
                        contentType: 'json'
                    });

                    done();
                });

                component.changeVote.subscribe(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#adf-like-counter').innerHTML).toBe('1');
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: {
                        'entry': {
                            'myRating': true,
                            'ratedAt': '2017-04-06T15:41:01.851+0000',
                            'id': 'likes',
                            'aggregate': {'numberOfRatings': 1}
                        }
                    }
                });
            });
        });
    });
});
