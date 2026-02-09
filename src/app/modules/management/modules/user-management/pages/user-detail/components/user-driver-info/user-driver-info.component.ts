import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Driver } from '../../../../model/driver.model';
import { toast } from 'ngx-sonner';
import { Utils } from '@rsApp/shared/utils/utils';
import { DriversService } from '../../../../service/driver.servive';

@Component({
  selector: 'app-user-driver-info',
  templateUrl: './user-driver-info.component.html',
  styleUrl: './user-driver-info.component.scss',
  standalone: false,
})
export class UserDriverInfoComponent implements OnInit {
  @Input() userId!: string;

  driver!: Driver;

  driverForm!: FormGroup;
  initialFormValue: any;

  isLoaded = false;

  constructor(private fb: FormBuilder, private driversService: DriversService, private utils: Utils) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.isLoaded = false;
    this.driversService.findOneByUser(this.userId).subscribe((driver: Driver) => {
      if (driver) {
        this.driver = driver;
      }
      this.initForm();
      this.isLoaded = true;
    });
  }

  initForm() {
    const { licenseNumber = '', licenseExpirationDate = null, licenseType = '' } = this.driver || {};

    this.driverForm = this.fb.group({
      licenseNumber: [licenseNumber],
      licenseExpirationDate: [licenseExpirationDate],
      licenseType: [licenseType],
    });

    // Store initial value for change detection
    this.initialFormValue = JSON.parse(JSON.stringify(this.driverForm.getRawValue()));
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.driverForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  onSubmit() {
    if (!this.driverForm.valid) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    if (this.driver && this.driver._id) {
      this.ưpdateDriver();
    } else {
      this.createDriver();
    }
  }

  createDriver() {
    const driverData = this.driverForm.getRawValue();

    // Create new driver
    const driver2Create = {
      ...driverData,
      userId: this.userId,
    };

    try {
      this.driversService.createDriver(driver2Create).subscribe({
        next: (driver: Driver) => {
          this.driver = driver;
          this.driverForm.markAsPristine();
          toast.success('Tài xế đã được tạo thành công');
          this.initialFormValue = JSON.parse(JSON.stringify(this.driverForm.getRawValue()));
        },
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }

  ưpdateDriver() {
    const driverData = this.driverForm.getRawValue();

    // Update existing driver
    const driver2Update = {
      ...driverData,
      _id: this.driver._id,
      userId: this.userId,
    };

    try {
      this.driversService.updateDriver(driver2Update).subscribe({
        next: (driver: Driver) => {
          this.driver = driver;
          toast.success('Tài xế đã được cập nhật thành công');
          this.driverForm.markAsPristine();
          this.initialFormValue = JSON.parse(JSON.stringify(this.driverForm.getRawValue()));
        },
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }
}
