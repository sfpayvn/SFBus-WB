export class SearchContentLayout {
  contentLayouts: ContentLayout[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export interface ContentLayoutZone {
  name: string;
  html: string;
  css: string;
}

export interface ContentLayout {
  _id: string;
  name: string;
  slug: string;
  imageId: string;
  imageUrl: string;
  zones: ContentLayoutZone[];
  description?: string;
  projectData: string;
  appSource: string;
  platform: string;
  isPublish: boolean;
  startDate: string;
  endDate?: string;
}

export interface ContentLayout2Create
  extends Omit<ContentLayout, '_id' | 'selected' | 'imageUrl' | 'isPublish' | 'zones'> {}
export class ContentLayout2Create {
  zones: string = '';
}

export class ContentLayout2Update extends ContentLayout2Create {
  _id: string = '';
  isPublish: boolean = false;
}
