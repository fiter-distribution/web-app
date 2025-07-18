/** Angular Imports */
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

/** rxjs Imports */
import { merge } from 'rxjs';
import { tap, startWith, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';

/** Custom Services */
import { CentersService } from './centers.service';

/** Custom Data Source */
import { CentersDataSource } from './centers.datasource';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import { NgClass, AsyncPipe } from '@angular/common';
import { StatusLookupPipe } from '../pipes/status-lookup.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Centers component.
 */
@Component({
  selector: 'mifosx-app-centers',
  templateUrl: './centers.component.html',
  styleUrls: ['./centers.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatCheckbox,
    FaIconComponent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    NgClass,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    AsyncPipe,
    StatusLookupPipe
  ]
})
export class CentersComponent implements OnInit, AfterViewInit {
  @ViewChild('showClosedCenters', { static: true }) showClosedCenters: MatCheckbox;

  /** Name form control. */
  name = new UntypedFormControl();
  /** ExternalId form control. */
  externalId = new UntypedFormControl();
  /** Columns to be displayed in centers table. */
  displayedColumns = [
    'name',
    'accountNo',
    'externalId',
    'status',
    'officeName'
  ];
  /** Data source for centers table. */
  dataSource: CentersDataSource;
  /** Centers filter. */
  filterCentersBy = [
    {
      type: 'name',
      value: ''
    },
    {
      type: 'externalId',
      value: ''
    }
  ];

  /** Paginator for centers table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for centers table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private centersService: CentersService) {}

  ngOnInit() {
    this.getCenters();
  }

  /**
   * Subscribes to all search filters:
   * Name, ExternalId
   * sort change and page change.
   */
  ngAfterViewInit() {
    this.name.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'name');
        })
      )
      .subscribe();

    this.externalId.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((filterValue) => {
          this.applyFilter(filterValue, 'externalId');
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadCentersPage()))
      .subscribe();
  }

  /**
   * Reloads page on changing show closed centers checkbox
   */
  changeShowClosedCenters() {
    this.loadCentersPage();
  }

  /**
   * Loads a page of centers.
   */
  loadCentersPage() {
    if (!this.sort.direction) {
      delete this.sort.active;
    }
    this.dataSource.getCenters(
      this.filterCentersBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      !this.showClosedCenters.checked
    );
  }

  /**
   * Filters data in centers table based on passed value and poperty.
   * @param {string} filterValue Value to filter data.
   * @param {string} property Property to filter data by.
   */
  applyFilter(filterValue: string, property: string) {
    this.paginator.pageIndex = 0;
    const findIndex = this.filterCentersBy.findIndex((filter) => filter.type === property);
    this.filterCentersBy[findIndex].value = filterValue;
    this.loadCentersPage();
  }

  /**
   * Initializes the data source for centers table and loads the first page.
   */
  getCenters() {
    this.dataSource = new CentersDataSource(this.centersService);
    this.dataSource.getCenters(
      this.filterCentersBy,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
