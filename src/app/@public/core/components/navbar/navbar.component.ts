import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { IMeData } from '../../../../@core/interfaces/session.interface';
import shopMenuItems from '@data/menus/shop.json';
import { IMenuItem } from '@core/interfaces/menu-item.interface';
import { CartService } from '@shop/core/services/cart.service';


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

  constructor(private authService: AuthService, private cartService: CartService) {
    this.authService.accessVar$.subscribe((result) => {
      this.session = result;
      this.access = this.session.status;
      this.role = this.session.user?.role;
      this.userLabel = `${this.session.user?.name} ${this.session.user?.lastname}`;
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.resetSession();
  }

  open() {
    this.cartService.openNav();
  }

}
