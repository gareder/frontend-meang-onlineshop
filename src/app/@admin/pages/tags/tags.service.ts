import { Injectable } from '@angular/core';
import { ADD_TAG, BLOCK_TAG, MODIFY_TAG } from '@graphql/operations/mutation/tag';
import { ApiService } from '@graphql/services/api.service';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagsService extends ApiService {

  constructor(public apollo: Apollo) {
    super(apollo);
  }

  add(tag: string) {
    return this.set(ADD_TAG, { tag }, {}).pipe(map((result: any) => {
      return result.addTag;
    }));
  }

  update(id: string, tag: string) {
    return this.set(MODIFY_TAG, { id, tag }, {}).pipe(map((result: any) => {
      return result.updateTag;
    }));
  }

  block(id: string) {
    return this.set(BLOCK_TAG, { id }, {}).pipe(map((result: any) => {
      return result.blockGenre;
    }));
  }

}
