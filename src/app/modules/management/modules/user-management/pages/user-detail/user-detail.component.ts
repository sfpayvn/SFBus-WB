import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { toast } from 'ngx-sonner';
import { User, User2Create, User2Update, UserAddress } from '../../model/user.model';
import { UsersService } from '../../service/user.servive';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { UserAddressDetailDialogComponent } from '../../component/user-address-detail-dialog/user-address-detail-dialog.component';
import _ from 'lodash';
import { Driver, Driver2Create, Driver2Update, UserDriver } from '../../model/driver.model';
import { DriversService } from '../../service/driver.servive';
import { combineLatest, tap } from 'rxjs';
import { FilesCenterDialogComponent } from 'src/app/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from 'src/app/modules/management/modules/files-center-management/model/file-center.model';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  standalone: false,
})
export class UserDetailComponent implements OnInit {
  mainForm!: FormGroup;

  user!: User;

  driver!: Driver;

  roles = [
    {
      label: 'User',
      value: 'user',
    },
    {
      label: 'Driver',
      value: 'driver',
    },
  ];

  genders = [
    {
      label: 'Male',
      value: 'male',
    },
    {
      label: 'FeMale',
      value: 'female',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ];

  passwordConditions: { [key: string]: boolean } = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  };

  passwordVisible: boolean = false;

  addresses!: UserAddress[];

  userAvartaFile!: File;
  userAvarta!: string;

