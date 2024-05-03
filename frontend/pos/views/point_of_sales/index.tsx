import React, { FC } from 'react';
import PointOfSalesTools from './tools';
import { Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { paths } from 'common/constants';
import { Row, Col, Nav, NavItem } from 'reactstrap';
import CaptureSales from './capture_sales';

const PointOfSales: FC = () => (
  <>
    <Row>
      <Col sm={4}>
        <h1>Punto de venta</h1>
      </Col>
      <Col>
        <Nav tabs justified>
          <NavItem>
            <NavLink className="nav-link" to={paths.client.POS.CAPTURE}>
              Capturar Venta
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="nav-link" to={paths.client.POS.TOOLS}>
              Herramientas
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
    </Row>
    <Routes>
      <Route index element={<Navigate to={paths.client.POS.CAPTURE} replace />} />
      <Route path={paths.client.POS.CAPTURE} element={<CaptureSales />} />
      <Route path={paths.client.POS.TOOLS} element={<PointOfSalesTools />} />
    </Routes>
    <Outlet />
  </>
);

export default PointOfSales;
