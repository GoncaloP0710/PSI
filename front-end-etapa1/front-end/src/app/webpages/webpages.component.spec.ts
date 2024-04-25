import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpagesComponent } from './webpages.component';

describe('WebpagesComponent', () => {
  let component: WebpagesComponent;
  let fixture: ComponentFixture<WebpagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebpagesComponent]
    });
    fixture = TestBed.createComponent(WebpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
