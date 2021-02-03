import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { PasswordService } from '@core/services/password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  token: string;
  values: any = {
    password: '',
    passwordTwo: ''
  };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private passwordService: PasswordService) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.token = params.token;
    });
  }

  ngOnInit(): void {
  }

  reset() {
    if (this.values.password !== this.values.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, `Passwords don't match. Make sure they're right.`);
      return;
    }
    this.passwordService.change(this.token, this.values.password).subscribe(result => {
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        this.router.navigateByUrl('/login');
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });
  }

}
