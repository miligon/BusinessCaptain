import React, { FC } from 'react';
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { paths } from 'common/constants';
import { Col, Nav, NavItem, Row } from 'reactstrap';
import { ConfigSucursal } from './sucursal';
import { ConfigCaja } from './caja';

const ConfigIndex: FC = () => {
  return (
    <>
      <h1>Configuración</h1>
      <Row>
        <Col>
          <Nav tabs justified>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.CONFIG.SUCURSAL}>
                Datos sucursal
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={paths.client.CONFIG.CAJA}>
                Caja
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
      <Routes>
        <Route index element={<Navigate to={paths.client.CONFIG.SUCURSAL} replace={true} />} />
        <Route path={paths.client.CONFIG.CAJA} element={<ConfigCaja />} />
        <Route path={paths.client.CONFIG.SUCURSAL} element={<ConfigSucursal />} />
      </Routes>
    </>
  );
};

export default ConfigIndex;
