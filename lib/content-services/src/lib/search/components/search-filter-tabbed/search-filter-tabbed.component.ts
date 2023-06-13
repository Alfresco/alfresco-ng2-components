import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import {
    SearchQueryBuilderService,
    SearchWidget,
    SearchWidgetContainerComponent,
    SearchWidgetSettings
} from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'adf-search-filter-tabbed',
  templateUrl: './search-filter-tabbed.component.html',
  styleUrls: ['./search-filter-tabbed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFilterTabbedComponent implements SearchWidget, OnInit, AfterViewInit, OnDestroy {
    context: SearchQueryBuilderService;
    displayValue$: Subject<string> = new Subject<string>();
    id: string;
    isActive: boolean;
    settings: SearchWidgetSettings;
    startValue: any;
    displayLabelMap: Map<string, string> = new Map<string, string>();

    @ViewChildren(SearchWidgetContainerComponent)
    widgetContainerComponentList: QueryList<SearchWidgetContainerComponent>;

    private onDestroy$ = new Subject<void>();

    constructor() {
    }

    ngOnInit(): void {
        if(this.startValue) {
            this.setValue(this.startValue);
        }
    }

    ngAfterViewInit(): void {
        this.widgetContainerComponentList.forEach(widgetContainer => {
            const displayLabelSubject: Subject<string> = widgetContainer.componentRef.instance.displayValue$;
            displayLabelSubject.asObservable().pipe(takeUntil(this.onDestroy$)).subscribe(label => {
                this.displayLabelMap.set(widgetContainer.id, label);
                this.updateDisplayLabel();
            });
        })
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    updateDisplayLabel() {
        let displayLabel = '';
        this.settings.tabs.forEach(tab => {
            if(this.displayLabelMap.get(tab.id)) {
                if(displayLabel !== '') {
                    if (this.settings.displayLabelSeparator) {
                        displayLabel +=`${this.settings.displayLabelSeparator} `;
                    }
                }
                let tabDisplayLabel: string = ' ';
                if (tab.tabDisplayLabel) {
                    tabDisplayLabel = tab.tabDisplayLabel;
                }
                displayLabel += ` ${tabDisplayLabel} ${this.displayLabelMap.get(tab.id)}`;
            }
        });
        this.displayValue$.next(displayLabel);
    }

    getCurrentValue(): any {
        return this.widgetContainerComponentList.reduce((value, widgetContainer) => {
            value[widgetContainer.id] = widgetContainer.getCurrentValue();
            return value;
        }, {});
    }

    hasValidValue(): boolean {
        return !this.widgetContainerComponentList.find(widgetContainer => !widgetContainer.hasValueSelected());
    }

    reset(): void {
        this.widgetContainerComponentList.forEach(widgetContainer => {
            widgetContainer.resetInnerWidget();
        });
    }

    setValue(value: any) {
        this.isActive = true;
        this.widgetContainerComponentList.forEach(widgetContainer => {
            let widgetValue = value[widgetContainer.id];
            widgetContainer.setValue(widgetValue);
        });
    }

    submitValues(): void {
        this.widgetContainerComponentList.forEach(widgetContainer => widgetContainer.applyInnerWidget());
        if (this.id && this.context) {
            this.context.update();
        }
    }
}
