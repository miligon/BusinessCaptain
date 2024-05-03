import React, { FC } from 'react';
import ProductDetails from './product_detail';
import ProductSearch from './product_search';
import Brands from './brands';
import Departments from './departments';
import LabelGenerator from './label_generator';
import { Navigate, NavLink, Route, Routes, useMatch } from 'react-router-dom';
import { paths } from 'common/constants';
import { Col, Nav, NavItem, Row } from 'reactstrap';
import Categories from './categories';

const ProductManager: FC = () => {
  const basePath = paths.client.APP_BASE + '/' + paths.client.PRODUCT_MANAGER.BASE + '/';
  const matchDetails = useMatch(basePath + paths.client.PRODUCT_MANAGER.PRODUCT_DETAILS);
  const matchNew = useMatch(basePath + paths.client.PRODUCT_MANAGER.PRODUCT_NEW);

  return (
    <>
      {matchDetails || matchNew ? null : (
        <Row>
          <Col sm={3}>
            <h1>Almacen</h1>
          </Col>
          <Col>
            <Nav tabs justified>
              <NavItem>
                <NavLink className="nav-link" to={paths.client.PRODUCT_MANAGER.PRODUCT_SEARCH}>
                  Productos
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={paths.client.PRODUCT_MANAGER.BRANDS}>
                  Marcas
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={paths.client.PRODUCT_MANAGER.CATEGORIES}>
                  Categoria
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={paths.client.PRODUCT_MANAGER.DEPARTMENTS}>
                  Departamentos
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
      )}
      <Routes>
        <Route index element={<Navigate to={paths.client.PRODUCT_MANAGER.PRODUCT_SEARCH} replace />} />
        <Route path={paths.client.PRODUCT_MANAGER.PRODUCT_SEARCH} element={<ProductSearch />} />
        <Route path={paths.client.PRODUCT_MANAGER.PRODUCT_DETAILS} element={<ProductDetails />} />
        <Route path={paths.client.PRODUCT_MANAGER.PRODUCT_NEW} element={<ProductDetails />} />
        <Route path={paths.client.PRODUCT_MANAGER.DEPARTMENTS} element={<Departments />} />
        <Route path={paths.client.PRODUCT_MANAGER.CATEGORIES} element={<Categories />} />
        <Route path={paths.client.PRODUCT_MANAGER.BRANDS} element={<Brands />} />
        <Route path={paths.client.PRODUCT_MANAGER.LABEL_GENERATOR} element={<LabelGenerator />} />
      </Routes>
    </>
  );
};

export { ProductDetails, ProductSearch, Brands, Departments, LabelGenerator };
export default ProductManager;
