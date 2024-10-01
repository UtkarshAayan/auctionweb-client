import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject, OnDestroy, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ProbidService } from '../../../services/probid.service';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-bidders',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './bidders.component.html',
  styleUrls: ['./bidders.component.css']
})
export class BiddersComponent implements OnInit, OnDestroy {
  @Input() productId!: string;
  userId!: string;
  probidService = inject(ProbidService);
  editData: any;
  timer: string = '00:00:00';
  timerSubscription: Subscription | null = null;
  
  fb = inject(FormBuilder);
  router = inject(Router)
  bidForm!: FormGroup;

  ngOnInit(): void {
    this.bidForm = this.fb.group({
      bidAmount: ['', Validators.required]
    })
     this.productId = '66aa6901a370b2496392a3dd';
     this.userId = '668bca8bc84ee907644fad50';
    this.getProductById(this.productId);
  }

  getProductById(id: any) {
    this.probidService.getProductById(id).subscribe(data => {
      this.editData = data;
      console.log(this.editData)
      this.startTimer();
    });
  }

  startTimer(): void {
    if (!this.editData) return;

    const now = new Date();
    const startTime = new Date(`${this.editData.startDate}T${this.editData.startTime}`);
    const endTime = new Date(`${this.editData.endDate}T${this.editData.stopTime}`);

    if (now < startTime || now > endTime) {
      this.timer = '00:00:00';
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      const currentTime = new Date();
      let remainingTime = endTime.getTime() - currentTime.getTime();
      if (remainingTime <= 0) {
        remainingTime = 0;
        this.timerSubscription?.unsubscribe();
        this.editData.status = 'expired';
      }
      this.timer = this.formatTime(remainingTime);
    });
  }

  formatTime(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${this.pad(days)} Days ${this.pad(hours)} Hours ${this.pad(minutes)} Minutes ${this.pad(seconds)} Seconds`;
  }

  pad(number: number): string {
    return number.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  submit() {
  
    const bid = {
      bidAmount: this.bidForm.get('bidAmount')?.value,
      productId: this.productId,
      userId: this.userId
    };
  
    this.probidService.createBidService1(bid)
      .subscribe({
        next: (res) => {
          alert("Bid Placed Successfully");
          this.getProductById(this.productId);
          this.bidForm.reset();
        },
        error: (err) => {
          alert("Bidding Price is Low");
          console.log(err);
        }
      });
  }
}
