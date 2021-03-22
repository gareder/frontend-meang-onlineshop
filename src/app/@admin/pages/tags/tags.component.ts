import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColums } from '@core/interfaces/table-columns.interface';
import { TAG_LIST_QUERY } from '@graphql/operations/query/tag';
import { formBasicDialog, optionsWithDetails } from '@shared/alerts/alerts';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { DocumentNode } from 'graphql';
import { TagsService } from './tags.service';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constants/title.constants';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  query: DocumentNode = TAG_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;

  constructor(private tagServ: TagsService, private titleService: TitleService) { }

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.TAGS);
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'tags',
      definitionKey: 'tags',
    };
    this.include = false;
    this.columns = [
      { property: 'id', label: '#' },
      { property: 'name', label: 'Tag Name' },
      { property: 'slug', label: 'Slug' },
    ];
  }

  async takeAction(event: Event) {
    // Get info for the actions
    const action = event[0];
    const tag = event[1];
    // Getting the default value
    const defaultValue = tag.name !== undefined && tag.name !== '' ? tag.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Depending the default value, do X action
    switch (action) {
      case 'add':
        // Add genre
        this.addForm(html);
        break;

      case 'edit':
        this.updateForm(html, tag);
        break;

      case 'info':
        const result = await optionsWithDetails(
          'Details',
          `${tag.name} (${tag.slug})`,
          375,
          '<i class="fas fa-edit"></i> Edit', // true
          '<i class="fas fa-lock"></i> Block'
        ); // false
        if (result) {
          this.updateForm(html, tag);
        } else if (result === false) {
          this.blockForm(tag);
        }
        break;

      case 'block':
        this.blockForm(tag);
        return;

      default:
        break;
    }
  }

  private addTag(result) {
    if (result.value) {
      this.tagServ.add(result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private updateTag(id: string, result) {
    console.log(id, result.value);
    if (result.value) {
      this.tagServ.update(id, result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private blockTag(id: string) {
    this.tagServ.block(id).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  private async updateForm(html: string, tag: any) {
    const result = await formBasicDialog('Update tag', html, 'name');
    console.log(result);
    this.updateTag(tag.id, result);
  }

  private async blockForm(tag: any) {
    const result = await optionsWithDetails('Block?', `If you block the item it won't show on the list`, 375, 'No', 'Yes');
    if (result === false) {
      this.blockTag(tag.id);
    }
  }

  private async addForm(html: string) {
    const result = await formBasicDialog('Add tag', html, 'name');
    this.addTag(result);
    return;
  }

}
