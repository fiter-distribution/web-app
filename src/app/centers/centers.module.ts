/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { CentersRoutingModule } from './centers-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';

/** Custom Components */
import { CentersComponent } from './centers.component';
import { CreateCenterComponent } from './create-center/create-center.component';
import { CentersViewComponent } from './centers-view/centers-view.component';
import { GeneralTabComponent } from './centers-view/general-tab/general-tab.component';
import { NotesTabComponent } from './centers-view/notes-tab/notes-tab.component';
import { DatatableTabComponent } from './centers-view/datatable-tab/datatable-tab.component';
import { CenterActionsComponent } from './centers-view/center-actions/center-actions.component';
import { ActivateCenterComponent } from './centers-view/center-actions/activate-center/activate-center.component';
import { CenterAssignStaffComponent } from './centers-view/center-actions/center-assign-staff/center-assign-staff.component';
import { CloseCenterComponent } from './centers-view/center-actions/close-center/close-center.component';
import { CenterAttendanceComponent } from './centers-view/center-actions/center-attendance/center-attendance.component';
import { AttachCenterMeetingComponent } from './centers-view/center-actions/attach-center-meeting/attach-center-meeting.component';
import { EditCenterMeetingComponent } from './centers-view/center-actions/edit-center-meeting/edit-center-meeting.component';
import { EditCenterMeetingScheduleComponent } from './centers-view/center-actions/edit-center-meeting-schedule/edit-center-meeting-schedule.component';
import { ManageGroupsComponent } from './centers-view/center-actions/manage-groups/manage-groups.component';
import { StaffAssignmentHistoryComponent } from './centers-view/center-actions/staff-assignment-history/staff-assignment-history.component';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { CenterViewResolver } from './common-resolvers/center-view.resolver';
import { CenterDatatablesResolver } from './common-resolvers/center-datatables.resolver';
import { CenterDatatableResolver } from './common-resolvers/center-datatable.resolver';
import { CenterSummaryResolver } from './common-resolvers/center-summary.resolver';
import { CenterResourceResolver } from './common-resolvers/center-resource.resolver';
import { SavingsAccountResolver } from './common-resolvers/savings-account.resolver';
import { CenterNotesResolver } from './common-resolvers/center-notes.resolver';

/**
 * Centers Module
 *
 * All components related to Centers should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    CentersRoutingModule,
    PipesModule,
    DirectivesModule,
    CentersComponent,
    CreateCenterComponent,
    CentersViewComponent,
    GeneralTabComponent,
    NotesTabComponent,
    DatatableTabComponent,
    CenterActionsComponent,
    ActivateCenterComponent,
    CenterAssignStaffComponent,
    CloseCenterComponent,
    CenterAttendanceComponent,
    AttachCenterMeetingComponent,
    EditCenterMeetingComponent,
    EditCenterMeetingScheduleComponent,
    ManageGroupsComponent,
    StaffAssignmentHistoryComponent,
    EditCenterComponent
  ],
  providers: [
    CenterViewResolver,
    CenterDatatableResolver,
    CenterDatatablesResolver,
    CenterSummaryResolver,
    CenterResourceResolver,
    SavingsAccountResolver,
    CenterNotesResolver
  ]
})
export class CentersModule {}
