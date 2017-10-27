import {
    AfterContentInit,
    Component,
    OnChanges,
    ElementRef,
    TemplateRef,
    Input,
    ViewChild,
    ContentChild,
    ViewEncapsulation,
    ChangeDetectorRef,
    ChangeDetectionStrategy
} from '@angular/core';
import { SearchOptions, SearchService } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Subject';

let _uniqueAutocompleteIdCounter = 0;

@Component({
    moduleId: module.id,
    selector: 'adf-search-autocomplete',
    templateUrl: './search-autocomplete.component.html',
    styleUrls: ['./search-autocomplete.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'adfSearchAutocomplete',
    host: {
        'class': 'adf-search-autocomplete'
    }
})
export class SearchAutocompleteComponent implements AfterContentInit, OnChanges {

    @ViewChild('panel')
    panel: ElementRef;

    @ContentChild(TemplateRef)
    template: TemplateRef<any>;

    @Input()
    displayWith: ((value: any) => string) | null = null;

    @Input()
    maxResults: number = 5;

    @Input()
    resultSort: string = null;

    @Input()
    rootNodeId: string = '-root-';

    @Input()
    resultType: string = null;

    @Input()
    searchTerm: string = '';

    @Input('class')
    set classList(classList: string) {
        if (classList && classList.length) {
            classList.split(' ').forEach(className => this._classList[className.trim()] = true);
            this._elementRef.nativeElement.className = '';
        }
    }

    showPanel: boolean = false;
    results: any[] = [];

    get isOpen(): boolean {
      return this._isOpen && this.showPanel;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    _isOpen: boolean = false;

    keyPressedStream: Subject<string> = new Subject();

    _classList: { [key: string]: boolean } = {};

    id: string = `search-autocomplete-${_uniqueAutocompleteIdCounter++}`;

    constructor(
        private searchService: SearchService,
        private changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef) {
            this.keyPressedStream.subscribe((searchedWord: string) => {
                this.displaySearchResults(searchedWord);
            });
        }

    ngAfterContentInit() {
        this.setVisibility();
    }

    ngOnChanges(changes) {
        if (changes.searchTerm) {
            this.results = [];
            this.displaySearchResults(changes.searchTerm.currentValue);
        }
    }

    resetResults() {
        this.results = [];
        this.setVisibility();
    }

    private displaySearchResults(searchTerm) {
        let searchOpts: SearchOptions = {
            include: ['path'],
            rootNodeId: this.rootNodeId,
            nodeType: this.resultType,
            maxItems: this.maxResults,
            orderBy: this.resultSort
        };
        if (searchTerm !== null && searchTerm !== '') {
            searchTerm = searchTerm + '*';
            this.searchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                    results => {
                        this.results = results.list.entries.slice(0, this.maxResults);
                        this.setVisibility();
                    },
                    error => {
                        this.results = null;
                    }
                );
        }
    }

    _setScrollTop(scrollTop: number): void {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }

    _getScrollTop(): number {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }

    hidePanel() {
        if( this.isOpen ) {
            this._classList['adf-search-show'] = false;
            this._classList['adf-search-hide'] = true;
            this.isOpen = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    setVisibility() {
        this.showPanel = !!this.results && !!this.results.length;
        this._classList['adf-search-show'] = this.showPanel;
        this._classList['adf-search-hide'] = !this.showPanel;
        this.changeDetectorRef.markForCheck();
    }
}
