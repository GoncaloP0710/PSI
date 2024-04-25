import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitesDetailComponent } from './websites-detail.component';

describe('WebsitesDetailComponent', () => {
  let component: WebsitesDetailComponent;
  let fixture: ComponentFixture<WebsitesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsitesDetailComponent]
    });
    fixture = TestBed.createComponent(WebsitesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
