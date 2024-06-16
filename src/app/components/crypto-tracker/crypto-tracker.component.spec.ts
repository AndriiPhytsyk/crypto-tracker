import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoTrackerComponent } from './crypto-tracker.component';

describe('CryptoTrackerComponent', () => {
  let component: CryptoTrackerComponent;
  let fixture: ComponentFixture<CryptoTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CryptoTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
