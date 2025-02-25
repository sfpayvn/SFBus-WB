import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import _, { remove } from 'lodash';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { FileFolder, SearchFile, File, FileFolder2Create, FileFolder2Update, File2Update } from './model/file-center.model';
import { FilesService } from './service/files-center.servive';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart, } from '@angular/cdk/drag-drop';
import { Utils } from 'src/app/shared/utils/utils';
import { ViewImageDialogComponent } from './components/view-image-dialog/view-image-dialog.component';

@Component({
  selector: 'app-files-center',
  templateUrl: './files-center.component.html',
  styleUrls: ['./files-center.component.scss'],
  standalone: false
})
export class FilesComponent implements OnInit {
  @ViewChild('inputFileFolder') inputFileFolder!: ElementRef;

  @Input() isDialog: boolean = false;
  @Input() isChooseMultiple: boolean = true;
  @Output() chooseFileEvent = new EventEmitter<any>();

  fileFolders: FileFolder[] = [
    {
      _id: 'all-media',
      name: 'Tất cả ảnh',
      icon: 'multi-folder.svg',
      selected: true,
    },
    {
      _id: 'favorite',
      name: 'Yêu thích',
      icon: 'favorite.svg',
      selected: false,
    }
  ];
  originalFileFolders: FileFolder[] = [];

  searchFile: SearchFile = new SearchFile();

  selectAll: boolean = false;

  selectedFiles: File[] = [];

  pageIdx: number = 1;
  pageSize: number = 30;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';
  filter: string = '';

  isLoadingFile: boolean = false;

  constructor(
    private fileService: FilesService,
    private dialog: MatDialog,
    private utilsModal: UtilsModal,
    public utils: Utils,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingFile = true;
    this.loadFileFolders();
    this.loadFiles();
  }

  loadFileFolders() {
    this.fileService.getFileFolder().subscribe((res: any) => {
      if (res) {
        this.fileFolders.push(...res);
        this.originalFileFolders = [...this.fileFolders]; // Save original folders
      }
    })
  }

  loadFiles() {
    const fileFolderId = this.getActiveFolderId();
    this.filter = this.getFilter()

    this.fileService.searchFile(this.pageIdx, this.pageSize, this.keyword, this.sortBy, this.filter, fileFolderId).subscribe({
      next: (res: SearchFile) => {
        if (res) {
          this.searchFile = res;
          this.totalItem = this.searchFile.totalItem;
          this.totalPage = this.searchFile.totalPage;
        }
        this.isLoadingFile = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingFile = false;
      },
    });
  }

  resetFileData(): void {
    this.searchFile = new SearchFile();
    this.selectedFiles = [];
    this.pageIdx = 1;
    this.pageSize = 30;
    this.totalPage = 0;
    this.totalItem = 0;
    this.keyword = '';
    this.sortBy = '';
    this.isLoadingFile = false;
    this.loadFiles();
  }

  toggleFile(file: File): void {
    if (!this.isChooseMultiple && this.selectedFiles.length > 0 && !this.isSelected(file)) {
      this.selectedFiles = [];
      this.selectedFiles.push(file);
      return;
    }
    const index = this.selectedFiles.findIndex(f => f._id === file._id);
    if (index >= 0) {
      this.selectedFiles.splice(index, 1);
    } else {
      this.selectedFiles.push(file);
    }

  }

  isSelected(file: File): boolean {
    return this.selectedFiles.some(f => f._id === file._id);
  }

  getIndexSelectedFile(file: File): string {
    const index = this.selectedFiles.findIndex(f => f._id === file._id);
    return index !== -1 ? (index + 1).toString() : '';
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchFile.files.some((file) => !file.selected);
  }

  unSelectAllfile() {
    this.selectedFiles = [];
  }

  deleteFileSelected() {
    this.utilsModal.openModalConfirm('Xóa file',
      `Are you sure you want to delete this file? All of your data will be permanently removed. This action cannot be undone.`,
      'dangerous').subscribe((result) => {
        if (result) {
          const ids = this.selectedFiles.map(file => file._id);
          this.fileService.deleteFiles(ids).subscribe({
            next: (res: any) => {
              if (res) {
                this.loadFiles();
                toast.success('Xóa file thành công');
                this.selectedFiles = [];
              }
            },
            error: (error: any) => this.utils.handleRequestError(error),
          });
        }
      });
  }

  setFavoriteFile($event: any, file: File): void {
    $event.stopPropagation();
    file.isFavorite = !file.isFavorite;
    this.updateFile(file);
  }

