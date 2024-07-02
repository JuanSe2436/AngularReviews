import { TestBed } from '@angular/core/testing';

import { BookReviewsService } from './book-reviews.service';

describe('BookReviewsService', () => {
  let service: BookReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
