import { TestBed } from '@angular/core/testing';

import { WebpageService } from './webpage.service';

describe('WebpageService', () => {
  let service: WebpageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebpageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