  deleteFile($event: any, file: File): void {
    $event.stopPropagation();
    const dialogRef = this.utilsModal.openModalConfirm('Xóa file',
      `Are you sure you want to delete this file "${file.filename}? All of your data will be permanently removed. This action cannot be undone.`, 'dangerous');
    dialogRef.subscribe((result) => {
      if (result) {
        this.fileService.deleteFile(file._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.loadFiles();
              toast.success('Xóa file thành công');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  zoomFile($event: any, file: File): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(ViewImageDialogComponent, {
      height: 'max-content',
      width: 'max-content',
      maxWidth: 'max-content',
      panelClass: 'custom-dialog-view-image',
      backdropClass: 'custom-back-drop-view-image',
      data: {
        file: file
      }
    });
  }

  uploadFile(files2Upload: FileList): void {

    const folderId = this.getActiveFolderId();
    this.fileService.uploadFiles(files2Upload, folderId).subscribe({
      next: (res: File) => {
        if (res) {
          this.loadFiles();
          toast.success('File added successfully');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  updateFile(item: File) {
    this.fileService.updateFile(item).subscribe((res: any) => {
      if (!res) {
        toast.error("Cập nhập thư mục không thành công");
        return;
      }
      toast.success("Cập nhập thư mục thành công");
    })
  }


  updateFiles2Folder(files: File[], fileFolderId: string) {
    this.fileService.updateFiles2Folder(files, fileFolderId).subscribe((res: any) => {
      if (!res) {
        toast.error("Cập nhập thư mục không thành công");
        return;
      }
      const isNotFolder = this.getActiveFolderId() === '';
      if (!isNotFolder) {
        this.loadFiles();
      }
      toast.success("Cập nhập thư mục thành công");
    })
  }

  setEditFile(item: File) {
    item.oldValue = item.filename;
  }

  onEnterFile($event?: any) {
    const inputElement = $event.target as HTMLInputElement;
    inputElement.blur();
  }

  onEscFile(item: File, $event?: any) {
    item.filename = item.oldValue;
    const inputElement = $event.target as HTMLInputElement;
    inputElement.blur();
  }

  handleUpdateFile(item: File, $event?: any) {
    const trimmedName = item.filename.trim();
    if (trimmedName != '' && item.filename !== item.oldValue) {
      this.updateFile(item);
    } else {
      item.filename = item.oldValue;
    }
  }

  reloadFilePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadFiles();
  }

  searchFileData($event: any) {
    this.pageIdx = 1;
    this.keyword = $event.target.value;;
    this.loadFiles();
  }

  sortFilePage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadFiles();
  }

  getActiveFolderId(): string {
    const id = this.fileFolders.find((item) => item.selected && this.utils.isValidObjectId(item._id))?._id ?? '';
    return id;
  }

  getFilter(): string {
    return this.fileFolders.find((item) => item.selected && !this.utils.isValidObjectId(item._id))?._id ?? '';
  }

  selectFileFolder(item: any) {
    if (item.selected) {
      return
    }
    this.fileFolders = this.fileFolders.map(folder => ({
      ...folder,
      selected: folder._id === item._id
    }));
    this.selectedFiles = [];
    this.loadFiles();
  }

  searchFolder($event: any) {
    const keyword = $event.target.value.toLowerCase();
    this.fileFolders = this.originalFileFolders.filter(folder =>
      folder.name.toLowerCase().includes(keyword)
    );
  }

  addFileFolderInput() {
    const isCreatingFileFolder = this.fileFolders.find((item) => item._id === 'create-new');
    if (isCreatingFileFolder) {
      return;
    }
    const fileFolderInputCreate = {
      _id: 'create-new', name: ''
    }
    this.fileFolders.push(fileFolderInputCreate);
    this.setIsEditFileFolder(fileFolderInputCreate);
    this.setAutoFocusFileInput();
  }

  setAutoFocusFileInput() {
    setTimeout(() => {
      this.inputFileFolder.nativeElement.focus();
    }, 50);
  }

  setIsEditFileFolder(item: FileFolder) {
    this.fileFolders = this.fileFolders.map((file: FileFolder) => ({
      ...file,
      isEditing: file === item,
      oldValue: item.name
    }));
    this.setAutoFocusFileInput();

  }

  cancelEditFileFolder(item: FileFolder) {
    if (item._id === 'create-new') {
      _.remove(this.fileFolders, { _id: item._id });
      return;
    }
    item.isEditing = false;
    item.name = item.oldValue ?? item.name;
  }

  handleActoinFolderInput(item: FileFolder) {
    const trimmedName = item.name.trim();
    item._id === 'create-new' ? this.handleCreateNewFileFolder(item, trimmedName) : this.handleUpdateFileFolder(item, trimmedName);
  }

  handleCreateNewFileFolder(item: FileFolder, trimmedName: string) {
    if (trimmedName === '') {
      this.cancelEditFileFolder(item);
    } else {
      this.createFileFolder(item);
    }
  }

  handleUpdateFileFolder(item: FileFolder, trimmedName: string) {
    if (trimmedName === '' || item.name === item.oldValue) {
      this.cancelEditFileFolder(item);
    } else {
      item.isEditing = false;
      this.updateFileFolder(item);
    }
  }

  createFileFolder(item: FileFolder) {
    const fileFolder2Create: FileFolder2Create = {
      name: item.name
    }
    this.fileService.createFileFolder(fileFolder2Create).subscribe((res: any) => {
      if (!res) {
        toast.error("Tạo thư mục không thành công");
        _.remove(this.fileFolders, { _id: item._id })
        return;
      }
      item._id = res._id;
      toast.success("Tạo thư mục thành công");
      item.isEditing = false;
      this.originalFileFolders = this.fileFolders;
    })
  }

  updateFileFolder(item: FileFolder2Update) {
    this.fileService.updateFileFolder(item).subscribe((res: any) => {
      if (!res) {
        toast.error("Cập nhập thư mục không thành công");
        return;
      }
      this.originalFileFolders = this.fileFolders;
      toast.success("Cập nhập thư mục thành công");
    })
  }

  deleteFileFolder(item: FileFolder) {
    this.utilsModal.openModalConfirm(
      'Xóa thư mục',
      `Bạn có chắc chắn muốn xóa thư mục '${item.name}' này không? Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Không thể hoàn tác hành động này`,
      'dangerous',
    ).subscribe((res: any) => {
      if (res) {
        this.fileService.deleteFileFolder(item._id).subscribe((res: any) => {
          if (!res) {
            toast.success("Xóa thư mực không thành công");
            return;
          }
          _.remove(this.fileFolders, { _id: item._id })
          this.originalFileFolders = this.fileFolders;
          toast.success("Xóa thư mực thành công");
        }, (error: any) => {
          console.log("🚀 ~ FileComponent ~ ).subscribe ~ error:", error)
        })
      }
    })
  }

  onFileChange($event: any) {
    const files: FileList = $event.target.files;
    this.uploadFile(files);
  }

  drop(event: CdkDragDrop<any[]>): void {
    console.log("🚀 ~ FilesComponent ~ drop ~ drop:");
    remove(this.searchFile.files, { temp: true });
    const droppedElement = event.event.target as HTMLElement;

    const parentDrop = this.getParentDrop(droppedElement);
    if (!parentDrop) {
      return;
    }
    const fileFolderId = parentDrop.id;
    const fileDrop = event.item.data;

    if (!this.utils.isValidObjectId(fileFolderId) || fileDrop.folderId === fileFolderId) {
      return;
    }
    const listFile2MoveFolder = [];
    // Thêm fileDrop vào danh sách
    listFile2MoveFolder.push(fileDrop);
    // Lọc các file đã chọn để loại bỏ fileDrop
    const fileSelected = this.selectedFiles.filter(file => file !== fileDrop);

    // Thêm các file đã chọn (trừ fileDrop) vào danh sách
    listFile2MoveFolder.push(...fileSelected);
    this.updateFiles2Folder(listFile2MoveFolder, fileFolderId);
  }

  noReturnPredicate() {
    return false;
  }

  onDragStarted(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragStarted ~ onDragStarted:")
    const itemIdx = this.searchFile.files.findIndex((f: File) => f._id == file._id);
    this.searchFile.files.splice(itemIdx + 1, 0, { ...file, temp: true });
  }

  onDragEnded(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragEnded ~ onDragEnded:")
    _.remove(this.searchFile.files, { temp: true });
  }

  onSourceListExited(event: CdkDragExit<any>) {
    console.log("🚀 ~ FilesComponent ~ onSourceListExited ~ onSourceListExited:")
    const itemIdx = this.searchFile.files.findIndex((file: File) => file._id == event.item.data._id);
    const fileWithTemp = this.searchFile.files.find((file: File) => file.temp === true);
    if (fileWithTemp) {
      return;
    }
    this.searchFile.files.splice(itemIdx + 1, 0, { ...event.item.data, temp: true });
  }

  onSourceListEntered(event: CdkDragEnter<any>) {
    _.remove(this.searchFile.files, { temp: true });
  }

  getParentDrop(element: HTMLElement): HTMLElement | null {
    // Lặp lại lên trên cây DOM cho đến khi tìm thấy phần tử cha là <li>
    while (element && element.nodeName !== 'LI') {
      element = element.parentElement as HTMLElement;
    }

    // Kiểm tra nếu phần tử cha là <li> và trả về phần tử này
    return element && element.nodeName === 'LI' ? element : null;
  }

  onDbClickFile($event: any, file: File): void {
    $event.stopPropagation();
    if (!this.isDialog) {
      return;
    }
    this.selectedFiles = [];
    this.selectedFiles.push(file);
    this.chooseFile();
  }

  chooseFile() {
    this.chooseFileEvent.emit(this.selectedFiles);
  }
}


