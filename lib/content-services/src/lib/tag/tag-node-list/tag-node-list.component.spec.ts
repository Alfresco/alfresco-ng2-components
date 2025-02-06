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
import { TagNodeListComponent } from './tag-node-list.component';
import { TagService } from '../services/tag.service';
import { Observable, of, Subject } from 'rxjs';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { Tag, TagEntry, TagPaging } from '@alfresco/js-api';
import { DynamicChipListComponent } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';

describe('TagNodeList', () => {
    let component: TagNodeListComponent;
    let fixture: ComponentFixture<TagNodeListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, TagNodeListComponent]
        });
        fixture = TestBed.createComponent(TagNodeListComponent);
        component = fixture.componentInstance;
    });

    describe('DynamicChipListComponent', () => {
        let dynamicChipListComponent: DynamicChipListComponent;
        let tagService: TagService;
        let getTagsByNodeIdSpy: jasmine.Spy<(nodeId: string) => Observable<TagPaging>>;

        beforeEach(() => {
            fixture.detectChanges();
            dynamicChipListComponent = fixture.debugElement.query(By.directive(DynamicChipListComponent)).componentInstance;
            tagService = TestBed.inject(TagService);
            getTagsByNodeIdSpy = spyOn(tagService, 'getTagsByNodeId').and.returnValue(new Subject<TagPaging>());
        });

        it('should have assigned limitChipsDisplayed to true if true is passed to limitTagsDisplayed', () => {
            component.limitTagsDisplayed = true;

            fixture.detectChanges();
            expect(dynamicChipListComponent.limitChipsDisplayed).toBeTrue();
        });

        it('should have assigned limitChipsDisplayed to false if false is passed to limitTagsDisplayed', () => {
            component.limitTagsDisplayed = true;
            fixture.detectChanges();
            component.limitTagsDisplayed = false;

            fixture.detectChanges();
            expect(dynamicChipListComponent.limitChipsDisplayed).toBeFalse();
        });

        it('should have assigned limitChipsDisplayed to false by default if limitTagsDisplayed is not delivered', () => {
            expect(dynamicChipListComponent.limitChipsDisplayed).toBeFalse();
        });

        it('should have assigned showDelete to true if true is passed to showDelete of tag node list', () => {
            component.showDelete = false;
            fixture.detectChanges();
            component.showDelete = true;

            fixture.detectChanges();
            expect(dynamicChipListComponent.showDelete).toBeTrue();
        });

        it('should have assigned showDelete to false if false is passed to showDelete of tag node list', () => {
            component.showDelete = false;

            fixture.detectChanges();
            expect(dynamicChipListComponent.showDelete).toBeFalse();
        });

        it('should have assigned showDelete to true by default if showDelete of tag node list is not delivered', () => {
            expect(dynamicChipListComponent.showDelete).toBeTrue();
        });

        describe('Assigning chips', () => {
            let tagEntry: Tag;
            let tagEntries: TagEntry[];

            beforeEach(() => {
                tagEntry = {
                    id: 'some id',
                    tag: 'some tag'
                };
                tagEntries = [
                    {
                        entry: tagEntry
                    }
                ];
                getTagsByNodeIdSpy.and.returnValue(
                    of({
                        list: {
                            entries: tagEntries,
                            pagination: undefined
                        }
                    })
                );
                spyOn(component.results, 'emit');
            });

            it('should have assigned correct chips initially', () => {
                component.nodeId = 'some node id';
                tagService.refresh.emit();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([
                    {
                        id: tagEntry.id,
                        name: tagEntry.tag
                    }
                ]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.nodeId);
                expect(component.results.emit).toHaveBeenCalledWith(tagEntries);
            });

            it('should not have assigned chips initially if nodeId is not specified', () => {
                tagService.refresh.emit();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([]);
                expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
                expect(component.results.emit).not.toHaveBeenCalled();
            });

            it('should have assigned correct chips when ngOnChanges is called', () => {
                component.nodeId = 'some node id';
                component.ngOnChanges();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([
                    {
                        id: tagEntry.id,
                        name: tagEntry.tag
                    }
                ]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.nodeId);
                expect(component.results.emit).toHaveBeenCalledWith(tagEntries);
            });

            it('should not have assigned chips when ngOnChanges is called and nodeId is not specified', () => {
                component.ngOnChanges();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([]);
                expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
                expect(component.results.emit).not.toHaveBeenCalled();
            });

            it('should have assigned correct chips when displayNext event from DynamicChipList is triggered', () => {
                component.nodeId = 'some node id';
                dynamicChipListComponent.displayNext.emit();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([
                    {
                        id: tagEntry.id,
                        name: tagEntry.tag
                    }
                ]);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.nodeId);
                expect(component.results.emit).toHaveBeenCalledWith(tagEntries);
            });

            it('should not have assigned chips when displayNext event from DynamicChipList is triggered and nodeId is not specified', () => {
                dynamicChipListComponent.displayNext.emit();

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([]);
                expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
                expect(component.results.emit).not.toHaveBeenCalled();
            });

            it('should have assigned correct chips when removeTag event from DynamicChipList is triggered', () => {
                component.nodeId = 'some node id';
                spyOn(tagService, 'removeTag').and.returnValue(of(undefined));
                const tag = 'some tag';
                dynamicChipListComponent.removedChip.emit(tag);

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([
                    {
                        id: tagEntry.id,
                        name: tagEntry.tag
                    }
                ]);
                expect(tagService.removeTag).toHaveBeenCalledWith(component.nodeId, tag);
                expect(tagService.getTagsByNodeId).toHaveBeenCalledWith(component.nodeId);
                expect(component.results.emit).toHaveBeenCalledWith(tagEntries);
            });

            it('should not have assigned chips when removeTag event from DynamicChipList is triggered and nodeId is not specified', () => {
                spyOn(tagService, 'removeTag').and.returnValue(of(undefined));
                const tag = 'some tag';
                dynamicChipListComponent.removedChip.emit(tag);

                fixture.detectChanges();
                expect(dynamicChipListComponent.chips).toEqual([]);
                expect(tagService.removeTag).toHaveBeenCalledWith(component.nodeId, tag);
                expect(tagService.getTagsByNodeId).not.toHaveBeenCalled();
                expect(component.results.emit).not.toHaveBeenCalled();
            });
        });
    });
});
