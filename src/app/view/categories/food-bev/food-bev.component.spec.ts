import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodBevComponent } from './food-bev.component';

describe('FoodBevComponent', () => {
  let component: FoodBevComponent;
  let fixture: ComponentFixture<FoodBevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodBevComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodBevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
