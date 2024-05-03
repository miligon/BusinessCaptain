import { selectUserConfig } from 'pos/store/config/config_selectors';
import { useAppSelector } from 'landing_page/store/hooks';
import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Input } from 'reactstrap';

export const ConfigCaja: FC = () => {
  const cajaConfig = useAppSelector(selectUserConfig);

  return cajaConfig.isLoaded ? (
    <>
      <br />
      Activar integracion Mercado Pago
      <Input checked={cajaConfig.data.configuracion_caja.activar_integracion_MP} type="checkbox" />
      <br />
      Abrir automaticamente la ventana de impresion de ticket
      <Input checked={cajaConfig.data.configuracion_caja.open_print_ticket} type="checkbox" />
      <Outlet />
    </>
  ) : null;
};
