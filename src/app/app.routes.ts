import { Routes } from '@angular/router';
import { HomeComponent } from './view/home/home.component';
import { ForgetPasswordComponent } from './view/secure-pages/forget-password/forget-password.component';
import { LoginComponent } from './view/secure-pages/login/login.component';
import { ResetPasswordComponent } from './view/secure-pages/reset-password/reset-password.component';
import { SignUpComponent } from './view/secure-pages/sign-up/sign-up.component';
import { AlertsComponent } from './view/alerts/alerts.component';
import { HelpPageComponent } from './view/static-pages/help-page/help-page.component';
import { HowToBuyComponent } from './view/static-pages/how-to-buy/how-to-buy.component';
import { HowToSellComponent } from './view/static-pages/how-to-sell/how-to-sell.component';
import { TermsConditionComponent } from './view/static-pages/terms-condition/terms-condition.component';
import { AboutusComponent } from './view/static-pages/aboutus/aboutus.component';
import { PrivacyPolicyComponent } from './view/static-pages/privacy-policy/privacy-policy.component';
import { FoodBevComponent } from './view/categories/food-bev/food-bev.component';
import { ViewAuctionComponent } from './view/categories/food-bev/view-auction/view-auction.component';
import { ParticularAuctionComponent } from './view/categories/food-bev/particular-auction-category/particular-auction/particular-auction.component';
import { SubcategoryComponent } from './view/categories/food-bev/particular-auction-category/subcategory/subcategory.component';
import { BidComponent } from './view/bid/bid.component';
import { BiddersComponent } from './view/bid/bidders/bidders.component';
import { PurchaseComponent } from './view/purchase/purchase.component';
import { ShippingDetailsComponent } from './view/purchase/purchase-shipping/shipping-details/shipping-details.component';
import { AddCardsComponent } from './view/purchase/add-cards/add-cards.component';
import { ProfileComponent } from './view/secure-pages/profile/profile.component';
import { ChangePasswordComponent } from './view/secure-pages/profile/change-password/change-password.component';
import { PurchaseShippingComponent } from './view/purchase/purchase-shipping/purchase-shipping.component';
import { authGuardGuard } from './services/auth-guard.guard'
import { AuctionComponent } from './view/seller/auction/auction.component';
import { SetPriceComponent } from './view/seller/auction/set-price/set-price.component';
import { SellersBiddersOfItemsComponent } from './view/seller/sellers-bidders-of-items/sellers-bidders-of-items.component';
import { SellersUploadDocumentComponent } from './view/seller/sellers-upload-document/sellers-upload-document.component';
import { AuctionDetailsComponent } from './view/seller/auction/auction-details/auction-details.component';
import { UploadDocumentComponent } from './view/secure-pages/sign-up/upload-document/upload-document.component';
import { SellerDashboardComponent } from './view/seller/seller-dashboard/seller-dashboard.component';
import { OrderComponent } from './view/purchase/purchase-shipping/order/order.component';
import { WishlistComponent } from './view/wishlist/wishlist.component';
import { sellerPagesGuard } from './services/seller-pages.guard';
import { buyerPagesGuard } from './services/buyer-pages.guard';
import { compositeGuard } from './services/componsite.guard';


export const routes: Routes = [
 
  {
    path: '', pathMatch: 'full', redirectTo: 'home'
  },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'help', component: HelpPageComponent },
  { path: 'how-to-sell', component: HowToSellComponent },
  { path: 'how-to-buy', component: HowToBuyComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'terms-condition', component: TermsConditionComponent },
  { path: 'alerts', component: AlertsComponent, canActivate: [compositeGuard] },
 //buyer
  { path: 'food-bev', component: FoodBevComponent, canActivate: [buyerPagesGuard] },
  { path: 'view-auction', component: ViewAuctionComponent, canActivate: [buyerPagesGuard] },
  { path: 'particular-auction/:categoryName', component: ParticularAuctionComponent },
  { path: 'subcategory/:categoryName/subcategory/:subcategoryName', component: SubcategoryComponent},
  { path: 'bid/:id', component: BidComponent, canActivate: [buyerPagesGuard] },
  { path: 'bidders', component: BiddersComponent, canActivate: [buyerPagesGuard] },
  { path: 'purchase', component: PurchaseComponent, canActivate: [buyerPagesGuard] },
  { path: 'shipping-details', component: ShippingDetailsComponent, canActivate: [buyerPagesGuard] },
  { path: 'add-cards', component: AddCardsComponent, canActivate: [buyerPagesGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [buyerPagesGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [buyerPagesGuard] },
  { path: 'purchase-shipping/:id', component: PurchaseShippingComponent, canActivate: [buyerPagesGuard] },
  { path: 'order/:id', component: OrderComponent, canActivate: [compositeGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [buyerPagesGuard] },
  //seller
  { path: 'upload-document', component: UploadDocumentComponent, canActivate: [sellerPagesGuard] },
  { path: 'seller-dashboard', component: SellerDashboardComponent, canActivate: [sellerPagesGuard] },
  { path: 'auction', component: AuctionComponent, canActivate: [sellerPagesGuard] },
  { path: 'set-price', component: SetPriceComponent, canActivate: [sellerPagesGuard] },
  { path: 'bidders-of-items', component: BiddersComponent, canActivate: [sellerPagesGuard] },
  { path: 'sellers-bidders-of-items/:id', component: SellersBiddersOfItemsComponent, canActivate: [sellerPagesGuard] },
  { path: 'sellers-upload-document', component: SellersUploadDocumentComponent, canActivate: [sellerPagesGuard] },
  { path: 'auction-details', component: AuctionDetailsComponent, canActivate: [sellerPagesGuard] }
];
