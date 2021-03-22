import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  toggledValue = true;
  @Output() toggleChange = new EventEmitter<boolean>();
  userLabel = '';

  constructor(private authService: AuthService, private router: Router) {
    this.authService.accessVar$.subscribe((result) => {
      if (!result.status) {
        this.router.navigateByUrl('/');
        return;
      }
      this.userLabel = `${result.user?.name} ${result.user?.lastname}`;
    });
  }

  ngOnInit(): void {
    this.authService.start();
  }

  toggled() {
    if (this.toggledValue === undefined) {
      this.toggledValue = true;
    }
    this.toggledValue = !this.toggledValue;
    console.log(this.toggledValue);
    this.toggleChange.emit(this.toggledValue);
  }

  logout() {
    this.authService.resetSession();
  }
}
