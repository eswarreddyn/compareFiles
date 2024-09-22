import { TestBed } from '@angular/core/testing';

import { ComparefilesService } from './comparefiles.service';

describe('ComparefilesService', () => {
  let service: ComparefilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparefilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
