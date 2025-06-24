import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarCommonComponent } from './nav-bar-common.component';

describe('NavBarCommonComponent', () => {
  let component: NavBarCommonComponent;
  let fixture: ComponentFixture<NavBarCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarCommonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
