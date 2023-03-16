/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { TagEntry, TagPaging, TagPagingList } from '@alfresco/js-api';
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
import { debounce, finalize, first, map, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, forkJoin, Observable, Subject, timer } from 'rxjs';
import { NotificationService } from '@alfresco/adf-core';
import { TagService } from '@alfresco/adf-content-services';
import { TagsCreatorMode } from './tags-creator-mode';

interface TagNameControlErrors {
    duplicatedExistingTag?: boolean;
    duplicatedAddedTag?: boolean;
    emptyTag?: boolean;
    required?: boolean;
}

@Component({
    selector: 'acc-tags-creator',
    templateUrl: './tags-creator.component.html',
    styleUrls: ['./tags-creator.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TagsCreatorComponent implements OnInit, OnDestroy {
    @Input()
    set tagNameControlVisible(tagNameControlVisible: boolean) {
        this._tagNameControlVisible = tagNameControlVisible;
        if (tagNameControlVisible) {
            this._existingTagsPanelVisible = !!this.tagNameControl.value.trim();
        }
    }
    @Input()
    set mode(mode: TagsCreatorMode) {
        this._existingTagsLabelKey = mode === TagsCreatorMode.CREATE ? 'TAG.TAGS_CREATOR.EXISTING_TAGS' :
            'TAG.TAGS_CREATOR.EXISTING_TAGS_SELECTION';
    }

    @Output()
    tagsAddition = new EventEmitter<string[]>();
    @Output()
    tagNameControlVisibleChange = new EventEmitter<boolean>();

    readonly nameErrorMessagesByErrors = new Map<keyof TagNameControlErrors, string>([
        ['duplicatedExistingTag', 'EXISTING_TAG'],
        ['duplicatedAddedTag', 'ALREADY_ADDED_TAG'],
        ['emptyTag', 'EMPTY_TAG'],
        ['required', 'REQUIRED'],
    ]);

    private exactTagLoaded$ = new Subject<void>();
    private _tags: string[] = [];
    private _tagNameControl = new FormControl<string>(
        '',
        [
            this.validateIfNotAlreadyAdded.bind(this),
            Validators.required,
            this.validateEmptyTag,
        ],
        this.validateIfNotExistingTag.bind(this)
    );
    private _tagNameControlVisible = false;
    private _existingTagsPagination: TagPagingList;
    private onDestroy$ = new Subject<void>();
    private _tagNameErrorMessageKey = '';
    private _existingTagsLoading = false;
    private _typing = false;
    private _tagsListScrollbarVisible = false;
    private _saving = false;
    private _spinnerDiameter = 50;
    private cancelExistingTagsLoading$ = new Subject<void>();
    private nameOfExistingExactTag: string;
    private _existingTagsPanelVisible: boolean;
    private _existingTagsLabelKey: string;

    @ViewChild('tagsList')
    private tagsListElement: ElementRef;

    constructor(
        private tagService: TagService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.tagNameControl.valueChanges
            .pipe(
                map((name: string) => name.trim()),
                tap((name: string) => {
                    this._typing = true;
                    this._spinnerDiameter = 50;
                    if (name) {
                        this._existingTagsLoading = true;
                        this._existingTagsPanelVisible = true;
                    } else {
                        this._existingTagsPanelVisible = false;
                    }
                    this.cancelExistingTagsLoading$.next();
                    this._existingTagsPagination = null;
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

    @HostBinding('class.acc-creator-with-existing-tags-panel')
    get hostClass(): boolean {
        return this.existingTagsPanelVisible;
    }

    get tagNameControl(): FormControl<string> {
        return this._tagNameControl;
    }

    get tagNameControlVisible(): boolean {
        return this._tagNameControlVisible;
    }

    get tags(): string[] {
        return this._tags;
    }

    get existingTagsPagination(): TagPagingList {
        return this._existingTagsPagination;
    }

    get tagNameErrorMessageKey(): string {
        return this._tagNameErrorMessageKey;
    }

    get existingTagsLoading(): boolean {
        return this._existingTagsLoading;
    }

    get typing(): boolean {
        return this._typing;
    }

    get tagsListScrollbarVisible(): boolean {
        return this._tagsListScrollbarVisible;
    }

    get saving(): boolean {
        return this._saving;
    }

    get spinnerDiameter(): number {
        return this._spinnerDiameter;
    }

    get existingTagsPanelVisible(): boolean {
        return this._existingTagsPanelVisible;
    }

    get existingTagsLabelKey(): string {
        return this._existingTagsLabelKey;
    }

    /*showNameInput(): void {
        this._tagNameControlVisible = true;
        this._existingTagsPanelVisible = !!this.tagNameControl.value.trim();
    }*/

    hideNameInput(): void {
        this.tagNameControlVisible = false;
        this._existingTagsPanelVisible = false;
        this.tagNameControlVisibleChange.emit(this.tagNameControlVisible);
    }

    addTag(): void {
        if (!this._typing && !this.tagNameControl.invalid) {
            this.tags.push(this.tagNameControl.value.trim());
            this.hideNameInput();
            this.tagNameControl.setValue('');
            this.checkScrollbarVisibility();
            this.tagNameControl.markAsUntouched();
            this.tagsAddition.emit(this.tags);
        }
    }

    removeTag(tag: string): void {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.checkScrollbarVisibility();
        this.tagNameControl.updateValueAndValidity({
            emitEvent: false,
        });
    }

    /*saveTags(): void {
        this._saving = true;

        this.hideNameInput();

        const tagsToCreate = this.tags.map((name: string) => {
            const tagBody = new TagBody();
            tagBody.tag = name;
            return tagBody;
        });

        this.tagService
            .createTags(tagsToCreate)
            .pipe(finalize(() => (this._saving = false)))
            .subscribe(
                () => {
                    // this.dialog.close(true);
                    this.notificationService.showInfo('TAG.TAGS_CREATOR.CREATE_TAGS_SUCCESS');
                },
                (error: HttpErrorResponse) => this.handleCreateTagError(error)
            );
    }*/

    /*private handleCreateTagError(error: HttpErrorResponse) {
        const message = error.status === HttpStatusCode.Conflict
            ? 'TAG.TAGS_CREATOR.ERRORS.EXISTING_TAGS'
            : 'TAG.TAGS_CREATOR.ERRORS.CREATE_TAGS';

        this.notificationService.showError(message);
    }*/

    loadMoreTags(event: Event): void {
        const existingTagsListElement = event.target as HTMLElement;

        if (
            this.existingTagsPagination?.pagination.hasMoreItems &&
            existingTagsListElement.scrollTop +
                existingTagsListElement.clientHeight >=
                existingTagsListElement.scrollHeight - 80 &&
            !this.existingTagsLoading
        ) {
            this.searchExistingTags(this.tagNameControl.value);
        }
    }

    private onTagNameControlValueChange(name: string): void {
        this.tagNameControl.markAsTouched();

        if (name) {
            forkJoin({
                exactResult: this.tagService.findTagByName(name),
                searchedResult: this.tagService.searchTags(name),
            })
            .pipe(
                takeUntil(this.cancelExistingTagsLoading$),
                finalize(() => (this._typing = false))
            )
            .subscribe(
                ({ exactResult, searchedResult }: {
                    exactResult: TagEntry;
                    searchedResult: TagPaging;
                }) => {
                    if (exactResult) {
                        this.nameOfExistingExactTag = exactResult.entry.tag.toUpperCase();
                        this.removeExactTagFromSearchedResult(searchedResult);
                        searchedResult.list.entries.unshift(exactResult);
                    } else {
                        this.nameOfExistingExactTag = null;
                    }

                    this._existingTagsPagination = searchedResult.list;
                    this.exactTagLoaded$.next();
                    this._existingTagsLoading = false;
                },
                () => {
                    this.notificationService.showError('TAG.TAGS_CREATOR.ERRORS.FETCH_TAGS');
                    this._existingTagsLoading = false;
                }
            );
        } else {
            this.nameOfExistingExactTag = null;
        }
    }

    private removeExactTagFromSearchedResult(searchedResult: TagPaging): void {
        const exactTagIndex = searchedResult.list.entries.findIndex(
            (row) => row.entry.tag.toUpperCase() === this.nameOfExistingExactTag
        );

        if (exactTagIndex > -1) {
            searchedResult.list.entries.splice(exactTagIndex, 1);
        }
    }

    private validateIfNotExistingTag(tagNameControl: FormControl<string>): Observable<TagNameControlErrors | null> {
        return this.exactTagLoaded$.pipe(
            map<void, TagNameControlErrors | null>(() => {
                return this.compareTags(tagNameControl.value, this.nameOfExistingExactTag)
                    ? { duplicatedExistingTag: true }
                    : null;
            }),
            first()
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

    private getSkipCount(): number {
        const pagination = this.existingTagsPagination?.pagination;
        return pagination ? pagination.skipCount + pagination.maxItems : 0;
    }

    private searchExistingTags(name: string): void {
        this._existingTagsLoading = true;
        this._spinnerDiameter = 20;

        this.tagService
            .searchTags(name, this.getSkipCount())
            .pipe(takeUntil(this.cancelExistingTagsLoading$))
            .subscribe(
                (result) => {
                    if (this.nameOfExistingExactTag) {
                        this.removeExactTagFromSearchedResult(result);
                    }
                    result.list.entries = this._existingTagsPagination.entries.concat(result.list.entries);
                    this._existingTagsPagination = result.list;
                    this._existingTagsLoading = false;
                },
                () => {
                    this.notificationService.showError('TAG.TAGS_CREATOR.ERRORS.FETCH_TAGS');
                    this._existingTagsLoading = false;
                }
            );
    }

    private checkScrollbarVisibility(): void {
        setTimeout(() => {
            this._tagsListScrollbarVisible =
                this.tagsListElement.nativeElement.scrollHeight >
                this.tagsListElement.nativeElement.clientHeight;
        });
    }
}
