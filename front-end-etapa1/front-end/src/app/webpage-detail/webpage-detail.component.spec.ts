import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageDetailComponent } from './webpage-detail.component';

describe('WebpageDetailComponent', () => {
  let component: WebpageDetailComponent;
  let fixture: ComponentFixture<WebpageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebpageDetailComponent]
    });
    fixture = TestBed.createComponent(WebpageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
