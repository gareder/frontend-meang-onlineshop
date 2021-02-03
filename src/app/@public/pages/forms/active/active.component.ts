import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { UsersService } from '@core/services/users.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss']
})
export class ActiveComponent implements OnInit {

  token: string;
  values: any = {
    password: '',
    passwordTwo: '',
    birthday: ''
  };

  constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService, private router: Router) {
    this.activatedRoute.params.subscribe((params: any) => {
      this.token = params.token;
      console.log(params);
      console.log(this.token);
    });
  }

  ngOnInit(): void {
    const data = new Date();
    data.setFullYear(data.getFullYear() - 18);
    this.values.birthday = (data.toISOString()).substring(0, 10);
  }

  private formatNumbers(num: number | string) {
    return (+num < 10) ? `0${num}` : num;
  }

  dataAsign($event) {
    console.log('Activation date', $event);
    const date = `${$event.year}-${this.formatNumbers($event.month)}-${this.formatNumbers($event.day)}`;
    console.log(date);
    this.values.birthday = date;
  }

  add() {
    console.log(this.values);
    if (this.values.password !== this.values.passwordTwo) {
      basicAlert(TYPE_ALERT.WARNING, `Passwords don't match. Make sure they're right.`);
      return;
    }
    this.usersService.active(this.token, this.values.birthday, this.values.password).subscribe(result => {
      console.log(result);
      if (result.status) {
        basicAlert(TYPE_ALERT.SUCCESS, result.message);
        // redirect to login
        this.router.navigateByUrl('/login');
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, result.message);
    });

  }

}
