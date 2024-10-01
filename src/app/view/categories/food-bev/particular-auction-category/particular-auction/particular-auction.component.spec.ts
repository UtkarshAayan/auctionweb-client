import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularAuctionComponent } from './particular-auction.component';

describe('ParticularAuctionComponent', () => {
  let component: ParticularAuctionComponent;
  let fixture: ComponentFixture<ParticularAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticularAuctionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticularAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
