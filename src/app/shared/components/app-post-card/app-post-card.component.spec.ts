import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPostCardComponent } from './app-post-card.component';

describe('AppPostCardComponent', () => {
  let component: AppPostCardComponent;
  let fixture: ComponentFixture<AppPostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPostCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
