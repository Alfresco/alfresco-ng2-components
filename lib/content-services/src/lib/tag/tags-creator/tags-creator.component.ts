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

import { TagEntry, TagPaging } from '@alfresco/js-api';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounce, distinctUntilChanged, finalize, first, map, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, Subject, timer } from 'rxjs';
import { NotificationService } from '@alfresco/adf-core';
import { TagsCreatorMode } from './tags-creator-mode';
import { MatSelectionListChange } from '@angular/material/list';
import { TagService } from '../services/tag.service';

interface TagNameControlErrors {
    duplicatedExistingTag?: boolean;
    duplicatedAddedTag?: boolean;
    emptyTag?: boolean;
    required?: boolean;
}

const DEFAULT_TAGS_SORTING = {
    orderBy: 'tag',
    direction: 'asc'
};

/**
 * Allows to create multiple tags. That component contains input and two lists. Top list is all created tags, bottom list is searched tags based on input's value.
 */
@Component({
    selector: 'adf-tags-creator',
    templateUrl: './tags-creator.component.html',
    styleUrls: ['./tags-creator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagsCreatorComponent implements OnInit, OnDestroy {
    /**
     * Mode for component.
     * In Create mode we can't select existing tags, we can only create them.
     * In Create and Assign mode we can both - create tags and select existing tags.
     */
    @Input()
    mode: TagsCreatorMode;

    /**
     * False if tags can be removed from top list, true otherwise.
     */
    @Input()
    disabledTagsRemoving = false;

    /**
     * Default top list.
     *
     * @param tags tags which should be displayed as default tags for top list.
     */
    @Input()
    set tags(tags: string[]) {
        this._tags = [...tags];
        this._initialExistingTags = null;
        this._existingTags = null;
        this.loadTags(this.tagNameControl.value);
        this.tagNameControl.updateValueAndValidity();
    }

    get tags(): string[] {
        return this._tags;
    }

    /**
     * Decides if input for tags creation/searching should be visible. When input is hidden then panel of existing tags is hidden as well.
     *
     * @param tagNameControlVisible true if input should be visible, false otherwise.
     */
    @Input()
    set tagNameControlVisible(tagNameControlVisible: boolean) {
        this._tagNameControlVisible = tagNameControlVisible;
        if (tagNameControlVisible) {
            this._existingTagsPanelVisible = true;
            setTimeout(() => {
                this.tagNameInputElement.nativeElement.scrollIntoView();
            });
        } else {
            this._existingTagsPanelVisible = false;
        }
        this.existingTagsPanelVisibilityChange.emit(this.existingTagsPanelVisible);
    }

    get tagNameControlVisible(): boolean {
        return this._tagNameControlVisible;
    }

    /**
     * Emitted when bottom list is showing or hiding.
     */
    @Output()
    existingTagsPanelVisibilityChange = new EventEmitter<boolean>();
    /**
     * Emitted when tags in top list are changed.
     */
    @Output()
    tagsChange = new EventEmitter<string[]>();
    /**
     * Emitted when input is showing or hiding.
     */
    @Output()
    tagNameControlVisibleChange = new EventEmitter<boolean>();

    readonly nameErrorMessagesByErrors = new Map<keyof TagNameControlErrors, string>([
        ['duplicatedExistingTag', 'EXISTING_TAG'],
        ['duplicatedAddedTag', 'ALREADY_ADDED_TAG'],
        ['emptyTag', 'EMPTY_TAG'],
        ['required', 'REQUIRED']
    ]);

    private readonly existingTagsListLimit = 15;

    private exactTagSet$ = new Subject<void>();
    private _tags: string[] = [];
    private _tagNameControl = new FormControl<string>(
        '',
        [
            this.validateIfNotAlreadyAdded.bind(this),
            Validators.required,
            this.validateEmptyTag
        ],
        this.validateIfNotExistingTag.bind(this)
    );
    private _tagNameControlVisible = false;
    private _existingTags: TagEntry[];
    private _initialExistingTags: TagEntry[];
    private onDestroy$ = new Subject<void>();
    private _tagNameErrorMessageKey = '';
    private _spinnerVisible = false;
    private _typing = false;
    private _tagsListScrollbarVisible = false;
    private cancelExistingTagsLoading$ = new Subject<void>();
    private existingExactTag: TagEntry;
    private _existingTagsPanelVisible: boolean;

    @ViewChild('tagsList')
    private tagsListElement: ElementRef;
    @ViewChild('tagNameInput')
    private tagNameInputElement: ElementRef;

    constructor(
        private tagService: TagService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.tagNameControl.valueChanges
            .pipe(
                map((name: string) => name.trim()),
                distinctUntilChanged(),
                tap((name: string) => {
                    this._typing = true;
                    if (name) {
                        this._spinnerVisible = true;
                        this._existingTagsPanelVisible = true;
                    }
                    this.existingTagsPanelVisibilityChange.emit(this.existingTagsPanelVisible);
                    this.cancelExistingTagsLoading$.next();
                    this._initialExistingTags = null;
                    this._existingTags = null;
                }),
                debounce((name: string) => (name ? timer(300) : EMPTY)),
                takeUntil(this.onDestroy$)
            )
            .subscribe((name: string) => this.onTagNameControlValueChange(name));

        this.tagNameControl.statusChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.setTagNameControlErrorMessageKey());

        this.setTagNameControlErrorMessageKey();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.cancelExistingTagsLoading$.next();
        this.cancelExistingTagsLoading$.complete();
    }

    @HostBinding('class.adf-creator-with-existing-tags-panel')
    get hostClass(): boolean {
        return this.existingTagsPanelVisible;
    }

    get tagNameControl(): FormControl<string> {
        return this._tagNameControl;
    }

    get existingTags(): TagEntry[] {
        return this._existingTags;
    }

    get tagNameErrorMessageKey(): string {
        return this._tagNameErrorMessageKey;
    }

    get spinnerVisible(): boolean {
        return this._spinnerVisible;
    }

    get typing(): boolean {
        return this._typing;
    }

    get tagsListScrollbarVisible(): boolean {
        return this._tagsListScrollbarVisible;
    }

    get existingTagsPanelVisible(): boolean {
        return this._existingTagsPanelVisible;
    }

    /**
     * Hide input for typing name for new tag or for searching. When input is hidden then panel of existing tags is hidden as well.
     */
    hideNameInput(): void {
        this.tagNameControlVisible = false;
        this._existingTagsPanelVisible = false;
        this.existingTagsPanelVisibilityChange.emit(this.existingTagsPanelVisible);
        this.tagNameControlVisibleChange.emit(this.tagNameControlVisible);
    }

    /**
     * Add tags to top list using value which is set in input. Adding tag is not allowed when value in input is invalid
     * or if user is still typing what means that validation for input is not called yet.
     */
    addTag(): void {
        if (!this._typing && !this.tagNameControl.invalid) {
            this.tags.push(this.tagNameControl.value.trim());
            this.hideNameInput();
            this.tagNameControl.setValue('');
            this.checkScrollbarVisibility();
            this.tagNameControl.markAsUntouched();
            this.tagsChange.emit(this.tags);
        }
    }

    /**
     * Remove tag from top list. In case that tag was part of search result then that tag is moved to bottom list
     * (list of existing tags) after removing so user can reselect it again later.
     *
     * @param tag tag's name which should be removed from top list.
     */
    removeTag(tag: string): void {
        this.removeTagFromArray(this.tags, tag);
        this.tagNameControl.updateValueAndValidity();
        this.updateExistingTagsListOnRemoveFromTagsToConfirm(tag);
        this.checkScrollbarVisibility();
        this.tagsChange.emit(this.tags);
    }

    /**
     * Called when user selects any tag from list of existing tags. It moves tag from existing tags list to top list.
     *
     * @param change
     */
    addExistingTagToTagsToAssign(change: MatSelectionListChange): void {
        const selectedTag: TagEntry = change.options[0].value;
        this.tags.push(selectedTag.entry.tag);
        this.removeTagFromArray(this.existingTags, selectedTag);
        this.tagNameControl.updateValueAndValidity();
        this.exactTagSet$.next();
        this.tagsChange.emit(this.tags);
    }

    /**
     * Checks if component is in Create mode.
     *
     * @return true if Create mode, false otherwise.
     */
    isOnlyCreateMode(): boolean {
        return this.mode === TagsCreatorMode.CREATE;
    }

    private onTagNameControlValueChange(name: string): void {
        this.tagNameControl.markAsTouched();
        this.loadTags(name);
    }

    private loadTags(name: string) {
        if (name) {
            forkJoin({
                exactResult: this.tagService.findTagByName(name),
                searchedResult: this.tagService.searchTags(name, DEFAULT_TAGS_SORTING, false, 0, this.existingTagsListLimit)
            }).pipe(
                takeUntil(this.cancelExistingTagsLoading$),
                finalize(() => (this._typing = false))
            ).subscribe(({ exactResult, searchedResult }: {
                exactResult: TagEntry;
                searchedResult: TagPaging;
            }) => {
                if (exactResult) {
                    this.existingExactTag = exactResult;
                    this.removeExactTagFromSearchedResult(searchedResult);
                    searchedResult.list.entries.unshift(exactResult);
                } else {
                    this.existingExactTag = null;
                }

                this._initialExistingTags = searchedResult.list.entries;
                this.excludeAlreadyAddedTags(this._initialExistingTags);
                this.exactTagSet$.next();
                this._spinnerVisible = false;
            }, () => {
                this.notificationService.showError('TAG.TAGS_CREATOR.ERRORS.FETCH_TAGS');
                this._spinnerVisible = false;
            });
        } else {
            this.existingExactTag = null;
            this._spinnerVisible = false;
        }
    }

    private removeExactTagFromSearchedResult(searchedResult: TagPaging): void {
        const exactTagIndex = searchedResult.list.entries.findIndex(
            (row) => this.compareTags(row.entry.tag, this.existingExactTag.entry.tag)
        );

        if (exactTagIndex > -1) {
            searchedResult.list.entries.splice(exactTagIndex, 1);
        }
    }

    private validateIfNotExistingTag(tagNameControl: FormControl<string>): Observable<TagNameControlErrors | null> {
        return this.exactTagSet$.pipe(
            map<void, TagNameControlErrors | null>(() =>
                this.compareTags(tagNameControl.value, this.existingExactTag?.entry?.tag) ? { duplicatedExistingTag: true }
                    : null
            ), first()
        );
    }

    private validateIfNotAlreadyAdded(tagNameControl: FormControl<string>): TagNameControlErrors | null {
        return this.tags.some((tag) => this.compareTags(tag, tagNameControl.value))
            ? { duplicatedAddedTag: true }
            : null;
    }

    private compareTags(tagName1?: string, tagName2?: string): boolean {
        return tagName1?.trim().toUpperCase() === tagName2?.trim().toUpperCase();
    }

    private validateEmptyTag(tagNameControl: FormControl<string>): TagNameControlErrors | null {
        return tagNameControl.value.length && !tagNameControl.value.trim()
            ? { emptyTag: true }
            : null;
    }

    private setTagNameControlErrorMessageKey(): void {
        this._tagNameErrorMessageKey = this.tagNameControl.invalid
            ? `TAG.TAGS_CREATOR.ERRORS.${this.nameErrorMessagesByErrors.get(
                  Object.keys(this.tagNameControl.errors)[0] as keyof TagNameControlErrors
              )}`
            : '';
    }

    private checkScrollbarVisibility(): void {
        setTimeout(() => {
            this._tagsListScrollbarVisible =
                this.tagsListElement.nativeElement.scrollHeight >
                this.tagsListElement.nativeElement.clientHeight;
        });
    }

    private removeTagFromArray<T>(tags: T[], tag: T) {
        tags.splice(tags.indexOf(tag), 1);
    }

    private updateExistingTagsListOnRemoveFromTagsToConfirm(tag: string) {
        const entryForTagAddedToExistingTags = this._initialExistingTags?.find(
            (tagEntry) => tagEntry.entry.tag === tag
        );
        if (entryForTagAddedToExistingTags) {
            this.existingTags.unshift(entryForTagAddedToExistingTags);
            if (this.existingExactTag) {
                if (tag !== this.existingExactTag.entry.tag) {
                    this.removeTagFromArray(this.existingTags, this.existingExactTag);
                    this.sortExistingTags();
                    this.existingTags.unshift(this.existingExactTag);
                }
            } else {
                this.sortExistingTags();
            }
            this.exactTagSet$.next();
        }
    }

    private sortExistingTags() {
        this.existingTags.sort((tagEntry1, tagEntry2) =>
            tagEntry1.entry.tag.localeCompare(tagEntry2.entry.tag));
    }

    private excludeAlreadyAddedTags(tags: TagEntry[]) {
        this._existingTags = tags.filter((tag) => !this.tags.includes(tag.entry.tag));
    }
}
