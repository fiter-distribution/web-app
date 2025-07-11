/** Angular Imports */
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

/** Custom Components */
import { DepositProductIncentiveFormDialogComponent } from 'app/products/deposit-product-incentive-form-dialog/deposit-product-incentive-form-dialog.component';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';

/** Dialog Components */
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { InputBase } from 'app/shared/form-dialog/formfield/model/input-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';

/** Custom Services */
import { TranslateService } from '@ngx-translate/core';
import { Dates } from 'app/core/utils/dates';
import { SettingsService } from 'app/settings/settings.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FindPipe } from '../../../../pipes/find.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-fixed-deposit-product-interest-rate-chart-step',
  templateUrl: './fixed-deposit-product-interest-rate-chart-step.component.html',
  styleUrls: ['./fixed-deposit-product-interest-rate-chart-step.component.scss'],
  animations: [
    trigger('expandChartSlab', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))])

  ],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    FaIconComponent,
    MatDivider,
    MatIconButton,
    MatCheckbox,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    NgSwitch,
    NgSwitchCase,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatStepperPrevious,
    MatStepperNext,
    FindPipe
  ]
})
export class FixedDepositProductInterestRateChartStepComponent implements OnInit {
  @Input() fixedDepositProductsTemplate: any;

  fixedDepositProductInterestRateChartForm: UntypedFormGroup;

  periodTypeData: any;
  entityTypeData: any;
  attributeNameData: any;
  conditionTypeData: any;
  genderData: any;
  clientTypeData: any;
  clientClassificationData: any;
  incentiveTypeData: any;

  chartSlabsDisplayedColumns: any[] = [];
  chartSlabsIncentivesDisplayedColumns: string[] = ['incentives'];
  incentivesDisplayedColumns: string[] = [
    'entityType',
    'attributeName',
    'conditionType',
    'attributeValue',
    'incentiveType',
    'amount',
    'actions'
  ];

