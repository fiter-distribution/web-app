/** Angular Imports */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Savings account preview step
 */
@Component({
  selector: 'mifosx-savings-account-preview-step',
  templateUrl: './savings-account-preview-step.component.html',
  styleUrls: ['./savings-account-preview-step.component.scss']
})
export class SavingsAccountPreviewStepComponent {
  /** Savings Account Product Template */
  @Input() savingsAccountProductTemplate: any;
  /** Savings Account Template */
  @Input() savingsAccountTemplate: any;
  /** Savings Account Terms Form */
  @Input() savingsAccountTermsForm: any;
  /** Savings Account */
  @Input() savingsAccount: any;

  /** Display columns for charges table */
  chargesDisplayedColumns: string[] = [
    'name',
    'chargeCalculationType',
    'amount',
    'chargeTimeType',
    'date',
    'repaymentsEvery'
  ];

  /** Form submission event */
  @Output() submitEvent = new EventEmitter();

  constructor(private translateService: TranslateService) {}

  getCatalogTranslation(text: string): string {
    return this.translateService.instant('labels.catalogs.' + text);
  }
}
