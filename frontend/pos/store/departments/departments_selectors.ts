import { RootState } from 'landing_page/store';
import { RequestStatus } from '../interfaces';
import { DepartmentsData } from './departments_slice';

export const selectDepartments = (state: RootState): DepartmentsData => state.departments.departmentsData;

export const selectDepartmentsRequestStatus = (state: RootState): RequestStatus => state.departments.requestStatus;
