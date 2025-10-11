export interface Promotion {
  _id: string;

  promotionId: string;

  imageId: string;

  image: string;

  name: string;

  code: string;

  description: string;

  discountType: 'percentage' | 'fixed';

  discountValue: number;

  expireDate: Date;

  status: 'active' | 'inactive' | 'expired';
}

export interface SearchPromotionQuerySortFilter {
  key: string;
  value: string;
}

export interface SearchPromotionQuery {
  pageIdx: number;
  pageSize: number;
  keyword: string;
  sortBy: SearchPromotionQuerySortFilter;
  filters: SearchPromotionQuerySortFilter[];
}

export interface SearchPromotion {
  pageIdx: number;
  promotions: Promotion[];
  totalPage: number;
  totalItem: number;
}

export interface Promotion2Create
  extends Omit<Promotion, '_id' | 'selected' | 'isEditing' | 'createdAt' | 'updatedAt'> {}
export class Promotion2Create {}

export interface Promotion2Update extends Promotion2Create {
  _id: string;
}
