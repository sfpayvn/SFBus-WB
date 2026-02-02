export class SearchWidgetBlock {
  widgetBlocks: WidgetBlock[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export interface WidgetBlock {
  _id: string;
  name: string;
  imageId: string;
  imageUrl: string;
  html: string;
  css?: string;
  projectData: string;
  isActive: boolean;
}

export interface WidgetBlock2Create extends Omit<WidgetBlock, '_id' | 'selected' | 'imageUrl' | 'isActive'> {}
export class WidgetBlock2Create {}

export class WidgetBlock2Update extends WidgetBlock2Create {
  _id: string = '';
}
