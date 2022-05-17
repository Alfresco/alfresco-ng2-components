import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationMock, TranslationService } from 'core';

import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';

describe('NewVersionUploaderDialog', () => {
    let component: NewVersionUploaderDialogComponent;
    let fixture: ComponentFixture<NewVersionUploaderDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [NewVersionUploaderDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewVersionUploaderDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
