import { async, TestBed } from '@angular/core/testing';
import { ErrorModule } from './error.module';

describe('ErrorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ErrorModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ErrorModule).toBeDefined();
  });
});
