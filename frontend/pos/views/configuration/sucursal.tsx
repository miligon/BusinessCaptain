import { selectSucursalConfig } from 'pos/store/config/config_selectors';
import { getSucursal } from 'pos/store/config/config_thunk';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Input } from 'reactstrap';

export const ConfigSucursal: FC = () => {
  const sucursal = useAppSelector(selectSucursalConfig);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSucursal());
  }, []);

  const renderSucursal = () => (
    <>
      <br />
      <Row>
        Nombre:
        <Input value={sucursal.data.nombre} />
      </Row>
      <Row>
        Razón social:
        <Input value={sucursal.data.razonSocial} />
      </Row>
      <Row>
        RFC:
        <Input value={sucursal.data.RFC} />
      </Row>
      <Row>
        Regimen fiscal:
        <Input value={sucursal.data.regimenFiscal} />
      </Row>
      <Row>
        Email:
        <Input value={sucursal.data.email} />
      </Row>
      <Row>
        Telefono:
        <Input value={sucursal.data.telefono} />
      </Row>
      <Row>
        Calle:
        <Input value={sucursal.data.calle} />
      </Row>
      <Row>
        Número exterior:
        <Input value={sucursal.data.no_ext} />
      </Row>
      <Row>
        Número Interior:
        <Input value={sucursal.data.no_int ? sucursal.data.no_int : ''} />
      </Row>
      <Row>
        Colonia:
        <Input value={sucursal.data.colonia} />
      </Row>
      <Row>
        Localidad:
        <Input value={sucursal.data.localidad} />
      </Row>
      <Row>
        Municipio:
        <Input value={sucursal.data.municipio} />
      </Row>
      <Row>
        Estado:
        <Input value={sucursal.data.estado} />
      </Row>
      <Row>
        Pais:
        <Input value={sucursal.data.pais} />
      </Row>
      <Row>
        CP:
        <Input value={sucursal.data.cp} />
      </Row>
    </>
  );

  return (
    <>
      <br />
      {renderSucursal()}
      <Outlet />
    </>
  );
};
