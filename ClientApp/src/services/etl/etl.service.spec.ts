import { TestBed } from '@angular/core/testing';

import { EtlService } from './etl.service';

describe('EtlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EtlService = TestBed.get(EtlService);
    expect(service).toBeTruthy();
  });
});
