import { TitleService } from '@admin/core/services/title.service';
import { Component, OnInit } from '@angular/core';
import { LABEL } from '@admin/core/constants/title.constants';
import { IGeneralInfo } from '@shared/general-info/general-info.interface';
import { AdminService } from '@admin/core/services/admin.service';
import { loadData, closeAlert } from '@shared/alerts/alerts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  items: Array<IGeneralInfo> = [
    {
      icon: 'fas fa-users',
      title: 'Users',
      value: 'users'
    },
    {
      icon: 'fas fa-store-alt',
      title: 'Items for sale',
      value: 'shopProducts'
    },
    {
      icon: 'fas fa-tags',
      title: 'Tags',
      value: 'tags'
    },
    {
      icon: 'fas fa-genderless',
      title: 'Genres',
      value: 'genres'
    },
    {
      icon: 'fas fa-gamepad',
      title: 'Games',
      value: 'games'
    },
    {
      icon: 'fas fa-archive',
      title: 'Platforms',
      value: 'platforms'
    }
  ];
  loading = true;

  constructor(private titleService: TitleService, private adminService: AdminService) { }

  ngOnInit(): void {
    loadData('Loading', 'Please wait');
    this.titleService.updateTitle(LABEL.DASHBOARD);
    this.adminService.getStats().subscribe((data) => {
      this.loading = false;
      this.items.map((item) => {
        item.value = data[item.value];
        closeAlert();
      });
    });
  }

}
