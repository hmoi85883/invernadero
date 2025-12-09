import { TestBed } from '@angular/core/testing';

import { SensorDefaultsService } from './sensor-defaults.service';

describe('SensorDefaults', () => {
  let service: SensorDefaultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorDefaultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
