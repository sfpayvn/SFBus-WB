import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import _ from 'lodash';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { FileFolder, SearchFile, File, FileFolder2Create, FileFolder2Update, File2Update } from './model/file-center.model';
import { FilesService } from './service/files-center.servive';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-files-center',
  templateUrl: './files-center.component.html',
  styleUrls: ['./files-center.component.scss'],
  standalone: false
})
export class FilesComponent implements OnInit {
  @ViewChild('inputFileFolder') inputFileFolder!: ElementRef;

  fileFolders: FileFolder[] = [
    {
      _id: 'all-media',
      name: 'Tất cả ảnh',
      selected: true,
    }
  ];

  oldFileFolders: FileFolder[] = [];

  searchFile: SearchFile = new SearchFile();

  selectAll: boolean = false;

  selectedFiles: File[] = [];

  pageIdx: number = 1;
  pageSize: number = 30;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingFile: boolean = false;

  constructor(
    private fileService: FilesService,
    private dialog: MatDialog,
    private utilsModal: UtilsModal,
    private utils: Utils,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {

    this.isLoadingFile = true;

    this.fileService.getFileFolder().subscribe((res: any) => {
      if (res) {
        this.fileFolders.push(...res);
      }
    })
    this.loadFiles();
  }

  loadFiles() {
    const fileFolderId = this.getActiveFolderId();

    this.fileService.searchFile(this.pageIdx, this.pageSize, this.keyword, this.sortBy, fileFolderId).subscribe({
      next: (res: SearchFile) => {
        if (res) {
          this.searchFile = res;
          console.log("🚀 ~ FileComponent ~ this.fileService.searchFile ~ this.searchFile:", this.searchFile)
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

  checkSelectAll(): void {
    this.selectAll = !this.searchFile.files.some((file) => !file.selected);
  }

  setFavoriteFile($event: any, file: File): void {
    $event.stopPropagation();
    console.log("🚀 ~ FilesComponent ~ setFavoriteFile ~ file:", file)
    file.isFavorite = !file.isFavorite;
    console.log("🚀 ~ FilesComponent ~ setFavoriteFile ~ file:", file)
    this.updateFile(file);
  }

  deleteFile($event: any, file: File): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete File',
        content:
          `Are you sure you want to delete this file "${file.filename}? All of your data will be permanently removed. This action cannot be undone.`,
        btn: [
          {
            label: 'NO',
            type: 'cancel'
          },
          {
            label: 'YES',
            type: 'submit'
          },
        ]
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
    return this.fileFolders.find((item) => item.selected && this.utils.isValidObjectId(item._id))?._id ?? '';
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
    const keyword = $event.target.value;
  }

  addFileFolderInput() {
    toast.success('Category deleted successfully', { duration: 10000 });

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
      toast.success("Tạo thư mục thành công");
      item.isEditing = false;
    })
  }

  updateFileFolder(item: FileFolder2Update) {
    this.fileService.updateFileFolder(item).subscribe((res: any) => {
      if (!res) {
        toast.error("Cập nhập thư mục không thành công");
        return;
      }
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

  onDragBeforeStarted(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragBeforeStarted ~ file:", file)
  }


  onDragStarted(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragStarted ~ file:", file)
  }

  drop(event: CdkDragDrop<any[]>): void {
    const droppedElement = event.event.target as HTMLElement;

    const parentDrop = this.getParentDrop(droppedElement);
    if (!parentDrop) {
      return;
    }
    const fileFolderId = parentDrop.id;
    console.log("🚀 ~ FilesComponent ~ drop ~ fileFolderId:", fileFolderId)

    const listFile2MoveFolder = [];
    const fileDrop = event.item.data;
    // Thêm fileDrop vào danh sách
    listFile2MoveFolder.push(fileDrop);
    // Lọc các file đã chọn để loại bỏ fileDrop
    const fileSelected = this.selectedFiles.filter(file => file !== fileDrop);

    // Thêm các file đã chọn (trừ fileDrop) vào danh sách
    listFile2MoveFolder.push(...fileSelected);

    this.updateFiles2Folder(listFile2MoveFolder, fileFolderId);

    console.log(listFile2MoveFolder); // Kiểm tra danh sách kết quả

  }

  getParentDrop(element: HTMLElement): HTMLElement | null {
    // Lặp lại lên trên cây DOM cho đến khi tìm thấy phần tử cha là <li>
    while (element && element.nodeName !== 'LI') {
      element = element.parentElement as HTMLElement;
    }

    // Kiểm tra nếu phần tử cha là <li> và trả về phần tử này
    return element && element.nodeName === 'LI' ? element : null;
  }


}