  defaultAvatar = 'assets/icons/user.svg';

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private usersService: UsersService,
    private driversService: DriversService,
    private utilsModal: UtilsModal,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
    this.initForm();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['user']) {
      this.user = params['user'] ? JSON.parse(params['user']) : null;
    }
  }

  async initForm() {
    const today = new Date();
    const twelveYearsAgo = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

    const {
      avatar = '',
      avatarId = '',
      name = '',
      email = '',
      phoneNumber = '',
      gender = '',
      role = '',
      birthdate = twelveYearsAgo,
      addresses = [],
    } = this.user || {};
    this.userAvarta = avatar ? avatar : this.defaultAvatar;
    this.mainForm = this.fb.group({
      userForm: this.fb.group({
        avatarId: [avatarId],
        name: [name, [Validators.required]],
        email: [email, [Validators.required]],
        phoneNumber: [phoneNumber, [Validators.required, Validators.pattern(/(?:\+84|0084|0)(3|5|7|8|9)[0-9]{8}/)]],
        password: [
          '',
          [
            this.optionalValidator(
              Validators.compose([Validators.minLength(8), this.passwordValidator.bind(this)]) || (() => null),
            ),
          ],
        ],
        gender: [gender],
        role: [role, [Validators.required]],
        birthdate: [birthdate],
      }),
      driverForm: this.fb.group({
        licenseNumber: [],
        licenseExpirationDate: [],
        licenseType: [],
      }),
    });

    this.addresses = addresses;

    if (role == 'driver') {
      this.setDataWithDriver();
    }
  }

  setDataWithDriver() {
    this.driversService.findOneByUser(this.user._id).subscribe((driver: Driver) => {
      if (!driver) {
        return;
      }
      this.driver = driver;
      this.driverForm.controls['licenseNumber'].patchValue(this.driver.licenseNumber);
      this.driverForm.controls['licenseExpirationDate'].patchValue(this.driver.licenseExpirationDate);
      this.driverForm.controls['licenseType'].patchValue(this.driver.licenseType);
    });
  }

  get driverForm(): FormGroup {
    return this.mainForm.get('driverForm') as FormGroup;
  }
  get userForm(): FormGroup {
    return this.mainForm.get('userForm') as FormGroup;
  }

  optionalValidator(validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return null; // Không validate nếu không có giá trị
      }
      return validator(control); // Thực hiện validate khi có giá trị
    };
  }

  passwordValidator(control: any) {
    const value = control.value;
    this.passwordConditions['minLength'] = value.length >= 8;
    this.passwordConditions['hasUpperCase'] = /[A-Z]/.test(value);
    this.passwordConditions['hasLowerCase'] = /[a-z]/.test(value);
    this.passwordConditions['hasNumber'] = /\d/.test(value);

    if (
      this.passwordConditions['minLength'] &&
      this.passwordConditions['hasUpperCase'] &&
      this.passwordConditions['hasLowerCase'] &&
      this.passwordConditions['hasNumber']
    ) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  backPage() {
    this.location.back();
  }

  checkDisableDateTime = (current: Date): boolean => {
    // Lấy ngày hiện tại
    const today = new Date();
    // Lấy năm hiện tại trừ đi 12 để xác định ngưỡng năm
    const minYear = today.getFullYear() - 12;
    // Kiểm tra nếu ngày chọn lớn hơn năm tối thiểu
    return current.getFullYear() > minYear;
  };

  async addAddress() {
    const data = {
      title: 'Create Address',
    };
    this.utilsModal.openModal(UserAddressDetailDialogComponent, data, 'small').subscribe((result: any) => {
      this.addresses = [...this.addresses, result];
    });
  }

  async editAddress(address: any) {
    const data = {
      title: 'Edit Address',
      address: address,
    };

    this.utilsModal.openModal(UserAddressDetailDialogComponent, data, 'small').subscribe((result: any) => {
      if (result) {
        // Update the specific address in the array
        this.addresses = this.addresses.map((item) => (item === address ? { ...item, ...result } : item));
      }
    });
  }

  async deleteAddress(address: any) {
    this.utilsModal
      .openModalConfirm('Delete Address', 'Are you sure you want to delete this address?', 'dangerous')
      .subscribe((result) => {
        if (result) {
          // Correctly update the addresses array by removing the specified address
          this.addresses = _.remove(this.addresses, (item) => item === address);
        }
      });
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    this.userAvartaFile = file;

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
      this.userAvarta = URL.createObjectURL(blob);
    };
    reader.readAsArrayBuffer(file); // Đọc file dưới dạng ArrayBuffer
  }

  removeFileImage() {
    this.userAvarta = '';
    const userForm = this.mainForm.get('userForm') as FormGroup;
    userForm.patchValue({ avatarId: '' });
  }

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      this.userAvarta = file.link;
      const userForm = this.mainForm.get('userForm') as FormGroup;
      userForm.patchValue({ avatarId: file._id });
    });
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      this.utils.markFormGroupTouched(this.mainForm);
      return;
    }

    const { userForm } = this.mainForm.getRawValue();

    const user2Create: User2Create = {
      ...userForm,
      addresses: this.addresses,
      isTempPassWord: true,
    };

    let dataTransfer = new DataTransfer();
    if (this.userAvartaFile) {
      dataTransfer.items.add(this.userAvartaFile);
    }
    const files: FileList = dataTransfer.files;

    let request = [];
    let actionName = 'create';

    if (this.user) {
      const user2Update = {
        ...user2Create,
        _id: this.user._id, // Thêm thuộc tính _id
        isEmailVerified: this.user.isEmailVerified,
        isLoacked: this.user.isLoacked,
        isDelete: this.user.isDelete,
      };
      actionName = 'update';
      request.push(this.updateUser(files, user2Update));
    } else {
      request.push(this.createUser(files, user2Create));
    }

    if (user2Create.role == 'driver') {
      request.push(this.processSubmitDriver());
    }

    combineLatest(request).subscribe({
      next: (res: any) => {
        if (!res) {
          return;
        }
        if (actionName == 'update') {
          const updatedState = { ...history.state, user: JSON.stringify(res[0]) };
          window.history.replaceState(updatedState, '', window.location.href);
          toast.success('User update successfully');
          return;
        }
        toast.success('User added successfully');
      },
      error: (error: any) => this.utils.handleRequestError(error), // Xử lý lỗi
    });
  }

  processSubmitDriver() {
    const { driverForm } = this.mainForm.getRawValue();

    const driver2Create: Driver2Create = {
      ...driverForm,
      userId: this.user._id,
    };
    if (this.driver) {
      const driver2Update = {
        ...driver2Create,
        _id: this.driver._id,
      };
      return this.updateDriver(driver2Update);
    }
    return this.createDriver(driver2Create);
  }

  updateUser(files: FileList, user2Update: User2Update) {
    return this.usersService.processUpdateUser(files, user2Update);
  }

  createUser(files: FileList, user2Create: User2Create) {
    return this.usersService.processCreateUser(files, user2Create);
  }

  updateDriver(driver2Update: Driver2Update) {
    return this.driversService.updateDriver(driver2Update).pipe(
      tap((res: any) => {
        this.driver = res;
      }),
    );
  }

  createDriver(driver2Create: Driver2Create) {
    return this.driversService.createDriver(driver2Create).pipe(
      tap((res: any) => {
        this.driver = res;
      }),
    );
  }
}
