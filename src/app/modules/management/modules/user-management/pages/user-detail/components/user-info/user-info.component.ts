import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { User2Create, User2Update, UserAddress } from '../../../../model/user.model';
import { User } from '../../../../model/user.model';
import { UserAddressDetailDialogComponent } from '../../../../component/user-address-detail-dialog/user-address-detail-dialog.component';
import { FilesCenterDialogComponent } from 'src/app/modules/management/modules/files-center-management/components/files-center-dialog/files-center-dialog.component';
import { FileDto } from 'src/app/modules/management/modules/files-center-management/model/file-center.model';
import { combineLatest, tap } from 'rxjs';
import { Router } from '@angular/router';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { UserManagementService } from '../../../../service/user.servive';
import { ROLE_CONSTANTS } from '@rsApp/core/constants/roles.constants';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  standalone: false,
})
export class UserInfoComponent implements OnInit {
  @Input() mainForm!: FormGroup;
  @Input() user!: User;
  @Input() addresses: UserAddress[] = [];
  @Input() userRole: string = ROLE_CONSTANTS.CLIENT;

  userAvartaFile!: File;
  userAvarta!: string;

  defaultAvatar = 'assets/icons/user.svg';

  @Output() rolesChange = new EventEmitter<string[]>();
  @Output() createUserEvent = new EventEmitter<User>();

  genders = [
    { label: 'Male', value: 'male' },
    { label: 'FeMale', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  initialFormValue: any;

  constructor(
    public utils: Utils,
    private utilsModal: UtilsModal,
    private fb: FormBuilder,
    private userManagementService: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.initForm();
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
      gender = 'other',
      birthdate = twelveYearsAgo,
      addresses = [],
    } = this.user || {};
    this.userAvarta = avatar ? avatar : this.defaultAvatar;
    this.mainForm = this.fb.group({
      userForm: this.fb.group({
        avatarId: [avatarId],
        name: [name, [Validators.required]],
        email: [email, [Validators.required]],
        phoneNumber: [phoneNumber, [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
        gender: [gender],
        birthdate: [birthdate],
      }),
    });

    this.addresses = addresses;

    // Subscribe to roles changes
    this.userForm.get('roles')?.valueChanges.subscribe((roles: string[]) => {
      this.rolesChange.emit(roles);
    });

    if (!this.user) {
      this.userForm.get('password')?.addValidators(Validators.required);
    }

    // Store initial value
    this.initialFormValue = JSON.parse(JSON.stringify(this.mainForm.getRawValue()));
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.userForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  get userForm(): FormGroup {
    return this.mainForm.get('userForm') as FormGroup;
  }

  checkDisableDateTime = (current: Date): boolean => {
    const today = new Date();
    const minYear = today.getFullYear() - 12;
    return current.getFullYear() > minYear;
  };

  openFilesCenterDialog() {
    this.utilsModal.openModal(FilesCenterDialogComponent, null, 'large').subscribe((files: FileDto[]) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      this.userAvarta = file.link;
      const userForm = this.mainForm.get('userForm') as FormGroup;
      userForm.patchValue({ avatarId: file._id });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userAvartaFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userAvarta = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addAddress() {
    const data = { title: 'Create Address' };
    this.utilsModal.openModal(UserAddressDetailDialogComponent, data, 'small').subscribe((result: any) => {
      if (result) {
        const updatedAddresses = [...this.addresses, result];
        this.addresses = updatedAddresses;
      }
    });
  }

  editAddress(address: UserAddress) {
    const data = { title: 'Edit Address', address: address };
    this.utilsModal.openModal(UserAddressDetailDialogComponent, data, 'small').subscribe((result: any) => {
      if (result) {
        const updatedAddresses = this.addresses.map((item) => (item === address ? { ...item, ...result } : item));
        this.addresses = updatedAddresses;
      }
    });
  }

  deleteAddress(addressId: string) {
    this.utilsModal
      .openModalConfirm('Delete Address', 'Are you sure you want to delete this address?', 'dangerous')
      .subscribe((result) => {
        if (result) {
          const updatedAddresses = this.addresses.filter((item) => item._id !== addressId);
          this.addresses = updatedAddresses;
        }
      });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      this.utils.markFormGroupTouched(this.userForm);
      return;
    }

    if (!this.hasFormChanged()) {
      return;
    }

    const { userForm } = this.mainForm.getRawValue();

    const user2Create: User2Create = {
      ...userForm,
      addresses: this.addresses,
      password: 'SFBus@123',
      isTempPassWord: true,
    };

    let dataTransfer = new DataTransfer();
    if (this.userAvartaFile) {
      dataTransfer.items.add(this.userAvartaFile);
    }
    const files: FileList = dataTransfer.files;

    if (this.user) {
      // Update flow
      const user2Update = {
        ...user2Create,
        _id: this.user._id,
        isEmailVerified: this.user.isEmailVerified,

        isLocked: this.user.isLocked,
        isDeleted: this.user.isDeleted,
      };
      this.updateUser(files, user2Update);
    } else {
      // Create flow
      this.createUser(files, user2Create);
    }
  }

  updateUser(files: FileList, user2Update: User2Update) {
    try {
      this.userManagementService.processUpdateUser(this.userRole, files, user2Update).subscribe({
        next: (updatedUser: User) => {
          toast.success('Cập nhật thông tin người dùng thành công');
          this.user = updatedUser;
          const updatedState = { ...history.state, user: JSON.stringify(updatedUser) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.initialFormValue = JSON.parse(this.userForm.getRawValue());
          this.userForm.markAsPristine();
        },
        error: (error: any) => this.utils.handleRequestError(error),
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }

  createUser(files: FileList, user2Create: User2Create) {
    try {
      this.userManagementService.processCreateUser(this.userRole, files, user2Create).subscribe({
        next: (createdUser: User) => {
          toast.success('Tạo mới thông tin người dùng thành công');
          this.user = createdUser;
          const updatedState = { ...history.state, user: JSON.stringify(createdUser) };
          window.history.replaceState(updatedState, '', window.location.href);
          this.createUserEvent.emit(createdUser);
        },
        error: (error: any) => this.utils.handleRequestError(error?.error),
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
