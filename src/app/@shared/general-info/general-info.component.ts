import { Component, Input, OnInit } from '@angular/core';
import { IGeneralInfo } from '@shared/general-info/general-info.interface';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

   @Input() item: IGeneralInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
