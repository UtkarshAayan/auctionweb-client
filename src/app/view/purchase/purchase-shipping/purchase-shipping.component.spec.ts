import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShippingComponent } from './purchase-shipping.component';

describe('PurchaseShippingComponent', () => {
  let component: PurchaseShippingComponent;
  let fixture: ComponentFixture<PurchaseShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseShippingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
