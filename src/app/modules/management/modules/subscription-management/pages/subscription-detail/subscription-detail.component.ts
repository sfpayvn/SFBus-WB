import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import { SubscriptionService } from '../../service/subscription.service';
import { LoadingService } from '@rsApp/shared/services/loading.service';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrl: './subscription-detail.component.scss',
  standalone: false,
})
export class SubscriptionDetailComponent {
  subscriptionForm!: FormGroup;
}
