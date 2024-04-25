import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpagesDetailComponent } from './webpages-detail.component';

describe('WebpagesDetailComponent', () => {
  let component: WebpagesDetailComponent;
  let fixture: ComponentFixture<WebpagesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebpagesDetailComponent]
    });
    fixture = TestBed.createComponent(WebpagesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
