import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddersComponent } from './bidders.component';

describe('BiddersComponent', () => {
  let component: BiddersComponent;
  let fixture: ComponentFixture<BiddersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiddersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BiddersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
