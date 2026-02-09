import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { Utils } from '@rsApp/shared/utils/utils';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';
import { toast } from 'ngx-sonner';
import { Setting } from '../../model/setting.model';
import { SettingService } from '../../services/setting.service';
import { SettingCacheService } from '../../services/setting-cache.service';
import { firstValueFrom } from 'rxjs';
import { SETTING_CONSTANTS, SETTING_CONSTANTS_GROUPS } from '@rsApp/core/constants/setting.constants';

@Component({
  selector: 'app-bus-schedule-setting',
  templateUrl: './bus-schedule-setting.component.html',
  styleUrls: ['./bus-schedule-setting.component.scss'],
  standalone: false,
})
export class BusScheduleSettingComponent implements OnInit, AfterViewInit {
  mainForm!: FormGroup;

  settings: Setting[] = [];

  @ViewChildren(QuillEditorComponent) quillEditors!: QueryList<QuillEditorComponent>;

  private initialFormValue: any = null;

  isLoaded: boolean = false;

  policyModes: { [key: string]: 'editor' | 'json' } = {};

  editorModules: any = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      [
        { color: ['#000000', '#e60000', '#ff9900', '#ffff00', '#00b050', '#00b0f0', '#4a90e2', '#9900ff'] },
        { background: ['#ffffff', '#f3f3f3', '#ffff00', '#ffff99', '#00ff00', '#99ffff', '#0099ff', '#ff99ff'] },
      ],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private utilsModal: UtilsModal,
    private settingService: SettingService,
    private settingCacheService: SettingCacheService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentSettings();
  }

  ngAfterViewInit(): void {
    // Set Quill content for editor mode after editors are initialized
    setTimeout(() => {
      this.setQuillContent();
    }, 200);
  }

  initForm() {
    this.mainForm = this.fb.group({
      transit_policy: [''],
      booking_cancellation_policy: [''],
      boarding_requirements_policy: [''],
      carry_on_baggage_policy: [''],
      child_and_pregnancy_policy: [''],
      roadside_pickup_policy: [''],
      other_policy: [''],
      bus_schedule_availability_cutoff: [],
    });

    // Initialize policy modes
    [
      SETTING_CONSTANTS.TRANSIT_POLICY,
      SETTING_CONSTANTS.BOOKING_CANCELLATION_POLICY,
      SETTING_CONSTANTS.BOARDING_REQUIREMENTS_POLICY,
      SETTING_CONSTANTS.CARRY_ON_BAGGAGE_POLICY,
      SETTING_CONSTANTS.CHILD_AND_PREGNANCY_POLICY,
      SETTING_CONSTANTS.ROADSIDE_PICKUP_POLICY,
      SETTING_CONSTANTS.OTHER_POLICY,
    ].forEach((field) => {
      this.policyModes[field] = 'editor';
    });

    this.initialFormValue = this.mainForm.getRawValue();
  }

  async loadCurrentSettings() {
    this.isLoaded = false;
    this.settingService.getSettingByGroupName(SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE).subscribe({
      next: (settings: Setting[]) => {
        this.settings = settings;
        this.settingCacheService.createOrUpdates(settings).subscribe();
        this.loadDataToForm();
        this.isLoaded = true;
        // Call setQuillContent after data is loaded
        setTimeout(() => {
          this.setQuillContent();
        }, 300);
      },
      error: (err) => {
        this.isLoaded = true;
      },
    });
  }

  loadDataToForm() {
    for (const setting of this.settings) {
      const name = setting.name;
      const value = setting.value ?? '';
      switch (name) {
        case SETTING_CONSTANTS.TRANSIT_POLICY:
        case SETTING_CONSTANTS.BOOKING_CANCELLATION_POLICY:
        case SETTING_CONSTANTS.BOARDING_REQUIREMENTS_POLICY:
        case SETTING_CONSTANTS.CARRY_ON_BAGGAGE_POLICY:
        case SETTING_CONSTANTS.CHILD_AND_PREGNANCY_POLICY:
        case SETTING_CONSTANTS.ROADSIDE_PICKUP_POLICY:
        case SETTING_CONSTANTS.OTHER_POLICY:
        case SETTING_CONSTANTS.BUS_SCHEDULE_AVAILABILITY_CUTOFF:
          this.mainForm.patchValue({ [name]: value });
          if (value) {
            this.policyModes[name] = this.detectContentMode(value);
          }
          break;
        default:
          // ignore unknown settings
          break;
      }
    }

    this.initialFormValue = this.mainForm.getRawValue();
  }

  /**
   * Set Quill editor content from form value
   * Directly sets HTML content in the Quill editor
   */
  setQuillContent(): void {
    const editorFields = [
      SETTING_CONSTANTS.TRANSIT_POLICY,
      SETTING_CONSTANTS.BOOKING_CANCELLATION_POLICY,
      SETTING_CONSTANTS.BOARDING_REQUIREMENTS_POLICY,
      SETTING_CONSTANTS.CARRY_ON_BAGGAGE_POLICY,
      SETTING_CONSTANTS.CHILD_AND_PREGNANCY_POLICY,
      SETTING_CONSTANTS.ROADSIDE_PICKUP_POLICY,
      SETTING_CONSTANTS.OTHER_POLICY,
    ];

    const editors = this.quillEditors.toArray();

    editorFields.forEach((field, index) => {
      if (this.policyModes[field] === 'editor' && editors[index]) {
        const control = this.mainForm.get(field);
        const htmlContent = control?.value;

        if (htmlContent) {
          try {
            const editorComponent = editors[index];
            if (editorComponent && editorComponent.quillEditor) {
              const quill = editorComponent.quillEditor;
              // Directly set the HTML content to the editor's root element
              quill.root.innerHTML = htmlContent;
            }
          } catch (error) {
            console.warn(`Failed to set content for ${field}:`, error);
          }
        }
      }
    });
  }

  /**
   * Detect if content is HTML or JSON
   * Returns 'editor' for HTML, 'json' for plain text/JSON
   */
  detectContentMode(content: string): 'editor' | 'json' {
    if (!content) return 'editor';

    const trimmed = content.trim();
    // Check if it starts with HTML tags
    if (trimmed.startsWith('<') && trimmed.includes('>')) {
      return 'editor';
    }
    // Check if it contains HTML tags anywhere
    if (/<[^>]*>/g.test(trimmed)) {
      return 'editor';
    }
    // Everything else is JSON/plain text mode
    return 'json';
  }

  changePolicyMode(fieldName: string, newMode: 'editor' | 'json'): void {
    this.policyModes[fieldName] = newMode;
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
      toast.info('Không có gì thay đổi để lưu');
      return;
    }

    const formValue = this.mainForm.getRawValue();

    const settingsToUpdate: Setting[] = [
      {
        name: SETTING_CONSTANTS.TRANSIT_POLICY,
        value: formValue.transit_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.BOOKING_CANCELLATION_POLICY,
        value: formValue.booking_cancellation_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.BOARDING_REQUIREMENTS_POLICY,
        value: formValue.boarding_requirements_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.CARRY_ON_BAGGAGE_POLICY,
        value: formValue.carry_on_baggage_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.CHILD_AND_PREGNANCY_POLICY,
        value: formValue.child_and_pregnancy_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.ROADSIDE_PICKUP_POLICY,
        value: formValue.roadside_pickup_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.OTHER_POLICY,
        value: formValue.other_policy,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
      {
        name: SETTING_CONSTANTS.BUS_SCHEDULE_AVAILABILITY_CUTOFF,
        value: formValue.bus_schedule_availability_cutoff,
        groupName: SETTING_CONSTANTS_GROUPS.BUS_SCHEDULE,
      },
    ];

    try {
      await firstValueFrom(this.settingService.createOrUpdates(settingsToUpdate));

      // Update cache
      await firstValueFrom(this.settingCacheService.createOrUpdates(settingsToUpdate));

      // Update baseline after successful save
      this.initialFormValue = this.mainForm.getRawValue();

      toast.success('Bus Schedule settings updated successfully');
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
}
