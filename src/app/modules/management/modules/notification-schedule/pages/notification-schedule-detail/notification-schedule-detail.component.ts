import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationScheduleService } from '../../services/notification-schedule.service';
import {
  NotificationSchedule,
  NotificationScheduleFrequency,
  NotificationScheduleStatus,
  NotificationRecipient,
} from '../../models/notification-schedule.model';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-notification-schedule-detail',
  templateUrl: './notification-schedule-detail.component.html',
  styleUrls: ['./notification-schedule-detail.component.scss'],
  standalone: false,
})
export class NotificationScheduleDetailComponent implements OnInit {
  @Input() isDialog = false;
  form!: FormGroup;
  isSubmitting = false;
  schedule: NotificationSchedule | null = null;
  isEditMode = false;

  frequencyOptions = [
    { label: 'Once', value: NotificationScheduleFrequency.ONCE },
    { label: 'Daily', value: NotificationScheduleFrequency.DAILY },
    { label: 'Weekly', value: NotificationScheduleFrequency.WEEKLY },
    { label: 'Monthly', value: NotificationScheduleFrequency.MONTHLY },
  ];

  statusOptions = [
    { label: 'Draft', value: NotificationScheduleStatus.DRAFT },
    { label: 'Scheduled', value: NotificationScheduleStatus.SCHEDULED },
    { label: 'Cancelled', value: NotificationScheduleStatus.CANCELLED },
  ];

  recipientList: NotificationRecipient[] = [];
  newRecipientUserId = '';

  constructor(
    private fb: FormBuilder,
    private notificationScheduleService: NotificationScheduleService,
    private utils: Utils,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Get schedule ID from route parameters
    const scheduleId = this.activatedRoute.snapshot.paramMap.get('id');

    // Get data from router state (if available)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state || {};

    // if (scheduleId && scheduleId !== 'new' && state.schedule) {
    //   this.schedule = state.schedule;
    //   this.isEditMode = true;
    //   this.populateForm(this.schedule);
    //   this.recipientList = [...this.schedule.recipients];
    // } else if (state.defaultDate) {
    //   this.form.patchValue({
    //     scheduledDate: state.defaultDate,
    //     scheduledTime: '09:00',
    //   });
    // }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      scheduledDate: [new Date(), Validators.required],
      scheduledTime: ['09:00', Validators.required],
      frequency: [NotificationScheduleFrequency.ONCE, Validators.required],
      endDate: [''],
      status: [NotificationScheduleStatus.DRAFT, Validators.required],
      isActive: [true],
      notes: [''],
    });
  }

  private populateForm(schedule: NotificationSchedule): void {
    this.form.patchValue({
      title: schedule.title,
      description: schedule.description,
      content: schedule.content,
      scheduledDate: new Date(schedule.scheduledDate),
      scheduledTime: schedule.scheduledTime,
      frequency: schedule.frequency,
      endDate: schedule.endDate ? new Date(schedule.endDate) : '',
      status: schedule.status,
      isActive: schedule.isActive,
      notes: schedule.notes || '',
    });
  }

  addRecipient(): void {
    if (this.newRecipientUserId.trim()) {
      const newRecipient: NotificationRecipient = {
        userId: this.newRecipientUserId.trim(),
      };
      this.recipientList.push(newRecipient);
      this.newRecipientUserId = '';
    }
  }

  removeRecipient(index: number): void {
    this.recipientList.splice(index, 1);
  }

  submit(): void {
    if (!this.form.valid || this.recipientList.length === 0) {
      if (this.recipientList.length === 0) {
        alert('Please add at least one recipient');
      }
      return;
    }

    this.isSubmitting = true;
    const formValue = this.form.value;

    const payload = {
      ...formValue,
      recipients: this.recipientList,
      scheduledDate: new Date(formValue.scheduledDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
    };

    if (this.isEditMode && this.schedule?._id) {
      this.notificationScheduleService.updateNotificationSchedule(this.schedule._id, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error updating schedule:', err);
          this.isSubmitting = false;
          alert('Error updating schedule. Please try again.');
        },
      });
    } else {
      this.notificationScheduleService.createNotificationSchedule(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error creating schedule:', err);
          this.isSubmitting = false;
          alert('Error creating schedule. Please try again.');
        },
      });
    }
  }

  cancel(): void {
    this.location.back();
  }

  getFrequencyLabel(frequency: string): string {
    return this.frequencyOptions.find((f) => f.value === frequency)?.label || frequency;
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find((s) => s.value === status)?.label || status;
  }

  trackByRecipient(index: number, item: NotificationRecipient): string {
    return item.userId;
  }

  backPage(): void {
    this.location.back();
  }
}
