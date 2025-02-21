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
  selected: boolean = false;
  oldValue: string = '';
}

export class File2Create {
  filename: string = '';
}

export class File2Update extends File2Create {
  _id: string = '';
}

export class FileFolder {
  _id: string = '';
  name: string = '';
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




