import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRichTextComponent } from './display-rich-text.widget';

describe('DisplayRichTextComponent', () => {
  let component: DisplayRichTextComponent;
  let fixture: ComponentFixture<DisplayRichTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayRichTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
