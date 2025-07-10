import { TestBed } from '@angular/core/testing';

import { HistoryChatService } from './history-chat.service';

describe('HistoryChatService', () => {
  let service: HistoryChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
