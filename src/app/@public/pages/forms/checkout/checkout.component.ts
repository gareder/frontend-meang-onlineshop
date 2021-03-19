import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CURRENCY_CODE } from '@core/constants/config';
import { IMeData } from '@core/interfaces/session.interface';
import { AuthService } from '@core/services/auth.service';
import { StripePaymentService } from '@mugan86/stripe-payment-form';
import { infoEventAlert, loadData } from '@shared/alerts/alerts';
import { CartService } from '@shop/core/services/cart.service';
import { CustomerService } from '@shop/core/services/stripe/customer.service';
import { take } from 'rxjs/internal/operators/take';
import { environment } from 'src/environments/environment';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { ChargeService } from '@shop/core/services/stripe/charge.service';
import { IPayment } from '@core/interfaces/stripe/payment.interface';
import { ICart } from '../../../core/components/shopping-cart/shopping-cart.interface';
import { ICharge } from '@core/interfaces/stripe/charge.interface';
import { IMail } from '@core/interfaces/mail.interface';
import { MailService } from '@core/services/mail.service';
import { IProduct } from '@mugan86/ng-shop-ui/lib/interfaces/product.interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  meData: IMeData;
  key = environment.stripePublicKey;
  address = '';
  available = false;

  constructor(private auth: AuthService, private router: Router, private stripePayment: StripePaymentService,
              private cartService: CartService, private customerservice: CustomerService, private chargeService: ChargeService,
              private mailService: MailService) {
    this.auth.accessVar$.subscribe((data: IMeData) => {
      if (!data.status) {
        this.router.navigateByUrl('/login');
        return;
      }
      this.meData = data;
    });

    this.cartService.itemsVar$.pipe(take(1)).subscribe((cart: ICart) => {
      if (this.cartService.cart.total === 0 && this.available === false) {
        this.available = false;
        this.notAvailableProducts();
      }
    });

    this.stripePayment.cardTokenVar$.pipe(take(1)).subscribe((token: string) => {
      if (token.indexOf('tok_') > -1 && this.meData.status && this.address !== '') {
        if (this.cartService.cart.total === 0) {
          this.available = false;
          this.notAvailableProducts();
        }
        // Save the data to be sent
        const payment: IPayment = {
          token,
          amount: this.cartService.cart.total.toString(),
          description: this.cartService.orderDescription(),
          customer: this.meData.user.stripeCustomer,
          currency: CURRENCY_CODE
        };
        const stockManage: Array<IStock> = [];
        this.cartService.products.map((item: IProduct) => {
          stockManage.push({
            id: +item.id,
            increment: item.qty * (-1)
          });
        });
        loadData('Processing payment', 'Please wait');
        // Send data and make payment
        this.chargeService.pay(payment, stockManage).pipe(take(1))
            .subscribe(async(result: {status: boolean, message: string, charge: ICharge}) => {
          if (result.status) {
            console.log('OK');
            console.log(result.charge);
            await infoEventAlert('Payment made successfully', 'Thank you for your payment', TYPE_ALERT.SUCCESS);
            this.sendEmail(result.charge);
            this.router.navigateByUrl('/orders');
            this.cartService.clear();
            return;
          } else {
            console.log(result.message);
            await infoEventAlert('Payment not made', 'Try again please', TYPE_ALERT.WARNING);
          }
        });
      }
    });
  }

  async notAvailableProducts() {
    this.cartService.closeNav();
    this.available = false;
    await infoEventAlert('Not available', `You can't go to checkout if your cart is empty`, TYPE_ALERT.WARNING);
    this.router.navigateByUrl('/');
  }

  sendEmail(charge: ICharge) {
    const mail: IMail = {
      to: charge.receiptEmail,
      subject: 'Payment made',
      html: `Payment was made successfully. You can check the receipt <a href="${charge.receiptUrl}" target="_blank">here</a>`
    };
    this.mailService.send(mail).pipe(take(1)).subscribe();
  }

  ngOnInit(): void {
    this.auth.start();
    if (localStorage.getItem('address')) {
      this.address = localStorage.getItem('address');
      localStorage.removeItem('address');
    }
    this.cartService.initilize();
    localStorage.removeItem('route_after_login');
    if (this.cartService.cart.total === 0) {
      this.available = false;
      this.notAvailableProducts();
    } else {
      this.available = true;
    }
  }

  async sendData() {
    if (this.meData.user.stripeCustomer === null) {
      // Alert for feedback
      await infoEventAlert(`Client doesn't exists`, `A client is required to make the payment`);
      const stripeName = `${this.meData.user.name} ${this.meData.user.lastname}`;
      loadData('Processing the information', 'Creating the customer');
      this.customerservice.add(stripeName, this.meData.user.email).pipe(take(1))
          .subscribe(async(result: {status: boolean, message: string}) => {
        if (result.status) {
          await infoEventAlert(`Client added to the user`, `Log in again`, TYPE_ALERT.SUCCESS);
          localStorage.setItem('address', this.address);
          localStorage.setItem('route_after_login', this.router.url);
          this.auth.resetSession();
        } else {
          await infoEventAlert(`Client not added to the user`, result.message, TYPE_ALERT.WARNING);
        }
      });
      return;
    }
    this.stripePayment.takeCardToken(true);
  }

}
