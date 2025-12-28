import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { Setting, Setting2Create, Setting2Update } from '../../model/setting.model';
import { SettingService } from '../../services/setting.service';
import { SettingCacheService } from '../../services/setting-cache.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-organization-setting',
  templateUrl: './organization-setting.component.html',
  styleUrls: ['./organization-setting.component.scss'],
  standalone: false,
})
export class OrganizationSettingComponent implements OnInit {
  mainForm!: FormGroup;

  settings: Setting[] = [];

  private initialFormValue: any = null;

  isLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private utilsModal: UtilsModal,
    private settingService: SettingService,
    private settingCacheService: SettingCacheService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentSettings();
  }

  initForm() {
    this.mainForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.minLength(2)]],
      organizationCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\(\)\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
    });

    this.initialFormValue = this.mainForm.getRawValue();
  }

  async loadCurrentSettings() {
    this.isLoaded = false;
    const savedSettings = await firstValueFrom(this.settingCacheService.getSettingByGroupName('organization'));
    if (!savedSettings || savedSettings.length === 0) {
      // Load current organization settings from API
      this.settingService.getSettingByGroupName('organization').subscribe({
        next: (settings: Setting[]) => {
          this.settings = settings;
          this.settingCacheService.createOrUpdates(settings).subscribe();
          this.loadDataToForm();
          this.isLoaded = true;
        },
        error: (err) => {
          this.isLoaded = true;
        },
      });
    } else {
      this.settings = savedSettings;
      this.loadDataToForm();
      this.isLoaded = true;
    }
  }

  loadDataToForm() {
    for (const setting of this.settings) {
      const name = setting.name;
      const value = setting.value ?? '';
      switch (name) {
        case 'organizationName':
          this.mainForm.patchValue({ organizationName: value });
          break;
        case 'organizationCode':
          this.mainForm.patchValue({ organizationCode: value });
          break;
        case 'address':
          this.mainForm.patchValue({ address: value });
          break;
        case 'phone':
          this.mainForm.patchValue({ phone: value });
          break;
        case 'email':
          this.mainForm.patchValue({ email: value });
          break;
        case 'website':
          this.mainForm.patchValue({ website: value });
          break;
        default:
          // ignore unknown settings
          break;
      }
    }

    this.initialFormValue = this.mainForm.getRawValue();
  }

  hasFormChanged(): boolean {
    if (!this.initialFormValue) {
      return false;
    }

    const currentFormValue = this.mainForm.getRawValue();

    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
  }

  async onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      toast.error('Vui lòng điền đầy đủ thông tin theo yêu cầu');
      return;
    }

    if (!this.hasFormChanged()) {
      return;
    }

    const formValue = this.mainForm.getRawValue();

    const settingsToUpdate: Setting2Update[] = [
      {
        name: 'organizationName',
        value: formValue.organizationName,
        groupName: 'organization',
      },
      {
        name: 'organizationCode',
        value: formValue.organizationCode,
        groupName: 'organization',
      },
      {
        name: 'address',
        value: formValue.address,
        groupName: 'organization',
      },
      {
        name: 'phone',
        value: formValue.phone,
        groupName: 'organization',
      },
      {
        name: 'email',
        value: formValue.email,
        groupName: 'organization',
      },
      {
        name: 'website',
        value: formValue.website,
        groupName: 'organization',
      },
    ];

    try {
      await firstValueFrom(this.settingService.createOrUpdates(settingsToUpdate));

      // Update cache
      await firstValueFrom(this.settingCacheService.createOrUpdates(settingsToUpdate));

      // Update baseline after successful save
      this.initialFormValue = this.mainForm.getRawValue();

      toast.success('Organization settings updated successfully');
    } catch (error: any) {
      this.utils.handleRequestError(error);
      throw error;
    }
  }

  resetToDefault() {
    this.utilsModal
      .openModalConfirm('Reset to Default', 'Are you sure you want to reset all settings to default?', 'warning')
      .subscribe((result) => {
        if (result) {
          this.mainForm.reset();
          this.initialFormValue = this.mainForm.getRawValue();
          toast.success('Settings reset to default');
        }
      });
  }

  clearFormValue(fieldName: string) {
    this.mainForm.get(fieldName)?.setValue(null);
  }
}
