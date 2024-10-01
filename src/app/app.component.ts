import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet,Router, NavigationStart,NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import {HeaderComponent } from './view/header/header.component';
import {FooterComponent } from './view/footer/footer.component';
import { LoginComponent } from './view/secure-pages/login/login.component';
import {SignUpComponent} from './view/secure-pages/sign-up/sign-up.component';
import { HomeComponent } from './view/home/home.component';
import {AuthService} from './services/auth.service';
import {ForgetPasswordComponent} from './view/secure-pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './view/secure-pages/reset-password/reset-password.component';
import { BidComponent } from './view/bid/bid.component';
import { BiddersComponent } from './view/bid/bidders/bidders.component';
import { ToastComponent } from './view/toast/toast.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule,HeaderComponent,FooterComponent,LoginComponent,SignUpComponent,HomeComponent,ForgetPasswordComponent,ResetPasswordComponent,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showHeaderFooter: boolean = true;
  title = 'client';
  isadmin=false;

  constructor(private router: Router) {
// const role= localStorage.setItem("roles","admin")

    // console.log(role)
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url == '/login' || val.url == '/signup' || val.url == '/forget-password' || val.url == '/reset-password/:token' || val.url == '/how-to-sell' || val.url == '/how-to-buy' || val.url == '/privacy-policy' || val.url == '/aboutus' || val.url == '/terms-condition') {
          this.showHeaderFooter = false;
        } else {
          this.showHeaderFooter = true;
        }
      }
    });
  }

}
