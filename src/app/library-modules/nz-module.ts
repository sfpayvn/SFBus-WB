import { NgModule } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule, NzInputOtpComponent } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EyeInvisibleOutline } from '@ant-design/icons-angular/icons';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@NgModule({
  imports: [NzInputOtpComponent, NzIconModule.forRoot([EyeInvisibleOutline])],
  exports: [
    NzSelectModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzTreeViewModule,
    NzPipesModule,
    NzAutocompleteModule,
    NzDropDownModule,
    NzTabsModule,
    NzButtonModule,
    NzToolTipModule,
    NzInputModule,
    NzFormModule,
    NzPopoverModule,
    NzRadioModule,
    NzModalModule,
    NzIconModule,
    NzSkeletonModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzSpinModule,
    NzAvatarModule,
    NzTableModule,
    NzInputOtpComponent,
    NzProgressModule,
  ],
})
export class NZModule {}
