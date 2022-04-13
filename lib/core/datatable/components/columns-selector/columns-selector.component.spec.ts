import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ColumnsSelectorComponent } from './columns-selector.component';
import { DataColumn } from '../../data/data-column.model';
import { Observable, Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { CoreTestingModule } from 'core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('ColumnsSelectorComponent', () => {
    let fixture: ComponentFixture<ColumnsSelectorComponent>;
    let component: ColumnsSelectorComponent;
    let inputColumns: DataColumn[] = [];

    const menuOpenedTrigger = new Subject<void>();
    const menuClosedTrigger = new Subject<void>();

    let mainMenuTrigger: { menuOpened: Observable<void>; menuClosed: Observable<void> };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            declarations: [ColumnsSelectorComponent]
        }).compileComponents();


        fixture = TestBed.createComponent(ColumnsSelectorComponent);
        component = fixture.componentInstance;
        inputColumns = [{
            id: 'id1',
            key: 'key1',
            title: 'title1',
            type: 'text'
        }, {
            id: 'id1',
            key: 'key2',
            title: 'title2',
            type: 'text'
        }, {
            id: 'id3',
            key: 'key3',
            title: 'title3',
            type: 'text'
        }, {
            id: 'id3',
            key: 'NoTitle',
            type: 'text'
        }];

        mainMenuTrigger = {
            menuOpened: menuOpenedTrigger.asObservable(),
            menuClosed: menuClosedTrigger.asObservable()
        };

        component.columns = inputColumns;
        component.mainMenuTrigger = mainMenuTrigger as MatMenuTrigger;

        fixture.detectChanges();
    });

    it('should clear search after closing menu', fakeAsync(() => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        let searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;
        searchInput.value = 'TEST';
        searchInput.dispatchEvent(new Event('input'));

        tick(300);
        expect(searchInput.value).toBe('TEST');

        menuClosedTrigger.next();
        tick(300);
        searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;

        expect(searchInput.value).toBe('');
    }));

    it('should list columns', () => {
        menuOpenedTrigger.next();
        fixture.detectChanges();

        const columnElements = fixture.debugElement.queryAll(By.css('.adf-columns-selector-list-item-container'));

        expect(columnElements.length).toBe(inputColumns.length - 1, 'should not display columns without title');

        expect(columnElements[0].nativeElement.innerText).toBe(inputColumns[0].title);
        expect(columnElements[1].nativeElement.innerText).toBe(inputColumns[1].title);
        expect(columnElements[2].nativeElement.innerText).toBe(inputColumns[2].title);
    });

    it('should filter columns by search text', fakeAsync(() => {
        fixture.detectChanges();
        menuOpenedTrigger.next();

        const searchInput = fixture.debugElement.query(By.css('.adf-columns-selector-search-input')).nativeElement;
        searchInput.value = inputColumns[0].title;
        searchInput.dispatchEvent(new Event('input'));

        tick(400);
        fixture.detectChanges();
        flush();
        fixture.detectChanges();

        const columnElements = fixture.debugElement.queryAll(By.css('.adf-columns-selector-list-item-container'));

        expect(columnElements.length).toBe(1);
        expect(columnElements[0].nativeElement.innerText).toBe(inputColumns[0].title);
    }));
});
