import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { FilesCenterDialogComponent } from '@rsApp/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from '@rsApp/modules/management/modules/files-center-management/model/file-center.model';
import { Setting } from '../../model/setting.model';
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  DEFAULT_TENANT_LOGO,
} from '@rsApp/core/constants/theme.constants';
import { SettingService } from '../../services/setting.service';
import { SettingCacheService } from '../../services/setting-cache.service';
import { firstValueFrom } from 'rxjs';
import { FilesService } from '@rsApp/modules/management/modules/files-center-management/service/files-center.servive';
import { SETTING_CONSTANTS, SETTING_CONSTANTS_GROUPS } from '@rsApp/core/constants/setting.constants';

@Component({
  selector: 'app-theme-setting',
  templateUrl: './theme-setting.component.html',
  styleUrls: ['./theme-setting.component.scss'],
  standalone: false,
})
export class ThemeSettingComponent implements OnInit {
  mainForm!: FormGroup;
  logoImageFile!: File;
  logoImage: string = '';

  settings: Setting[] = [];

  private initialFormValue: any = null;

  isLoaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private utilsModal: UtilsModal,
    private settingService: SettingService,
    private settingCacheService: SettingCacheService,
    private filesService: FilesService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentSettings();
  }

  initForm() {
    this.mainForm = this.fb.group({
      tenantName: ['', [Validators.required, Validators.minLength(2)]],
      primaryColor: [DEFAULT_PRIMARY_COLOR, [Validators.required]],
      secondaryColor: [DEFAULT_SECONDARY_COLOR, [Validators.required]],
      logoId: [],
    });

    this.initialFormValue = this.mainForm.getRawValue();
  }

  async loadCurrentSettings() {
    this.isLoaded = false;
    this.settingService.getSettingByGroupName(SETTING_CONSTANTS_GROUPS.THEME).subscribe({
      next: (settings: Setting[]) => {
        this.settings = settings;
        this.settingCacheService.createOrUpdates(settings).subscribe();
        this.loadDataToForm();
        this.isLoaded = true;
      },
      error: (err) => {},
    });
  }

  loadDataToForm() {
    for (const setting of this.settings) {
      const name = setting.name;
      const value = setting.value ?? '';
      switch (name) {
        case SETTING_CONSTANTS.TENANT_NAME:
          this.mainForm.patchValue({ tenantName: value });
          break;
        case SETTING_CONSTANTS.PRIMARY_COLOR:
          this.mainForm.patchValue({ primaryColor: value });
          break;
        case SETTING_CONSTANTS.SECONDARY_COLOR:
          this.mainForm.patchValue({ secondaryColor: value });
          break;
        case SETTING_CONSTANTS.TENANT_LOGO:
          this.logoImage = value || '';
          break;
        default:
          // ignore unknown settings
          break;
      }
    }
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    this.logoImageFile = file;

    if (file) {
      this.readAndSetImage(file);
    }
  }

  private readAndSetImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // Tạo một Blob từ ArrayBuffer
      const arrayBuffer = event.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      this.logoImage = blobUrl;
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.logoImage = '';
    this.logoImageFile = null as any;
    this.mainForm.patchValue({ logoId: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;

      this.logoImage = files[0].link;
      this.mainForm.patchValue({ logoId: files[0]._id });
    });
  }

  onPrimaryColorChange(color: string) {
    this.mainForm.patchValue({ primaryColor: color });
  }

  onSecondaryColorChange(color: string) {
    this.mainForm.patchValue({ secondaryColor: color });
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.mainForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue) || !!this.logoImageFile;
  }

  clearFormValue(controlName: string) {
    const control = this.mainForm.get(controlName);
    if (control) {
      control.setValue('');
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  resetToDefault() {
    this.utilsModal
      .openModalConfirm('Xác nhận', 'Bạn có chắc muốn đặt lại cài đặt mặc định không?', 'warning')
      .subscribe((result: any) => {
        if (result) {
          this.mainForm.patchValue({
            tenantName: '',
            primaryColor: DEFAULT_PRIMARY_COLOR,
            secondaryColor: DEFAULT_SECONDARY_COLOR,
            logoId: '',
          });
          this.logoImage = DEFAULT_TENANT_LOGO;
          this.logoImageFile = null as any;
          toast.success('Đã đặt lại cài đặt mặc định');
        }
      });
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    if (!this.hasFormChanged()) {
      toast.info('Không có thay đổi nào để lưu');
      return;
    }

    const formData = this.mainForm.getRawValue();
    let dataTransfer = new DataTransfer();

    if (this.logoImageFile) {
      dataTransfer.items.add(this.logoImageFile);
    }
    const files: FileList = dataTransfer.files;

    const saveSettings = (logoLink?: string, logoId?: string) => {
      const settingsToSave: Setting[] = [
        { name: SETTING_CONSTANTS.TENANT_NAME, value: formData.tenantName, groupName: SETTING_CONSTANTS_GROUPS.THEME },
        {
          name: SETTING_CONSTANTS.PRIMARY_COLOR,
          value: formData.primaryColor,
          groupName: SETTING_CONSTANTS_GROUPS.THEME,
        },
        {
          name: SETTING_CONSTANTS.SECONDARY_COLOR,
          value: formData.secondaryColor,
          groupName: SETTING_CONSTANTS_GROUPS.THEME,
        },
        {
          name: SETTING_CONSTANTS.TENANT_LOGO,
          value: logoLink ?? this.logoImage,
          groupName: SETTING_CONSTANTS_GROUPS.THEME,
        },
      ];

      // Send to API then update local cache
      this.settingService.createOrUpdates(settingsToSave).subscribe({
        next: (saved: Setting[]) => {
          // update local cache
          this.settingCacheService.createOrUpdates(saved).subscribe(() => {
            // apply theme
            this.applyThemeColors(formData.primaryColor, formData.secondaryColor);
            this.initialFormValue = this.mainForm.getRawValue();
            toast.success('Cài đặt đã được lưu thành công');
          });
        },
        error: (err) => {
          console.error('Failed to save settings', err);
          toast.error('Lưu cài đặt thất bại');
        },
      });
    };

    // If there is a file to upload, upload first and then save settings with returned link
    if (files && files.length > 0) {
      this.filesService.uploadFiles(files).subscribe({
        next: (res: FileDto[]) => {
          if (res && res.length > 0) {
            this.logoImage = res[0].link;
            this.mainForm.patchValue({ logoId: res[0]._id });
          }
          saveSettings(this.logoImage, this.mainForm.get('logoId')?.value);
        },
        error: (err) => {
          console.error('Upload failed', err);
          toast.error('Upload file thất bại');
        },
      });
    } else {
      saveSettings();
    }
  }

  applyThemeColors(primaryColor: string, secondaryColor: string) {
    // const root = document.documentElement;
    // root.style.setProperty('--color-primary', primaryColor);
    // root.style.setProperty('--color-secondary', secondaryColor);
  }

  previewColors() {
    // const formData = this.mainForm.getRawValue();
    // this.applyThemeColors(formData.primaryColor, formData.secondaryColor);
    // toast.info('Đang xem trước màu sắc');
  }
}
