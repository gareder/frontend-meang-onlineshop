import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { IMeData } from '../../../../@core/interfaces/session.interface';
import shopMenuItems from '@data/menus/shop.json';
import { IMenuItem } from '@core/interfaces/menu-item.interface';
import { CartService } from '@shop/core/services/cart.service';
import { REDIRECTS_ROUTES } from '@core/constants/config';
import { Router } from '@angular/router';
import { ICart } from '@shop/core/components/shopping-cart/shopping-cart.interface';
import { optionsWithDetails } from '@shared/alerts/alerts';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  session: IMeData = {
    status: false
  };
  access = false;
  role: string;
  userLabel = '';
  menuItems: Array<IMenuItem> = shopMenuItems;
  cartItemsTotal: number;

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) {
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${this.session.user?.name} ${this.session.user?.lastname}`;
    });
    this.cartService.itemsVar$.subscribe((data: ICart) => {
      if (data !== undefined && data !== null) {
        this.cartItemsTotal = data.subtotal;
      }
    });
  }

  ngOnInit(): void {
    this.cartItemsTotal = this.cartService.initilize().subtotal;
  }

  async logout() {
    this.authService.resetSession(this.router.url);
  }

  open() {
    this.cartService.openNav();
  }

}
