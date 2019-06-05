import { TestBed } from '@angular/core/testing';

import { BlockstackService } from './blockstack.service';

describe('BlockstackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockstackService = TestBed.get(BlockstackService);
    expect(service).toBeTruthy();
  });
});