  minDate = new Date(2000, 0, 1);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10));

  expandChartSlabIndex: number[] = [];
  chartDetailData: any = [];
  chartsDetail: any[] = [];

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {MatDialog} dialog Dialog reference.
   * @param {Dates} dateUtils Date Utils.
   * @param {SettingsService} settingsService Settings Service.
   */

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    private dateUtils: Dates,
    private settingsService: SettingsService,
    private translateService: TranslateService
  ) {
    this.createFixedDepositProductInterestRateChartForm();
  }

  ngOnInit() {
    this.periodTypeData = this.fixedDepositProductsTemplate.chartTemplate.periodTypes;
    this.entityTypeData = this.fixedDepositProductsTemplate.chartTemplate.entityTypeOptions;
    this.attributeNameData = this.fixedDepositProductsTemplate.chartTemplate.attributeNameOptions;
    this.conditionTypeData = this.fixedDepositProductsTemplate.chartTemplate.conditionTypeOptions;
    this.genderData = this.fixedDepositProductsTemplate.chartTemplate.genderOptions;
    this.clientTypeData = this.fixedDepositProductsTemplate.chartTemplate.clientTypeOptions;
    this.clientClassificationData = this.fixedDepositProductsTemplate.chartTemplate.clientClassificationOptions;
    this.incentiveTypeData = this.fixedDepositProductsTemplate.chartTemplate.incentiveTypeOptions;

    if (this.fixedDepositProductsTemplate) {
      this.assignFormData();
    }
  }

  assignFormData() {
    this.addChart();
    const isChartArray = Array.isArray(this.fixedDepositProductsTemplate.activeChart);
    if (this.fixedDepositProductsTemplate.activeChart) {
      if (!isChartArray) {
        this.chartDetailData.push(this.fixedDepositProductsTemplate.activeChart);
      } else {
        this.chartDetailData = this.fixedDepositProductsTemplate.activeChart;
      }
    }

    // Build the array of Objects from the retrived value
    this.getChartsDetailsData();

    // Iterates for every chart in charts
    this.charts.controls.forEach((chartDetailControl: UntypedFormGroup, i: number) => {
      if (!this.chartsDetail[i]) {
        return;
      }

      // Iterate for every chartSlab in chart
      this.chartsDetail[i].chartSlabs.forEach((chartSlabDetail: any, j: number) => {
        const chartSlabInfo = this.formBuilder.group({
          id: [chartSlabDetail.id],
          amountRangeFrom: [chartSlabDetail.amountRangeFrom || ''],
          amountRangeTo: [chartSlabDetail.amountRangeTo || ''],
          annualInterestRate: [
            chartSlabDetail.annualInterestRate,
            Validators.required
          ],
          description: [
            chartSlabDetail.description,
            Validators.required
          ],
          fromPeriod: [
            chartSlabDetail.fromPeriod,
            Validators.required
          ],
          toPeriod: [chartSlabDetail.toPeriod || ''],
          periodType: [
            chartSlabDetail.periodType,
            Validators.required
          ],
          incentives: this.formBuilder.array([])
        });
        const formArray = chartDetailControl.controls['chartSlabs'] as UntypedFormArray;
        formArray.push(chartSlabInfo);

        // Iterate for every slab in chartSlab
        const chartIncentiveControl = (chartDetailControl.controls['chartSlabs'] as UntypedFormArray).controls[j];

        // Iterate to input all the incentive for particular chart slab
        this.chartsDetail[i].chartSlabs[j].incentives.forEach((chartIncentiveDetail: any) => {
          const incentiveInfo = this.formBuilder.group({
            amount: [
              chartIncentiveDetail.amount,
              Validators.required
            ],
            attributeName: [
              chartIncentiveDetail.attributeName,
              Validators.required
            ],
            attributeValue: [
              chartIncentiveDetail.attributeValue,
              Validators.required
            ],
            conditionType: [
              chartIncentiveDetail.conditionType,
              Validators.required
            ],
            entityType: [
              chartIncentiveDetail.entityType,
              Validators.required
            ],
            incentiveType: [
              chartIncentiveDetail.incentiveType,
              Validators.required
            ]
          });
          const newFormArray = (chartIncentiveControl as UntypedFormGroup).controls['incentives'] as UntypedFormArray;
          newFormArray.push(incentiveInfo);
        });
      });
    });
  }

  getChartsDetailsData() {
    this.chartDetailData.forEach((chartData: ChartData) => {
      const chart: Chart = {
        endDate: chartData.endDate ? new Date(chartData.endDate) : '',
        fromDate: chartData.fromDate ? new Date(chartData.fromDate) : '',
        isPrimaryGroupingByAmount: chartData.isPrimaryGroupingByAmount,
        name: chartData.name,
        description: chartData.description,
        chartSlabs: this.getChartSlabsData(chartData)
      };
      if (chartData.id) {
        chart.id = chartData.id;
      }
      this.chartsDetail.push(chart);
    });
    this.fixedDepositProductInterestRateChartForm.patchValue({
      charts: this.chartsDetail
    });
  }

  getChartSlabsData(chartData: any) {
    const chartSlabs: any[] = [];
    let chartSlabData: any[] = [];
    const isChartSlabArray = Array.isArray(chartData.chartSlabs);
    if (!isChartSlabArray) {
      chartSlabData.push(chartData.chartSlabs);
    } else {
      chartSlabData = chartData.chartSlabs;
    }

    chartSlabData.forEach((eachChartSlabData: any) => {
      const chartSlab: {
        id?: any;
        periodType: any;
        amountRangeFrom: any;
        amountRangeTo: any;
        annualInterestRate: any;
        description: any;
        fromPeriod: any;
        toPeriod: any;
        incentives: any[];
      } = {
        periodType: eachChartSlabData.periodType.id,
        amountRangeFrom: eachChartSlabData.amountRangeFrom,
        amountRangeTo: eachChartSlabData.amountRangeTo,
        annualInterestRate: eachChartSlabData.annualInterestRate,
        description: eachChartSlabData.description ? eachChartSlabData.description : '',
        fromPeriod: eachChartSlabData.fromPeriod,
        toPeriod: eachChartSlabData.toPeriod,
        incentives: this.getIncentivesData(eachChartSlabData)
      };
      if (eachChartSlabData.id) {
        chartSlab['id'] = eachChartSlabData.id;
      }
      chartSlabs.push(chartSlab);
    });
    return chartSlabs;
  }

  getIncentivesData(chartSlabData: any) {
    const incentives: any[] = [];
    let incentiveDatas: any[] = [];
    if (chartSlabData.incentives) {
      const isChartIncentiveArray = Array.isArray(chartSlabData.incentives);
      if (!isChartIncentiveArray) {
        incentiveDatas.push(chartSlabData.incentives);
      } else {
        incentiveDatas = chartSlabData.incentives;
      }
      incentiveDatas.forEach((incentiveData: any) => {
        const incentive = {
          amount: incentiveData.amount,
          attributeName: incentiveData.attributeName,
          attributeValue: incentiveData.attributeValue,
          conditionType: incentiveData.conditionType,
          entityType: incentiveData.entityType,
          incentiveType: incentiveData.incentiveType
        };
        incentives.push(incentive);
      });
    }
    return incentives;
  }

  createFixedDepositProductInterestRateChartForm() {
    this.fixedDepositProductInterestRateChartForm = this.formBuilder.group({
      charts: this.formBuilder.array([])
    });
  }

  get charts(): UntypedFormArray {
    return this.fixedDepositProductInterestRateChartForm.get('charts') as UntypedFormArray;
  }

  createChartForm(): UntypedFormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [''],
      description: [''],
      fromDate: [
        '',
        Validators.required
      ],
      endDate: [''],
      isPrimaryGroupingByAmount: [false],
      chartSlabs: this.formBuilder.array([], Validators.required)
    });
  }

  addChart() {
    this.charts.push(this.createChartForm());
    this.setConditionalControls(this.charts.length - 1);
  }

  setConditionalControls(chartIndex: number) {
    this.chartSlabsDisplayedColumns[chartIndex] = [
      'period',
      'amountRange',
      'annualInterestRate',
      'description',
      'actions'
    ];
    this.charts
      .at(chartIndex)
      .get('isPrimaryGroupingByAmount')
      .valueChanges.subscribe((isPrimaryGroupingByAmount: boolean) => {
        this.chartSlabsDisplayedColumns[chartIndex] = isPrimaryGroupingByAmount ? [
              'amountRange',
              'period'
            ] : [
              'period',
              'amountRange'
            ];
        this.chartSlabsDisplayedColumns[chartIndex].push('annualInterestRate', 'description', 'actions');
      });
  }

  getIncentives(chartSlabs: UntypedFormArray, chartSlabIndex: number): UntypedFormArray {
    return chartSlabs.at(chartSlabIndex).get('incentives') as UntypedFormArray;
  }

  addChartSlab(chartSlabs: UntypedFormArray) {
    const data = { ...this.getData('Slab') };
    const dialogRef = this.dialog.open(FormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        response.data.addControl('incentives', this.formBuilder.array([]));
        chartSlabs.push(response.data);
      }
    });
  }

  addIncentive(incentives: UntypedFormArray) {
    const data = { ...this.getData('Incentive'), entityType: this.entityTypeData[0].id };
    const dialogRef = this.dialog.open(DepositProductIncentiveFormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        incentives.push(response.data);
      }
    });
  }

  editChartSlab(chartSlabs: UntypedFormArray, chartSlabIndex: number) {
    const data = {
      ...this.getData('Slab', chartSlabs.at(chartSlabIndex).value),
      layout: { addButtonText: this.translateService.instant('labels.text.this') }
    };
    const dialogRef = this.dialog.open(FormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        chartSlabs.at(chartSlabIndex).patchValue(response.data.value);
      }
    });
  }

  editIncentive(incentives: UntypedFormArray, incentiveIndex: number) {
    const data = {
      ...this.getData('Incentive', incentives.at(incentiveIndex).value),
      layout: { addButtonText: this.translateService.instant('labels.text.this') }
    };
    const dialogRef = this.dialog.open(DepositProductIncentiveFormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        incentives.at(incentiveIndex).patchValue(response.data.value);
      }
    });
  }

  delete(formArray: UntypedFormArray, index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: this.translateService.instant('labels.text.this') }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        formArray.removeAt(index);
      }
    });
  }

  getData(formType: string, values?: any) {
    switch (formType) {
      case 'Slab':
        return {
          title: this.translateService.instant('labels.inputs.Slab'),
          formfields: this.getSlabFormfields(values)
        };
      case 'Incentive':
        return { values, chartTemplate: this.fixedDepositProductsTemplate.chartTemplate };
    }
  }

  getSlabFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'periodType',
        label: this.translateService.instant('labels.inputs.Period Type'),
        value: values ? values.periodType : this.periodTypeData[0].id,
        options: { label: 'value', value: 'id', data: this.periodTypeData },
        required: true,
        order: 1
      }),
      new InputBase({
        controlName: 'fromPeriod',
        label: this.translateService.instant('labels.inputs.Period From'),
        value: values ? values.fromPeriod : undefined,
        type: 'number',
        required: true,
        order: 2
      }),
      new InputBase({
        controlName: 'toPeriod',
        label: this.translateService.instant('labels.inputs.Period To'),
        value: values ? values.toPeriod : undefined,
        type: 'number',
        order: 3
      }),
      new InputBase({
        controlName: 'amountRangeFrom',
        label: this.translateService.instant('labels.inputs.Amount Range From'),
        value: values ? values.amountRangeFrom : undefined,
        type: 'number',
        order: 4
      }),
      new InputBase({
        controlName: 'amountRangeTo',
        label: this.translateService.instant('labels.inputs.Amount Range To'),
        value: values ? values.amountRangeTo : undefined,
        type: 'number',
        order: 5
      }),
      new InputBase({
        controlName: 'annualInterestRate',
        label: this.translateService.instant('labels.inputs.Interest'),
        value: values ? values.annualInterestRate : undefined,
        type: 'number',
        required: true,
        order: 6
      }),
      new InputBase({
        controlName: 'description',
        label: this.translateService.instant('labels.inputs.Description'),
        value: values ? values.description : undefined,
        required: true,
        order: 7
      })

    ];
    return formfields;
  }

  get fixedDepositProductInterestRateChart() {
    // TODO: Update once language and date settings are setup
    const locale = this.settingsService.language.code;
    const dateFormat = 'YYYY-MM-DD';
    const fixedDepositProductInterestRateChart = this.fixedDepositProductInterestRateChartForm.value;
    for (const chart of fixedDepositProductInterestRateChart.charts) {
      chart.locale = locale;
      chart.dateFormat = 'yyyy-MM-dd';
      if (chart.fromDate instanceof Date) {
        chart.fromDate = this.dateUtils.formatDateAsString(chart.fromDate, dateFormat);
      }
      if (chart.endDate) {
        if (chart.endDate instanceof Date) {
          chart.endDate = this.dateUtils.formatDateAsString(chart.endDate, dateFormat);
        }
      }
      if (chart.endDate === '') {
        delete chart.endDate;
      }
      if (chart.id === null) {
        delete chart.id;
      }
    }
    return fixedDepositProductInterestRateChart;
  }
}

interface ChartData {
  id?: number;
  endDate?: string;
  fromDate?: string;
  isPrimaryGroupingByAmount: boolean;
  name: string;
  description: string;
  chartSlabs: ChartSlab[];
}

interface ChartSlab {
  periodType?: string;
  fromPeriod?: number;
  toPeriod?: number;
  amountRangeFrom?: number;
  amountRangeTo?: number;
  annualInterestRate?: number;
  description?: string;
}

interface Chart extends Omit<ChartData, 'endDate' | 'fromDate'> {
  endDate: Date | string;
  fromDate: Date | string;
}
