import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from '../components/material-dialog/material-dialog.component';
import { ViewImageDialogComponent } from '@rsApp/modules/management/modules/files-center-management/components/view-image-dialog/view-image-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsModal {
  ref: ComponentRef<any> | undefined;

  constructor(private dialog: MatDialog) {}

  openModalConfirm(title: string, content: string, type?: string, btns?: any) {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: type || 'success',
        },
        title: title,
        content: content,
        btn: btns || [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
      },
    });
    return dialogRef.afterClosed();
  }

  openModalAlert(title: string, content: string, type?: string, btnLabel?: string) {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: type || 'info',
        },
        title: title,
        content: content,
        btn: [
          {
            label: btnLabel || 'OK',
            type: 'submit',
          },
        ],
      },
    });
    return dialogRef.afterClosed();
  }

  openModal(component: any, data: any, size: string = 'small') {
    let height = '';
    let width = '';
    if (size == 'small') {
      height = width = '40%';
    } else if (size == 'medium') {
      height = width = '60%';
    } else if (size == 'large') {
      height = width = '80%';
    } else if (size == 'full') {
      height = width = '100%';
    }

    const dialogRef = this.dialog.open(component, {
      height: height,
      width: width,
      maxWidth: width,
      panelClass: 'custom-dialog',
      data: data,
    });
    return dialogRef.afterClosed();
  }

  openContextModal(component: any, dataInput: any, event: any, id: string) {
    const parentElement = (event.currentTarget as HTMLElement).closest(id);
    if (!parentElement) return;

    const rect = parentElement.getBoundingClientRect();

    // Tính toán vị trí context modal
    const position = {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
    };

    const dialogRef = this.dialog.open(component, {
      data: dataInput,
      position: position,
      panelClass: 'custom-context-modal',
      backdropClass: 'custom-context-backdrop',
      hasBackdrop: true,
      disableClose: false,
      width: `${rect.width}px`,
      height: 'auto',
      autoFocus: false,
    });

    return dialogRef.afterClosed();
  }

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(ViewImageDialogComponent, {
      height: 'max-content',
      width: 'max-content',
      maxWidth: 'max-content',
      panelClass: 'custom-dialog-view-image',
      backdropClass: 'custom-back-drop-view-image',
      data: {
        image: image,
      },
    });
  }
}
