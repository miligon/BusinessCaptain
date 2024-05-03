import React, { FC } from 'react';
import DepartmentsReports from './departments';
import FiscalReports from './fiscal';
import ProductReports from './product';
import SectionReports from './section';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { paths } from 'common/constants';
import { Col, Nav, NavItem, Row } from 'reactstrap';
import DocumentReports from './document';

const Reports: FC = () => {
  return (
    <>
      <Row>
        <Col sm={3}>
          <h1>Reportes</h1>
        </Col>
        <Col>
          <Nav tabs justified>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.REPORTS.DEPARTMENTS_REPORT}>
                Por departamentos
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.REPORTS.DOCUMENT_REPORT}>
                Por tipo de documento
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.REPORTS.PRODUCT_REPORT}>
                Por producto
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.REPORTS.SECTION_REPORT}>
                Por sección
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
      <Routes>
        <Route index element={<Navigate to={paths.client.REPORTS.DEPARTMENTS_REPORT} replace={true} />} />
        <Route path={paths.client.REPORTS.DEPARTMENTS_REPORT} element={<DepartmentsReports />} />
        <Route path={paths.client.REPORTS.DOCUMENT_REPORT} element={<DocumentReports />} />
        <Route path={paths.client.REPORTS.PRODUCT_REPORT} element={<ProductReports />} />
        <Route path={paths.client.REPORTS.SECTION_REPORT} element={<SectionReports />} />
        <Route path={paths.client.REPORTS.FISCAL_REPORT} element={<FiscalReports />} />
      </Routes>
    </>
  );
};

export default Reports;
export { DepartmentsReports, FiscalReports, ProductReports, SectionReports };
