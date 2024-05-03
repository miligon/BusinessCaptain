import { RootState } from 'landing_page/store';
import { DepartmentsReport, DocumentsReport } from './reports_slice';

export const selectDepartmentsReport = (state: RootState): DepartmentsReport => state.reports.departmentsReport;
export const selectDocumentsReport = (state: RootState): DocumentsReport => state.reports.documentReport;
