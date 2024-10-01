import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersUploadDocumentComponent } from './sellers-upload-document.component';

describe('SellersUploadDocumentComponent', () => {
  let component: SellersUploadDocumentComponent;
  let fixture: ComponentFixture<SellersUploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellersUploadDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellersUploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
