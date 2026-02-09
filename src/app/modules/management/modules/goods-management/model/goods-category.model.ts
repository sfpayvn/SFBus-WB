export class SearchGoodsCategory {
  goodsCategories: readonly GoodsCategory[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class GoodsCategory {
  _id: string = '';
  name: string = '';
  iconId: string = '';
  icon: string = '';
  status: string = '';
  selected: boolean = false;
}

export interface GoodsCategory2Create extends Omit<GoodsCategory, '_id' | 'icon' | 'selected'> {}
export class GoodsCategory2Create {}

export class GoodsCategory2Update extends GoodsCategory2Create {
  _id: string = '';
}
