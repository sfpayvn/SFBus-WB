import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import _ from 'lodash';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { FileFolder, SearchFile, File, FileFolder2Create, FileFolder2Update, File2Update } from './model/file-center.model';
import { FilesService } from './service/files-center.servive';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
    private renderer: Renderer2,
    private el: ElementRef
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

    const selectedItem = this.fileFolders.find((item) => item.selected);
    const fileFolderId = selectedItem?._id === 'all-media' ? '' : selectedItem?._id;

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
        this.handleRequestError(error);
        this.isLoadingFile = false;
      },
    });
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

  deleteFile(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete File',
        content:
          'Are you sure you want to delete this media? All of your data will be permanently removed. This action cannot be undone.',
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
        this.fileService.deleteFile(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchFile.files = this.searchFile.files.filter((file) => file._id !== id);
              toast.success('File deleted successfully');
            }
          },
          error: (error: any) => this.handleRequestError(error),
        });
      }
    });
  }

  addFile(): void {
    // this.fileService.createFile(null).subscribe({
    //   next: (res: File) => {
    //     if (res) {
    //       this.loadData();
    //       toast.success('File added successfully');
    //     }
    //   },
    //   error: (error: any) => this.handleRequestError(error),
    // });
  }

  updateFile(item: File2Update) {
    this.fileService.updateFile(item).subscribe((res: any) => {
      if (!res) {
        toast.error("Cập nhập thư mục không thành công");
        return;
      }
      toast.success("Cập nhập thư mục thành công");
    })
  }

  setEditFile(item: File) {
    item.oldValue = item.filename;
  }

  handleUpdateFile(item: File, $event?: any) {
    console.log("🚀 ~ FilesComponent ~ handleUpdateFile ~ item:", item)
    const trimmedName = item.filename.trim();
    if (trimmedName != '') {
      this.updateFile(item);
    } else {
      item.filename = item.oldValue;
      if ($event) {
        const inputElement = $event.target as HTMLInputElement;
        inputElement.blur();
      }
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

  selectFileFolder(item: any) {
    this.fileFolders = this.fileFolders.map(folder => ({
      ...folder,
      selected: folder._id === item._id
    }));
    this.loadFiles();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });

  }

  searchFolder($event: any) {
    const keyword = $event.target.value;
  }

  uploadFile() {

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

  onDragBeforeStarted(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragBeforeStarted ~ file:", file)
  }


  onDragStarted(file: File) {
    console.log("🚀 ~ FilesComponent ~ onDragStarted ~ file:", file)
  }

  drop(event: CdkDragDrop<File[]>): void {
  }
}
