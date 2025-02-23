export class SearchFile {
  files: File[] = [];
  pageIdx: number = 0;
  totalItem: number = 0;
  totalPage: number = 0;
}

export class File {
  _id: string = '';
  filename: string = '';
  link: string = '';
  folderId: string = '';
  isFavorite: boolean = false;
  selected: boolean = false;
  oldValue: string = '';
  temp: boolean = false;
}

export class File2Update {
  _id: string = '';
  filename: string = '';
  folderId: string = '';
  isFavorite: boolean = false;
}

export class FileFolder {
  _id: string = '';
  name: string = '';
  icon?: string = '';
  selected?: boolean = false;
  isEditing?: boolean = false;
  oldValue?: string = '';
}

export class FileFolder2Create {
  name: string = '';
}


export class FileFolder2Update extends FileFolder2Create {
  _id: string = '';
}




