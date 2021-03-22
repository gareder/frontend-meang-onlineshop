import { Component, OnInit } from '@angular/core';
import { IResultData } from '@core/interfaces/result-data.interface';
import { ITableColums } from '@core/interfaces/table-columns.interface';
import { GENRE_LIST_QUERY } from '@graphql/operations/query/genres';
import { formBasicDialog, optionsWithDetails } from '@shared/alerts/alerts';
import { DocumentNode } from 'graphql';
import { GenresService } from './genres.service';
import { basicAlert } from '@shared/alerts/toasts';
import { TYPE_ALERT } from '@shared/alerts/values.config';
import { TitleService } from '@admin/core/services/title.service';
import { LABEL } from '@admin/core/constants/title.constants';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss'],
})
export class GenresComponent implements OnInit {
  query: DocumentNode = GENRE_LIST_QUERY;
  context: object;
  itemsPage: number;
  resultData: IResultData;
  include: boolean;
  columns: Array<ITableColums>;

  constructor(private genreServ: GenresService, private titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.updateTitle(LABEL.GENRES);
    this.context = {};
    this.itemsPage = 10;
    this.resultData = {
      listKey: 'genres',
      definitionKey: 'genres',
    };
    this.include = false;
    this.columns = [
      { property: 'id', label: '#' },
      { property: 'name', label: 'Genre Name' },
      { property: 'slug', label: 'Slug' },
    ];
  }

  async takeAction(event: Event) {
    // Get info for the actions
    const action = event[0];
    const genre = event[1];
    // Getting the default value
    const defaultValue = genre.name !== undefined && genre.name !== '' ? genre.name : '';
    const html = `<input id="name" value="${defaultValue}" class="swal2-input" required>`;
    // Depending the default value, do X action
    switch (action) {
      case 'add':
        // Add genre
        this.addForm(html);
        break;

      case 'edit':
        this.updateForm(html, genre);
        break;

      case 'info':
        const result = await optionsWithDetails(
          'Details',
          `${genre.name} (${genre.slug})`,
          375,
          '<i class="fas fa-edit"></i> Edit', // true
          '<i class="fas fa-lock"></i> Block'
        ); // false
        if (result) {
          this.updateForm(html, genre);
        } else if (result === false) {
          this.blockForm(genre);
        }
        break;

      case 'block':
        this.blockForm(genre);
        return;

      default:
        break;
    }
  }

  private addGenre(result) {
    if (result.value) {
      this.genreServ.add(result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private updateGenre(id: string, result) {
    console.log(id, result.value);
    if (result.value) {
      this.genreServ.update(id, result.value).subscribe((res: any) => {
        console.log(res);
        if (res.status) {
          basicAlert(TYPE_ALERT.SUCCESS, res.message);
          return;
        }
        basicAlert(TYPE_ALERT.WARNING, res.message);
      });
    }
  }

  private blockGenre(id: string) {
    this.genreServ.block(id).subscribe((res: any) => {
      console.log(res);
      if (res.status) {
        basicAlert(TYPE_ALERT.SUCCESS, res.message);
        return;
      }
      basicAlert(TYPE_ALERT.WARNING, res.message);
    });
  }

  private async updateForm(html: string, genre: any) {
    const result = await formBasicDialog('Update genre', html, 'name');
    console.log(result);
    this.updateGenre(genre.id, result);
  }

  private async blockForm(genre: any) {
    const result = await optionsWithDetails('Block?', `If you block the item it won't show on the list`, 375, 'No', 'Yes');
    if (result === false) {
      this.blockGenre(genre.id);
    }
  }

  private async addForm(html: string) {
    const result = await formBasicDialog('Add genre', html, 'name');
    this.addGenre(result);
    return;
  }
}
