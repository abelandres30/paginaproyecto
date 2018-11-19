import { TestBed, inject } from '@angular/core/testing';

import { ForoproblemasService } from './foroproblemas.service';

describe('ForoproblemasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForoproblemasService]
    });
  });

  it('should be created', inject([ForoproblemasService], (service: ForoproblemasService) => {
    expect(service).toBeTruthy();
  }));
});
