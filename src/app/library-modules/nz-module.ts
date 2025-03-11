import { NgModule } from "@angular/core";
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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';
@NgModule({
    imports: [NzIconModule],
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
    ]
})
export class NZModule { }
