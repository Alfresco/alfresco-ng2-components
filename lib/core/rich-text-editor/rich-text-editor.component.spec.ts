import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;
  let debugElement: DebugElement;

  const cssSelectors = {
    editorContent: '.codex-editor'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RichTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RichTextEditorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render rich text editor', async () => {
    await fixture.whenStable();
    const editor = debugElement.query(By.css(cssSelectors.editorContent));
    expect(editor).toBeTruthy();
  });

});
