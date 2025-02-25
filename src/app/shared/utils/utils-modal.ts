import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MaterialDialogComponent } from '../components/material-dialog/material-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsModal {
  ref: ComponentRef<any> | undefined;

  constructor(private dialog: MatDialog) { }

  openModalConfirm(title: string, content: string, type?: string, btns?: any) {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: type || 'success'
        },
        title: title,
        content: content,
        btn: btns || [
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
    return dialogRef.afterClosed();
  }

  openModal(component: any, data: any, size: string = 'small') {

    let height = '';
    let width = ''
    if (size == 'medium') {
      height = width = '60%'
    } else if (size == 'large') {
      height = width = '80%'
    }
    else if (size == 'full') {
      height = width = '100%'
    }

    const dialogRef = this.dialog.open(component, {
      height: height,
      width: width,
      maxWidth: width,
      panelClass: 'custom-dialog',
      data: data
    });
    return dialogRef.afterClosed();
  }
}
