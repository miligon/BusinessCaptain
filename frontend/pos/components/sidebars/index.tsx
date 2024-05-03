import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import { paths } from 'common/constants';
import { useAppDispatch } from 'landing_page/store/hooks';
import { logout } from 'pos/store/auth/auth_slice';

export default function SidebarApp() {
  const dispatch = useAppDispatch();

  const menu = [
    { to: paths.client.POS.BASE, icon: Icon.Basket, text: 'Punto de venta' },
    //menu.push({ to: "/app/taller", icon: Icon.Hammer, text: "Taller"}
    { to: paths.client.CUSTOMER_MANAGER.BASE, icon: Icon.PeopleFill, text: 'Clientes' },
    { to: paths.client.PRODUCT_MANAGER.BASE, icon: Icon.Box2Fill, text: 'Almacen' },
    //menu.push({ to: "/app/consulta-tickets", icon: Icon.Files, text: "Consulta de tickets"})
    //menu.push({ to: "/app/dinero", icon: Icon.CashCoin, text: "Dinero"})
    //menu.push({ to: "/app/facturacion", icon: Icon.FileEarmarkCode, text: "Facturacion"})
    { to: paths.client.REPORTS.BASE, icon: Icon.GraphUp, text: 'Reportes' },
    { to: paths.client.CONFIG.BASE, icon: Icon.Gear, text: 'Configuracion' },
  ];

  return (
    <>
      <div className="sidebar-app d-flex flex-column flex-shrink-0 p-3 text-bg-dark">
        <Link to={paths.client.APP_DASHBOARD} className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <img className="title-icon" src="/static/react/img/logo-white.svg" alt="" />
          <span className="title-text fs-4">Business Captain</span>
        </Link>
        <p className="hostname">{window.location.hostname}</p>
        <hr></hr>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            {menu.map((pagina) => {
              return (
                <NavLink key={pagina.to} to={pagina.to} className="nav-link text-white" end>
                  <pagina.icon className="nav-icon" />
                  <span className="nav-text">{'    ' + pagina.text}</span>
                </NavLink>
              );
            })}
          </li>
          <li className="nav-item">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link onClick={() => dispatch(logout())} to={paths.client.LANDING_PAGE.BASE} className="nav-link text-white">
              <Icon.DoorClosedFill className="nav-icon" />
              <span className="nav-text">{'    Cerrar Sesión'}</span>
            </Link>
          </li>
        </ul>
        <hr></hr>
      </div>
    </>
  );
}
