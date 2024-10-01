import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersBiddersOfItemsComponent } from './sellers-bidders-of-items.component';

describe('SellersBiddersOfItemsComponent', () => {
  let component: SellersBiddersOfItemsComponent;
  let fixture: ComponentFixture<SellersBiddersOfItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellersBiddersOfItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellersBiddersOfItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
