import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  ref: ComponentRef<any> | undefined;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  createComponent(component: any, emlement: any, params: any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.ref && this.ref.destroy();
    this.ref = emlement.createComponent(factory, 0);
    if (params && this.ref) {
      this.ref.instance.params = params;
    }
  }

  clearComponent() {
    this.ref && this.ref.destroy();
  }

  createRange(number: any) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  // Mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleRequestError(error: any): void {
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

  isValidObjectId(id: string): boolean {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  }
}
