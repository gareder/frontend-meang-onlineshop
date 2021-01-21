import { Component, OnInit } from '@angular/core';
import { DocumentNode } from 'graphql';
import { IResultData } from '../../../@core/interfaces/result-data.interface';
import { USERS_LIST_QUERY } from '@graphql/operations/query/user';
import { ITableColums } from '@core/interfaces/table-columns.interface';
import { optionsWithDetails, userFormBasicDialog } from '@shared/alerts/alerts';
import { UsersAdminService } from './users.service';
import { IRegisterForm } from '@core/interfaces/register.interface';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  query: DocumentNode = USERS_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;

  constructor(private userAdminService: UsersAdminService) {}

  ngOnInit(): void {
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'users',
      definitionKey: 'users'
    };
    this.include = true;
    this.columns = [
      { property: 'id', label: '#' },
      { property: 'name', label: 'Name' },
      { property: 'lastname', label: 'Lastname' },
      { property: 'email', label: 'Email' },
      { property: 'role', label: 'Role' }
    ];
  }

  private initializeForm(user: any) {
    // Getting the default value
    const defaultName = user.name !== undefined && user.name !== '' ? user.name : '';
    const defaultLastname = user.lastname !== undefined && user.lastname !== '' ? user.lastname : '';
    const defaultEmail = user.email !== undefined && user.email !== '' ? user.email : '';
    const roles = new Array(2);
    roles[0] = user.role !== undefined && user.role === 'ADMIN' ? 'selected' : '';
    roles[1] = user.role !== undefined && user.role === 'CLIENT' ? 'selected' : '';
    return `
    <input id="name" value="${defaultName}" class="swal2-input" placeholder="Name" required>
    <input id="lastname" value="${defaultLastname}" class="swal2-input" placeholder="Lastname" required>
    <input id="email" value="${defaultEmail}" class="swal2-input" placeholder="Email" required>
    <select id="role" class="swal2-input">
      <option value="ADMIN" ${roles[0]}>Admin</option>
      <option value="CLIENT" ${roles[1]}>Client</option>
    </select>
    `;
  }

  async takeAction(event: Event) {
    // Get info for the actions
    const action = event[0];
    const user = event[1];
    // Depending the default value, do X action
    const html = this.initializeForm(user);
    switch (action) {
      case 'add':
        // Add genre
        this.addForm(html);
        break;

      case 'edit':
        this.updateForm(html, user);
        break;

      case 'info':
        const result = await optionsWithDetails(
          'Details',
          `${user.name} ${user.lastname}<br>
          <i class="fas fa-envelope-open-text"></i> ${user.email}`,
          375,
          '<i class="fas fa-edit"></i> Edit', // true
          '<i class="fas fa-lock"></i> Block'
        ); // false
        if (result) {
          this.updateForm(html, user);
        } else if (result === false) {
          this.blockForm(user);
        }
        break;

      case 'block':
        this.blockForm(user);
        return;

      default:
        break;
    }
  }

  private async addForm(html: string) {
    const result = await userFormBasicDialog('Add user', html);
    this.addUser(result);
    return;
  }

  private addUser(result) {
    if (result.value) {
      const user: IRegisterForm = result.value;
      user.password = '1234';
      user.active = false;
      this.userAdminService.register(result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private async updateForm(html: string, user: any) {
    const result = await userFormBasicDialog('Update user', html);
    console.log(result);
    this.updateUser(result, user.id);
    return;
  }

  private updateUser(result, id: string) {
    if (result.value) {
      const user = result.value;
      user.id = id;
      console.log(user);
      this.userAdminService.update(user).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private blockUser(id: string) {
    this.userAdminService.block(id).subscribe((res: any) => {
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  private async blockForm(user: any) {
    const result = await optionsWithDetails('Block?', `If you block the item it won't show on the list`, 375, 'No', 'Yes');
    if (result === false) {
      this.blockUser(user.id);
    }
  }

}
