import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityDatatableTabComponent } from '../../../shared/tabs/entity-datatable-tab/entity-datatable-tab.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-datatable-tab',
  templateUrl: './datatable-tab.component.html',
  styleUrls: ['./datatable-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    EntityDatatableTabComponent
  ]
})
export class DatatableTabComponent {
  entityId: string;
  /** Center Datatable */
  entityDatatable: any;
  /** Multi Row Datatable Flag */
  multiRowDatatableFlag: boolean;

  /**
   * Fetches data table data from `resolve`
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.entityId = this.route.parent.parent.snapshot.paramMap.get('centerId');

    this.route.data.subscribe((data: { centerDatatable: any }) => {
      this.entityDatatable = data.centerDatatable;
      this.multiRowDatatableFlag = this.entityDatatable.columnHeaders[0].columnName === 'id' ? true : false;
    });
  }
}
