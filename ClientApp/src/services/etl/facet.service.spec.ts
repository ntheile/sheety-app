import { TestBed } from '@angular/core/testing';

import { FacetService } from './facet.service';

describe('FacetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacetService = TestBed.get(FacetService);
    expect(service).toBeTruthy();
  });
});
