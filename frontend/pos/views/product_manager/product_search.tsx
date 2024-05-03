import { paths, searchProductFilter, REQUEST_TYPE } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';
import { selectProducts, selectProductsRequestStatus } from 'pos/store/products/products_selectors';
import { ProductList } from 'pos/store/products/products_slice';
import { listProducts, getProduct, deleteProduct } from 'pos/store/products/products_thunk';
import { useAppSelector, useAppDispatch } from 'landing_page/store/hooks';
import React, { FC, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Col, Row, Label, Input, InputGroupText, InputGroup } from 'reactstrap';
import { useDebounce } from 'use-debounce';
import Select from 'react-select';
import { listDepartments } from 'pos/store/departments/departments_thunk';
import { listBrands } from 'pos/store/brands/brands_thunk';
import { listProductCategories } from 'pos/store/product_categories/product_categories_thunk';
import { selectDepartments, selectDepartmentsRequestStatus } from 'pos/store/departments/departments_selectors';
import { selectBrands, selectBrandsRequestStatus } from 'pos/store/brands/brands_selectors';
import { selectProductCategories, selectProductCategoriesRequestStatus } from 'pos/store/product_categories/product_categories_selectors';
import Modal from 'pos/components/forms/Modal';
import CustomPagination from 'pos/components/forms/pagination';
import ProductsTable from 'pos/components/forms/products_table';

const ProductSearch: FC = () => {
  const { loading: loading, error: error, type: type, success: success } = useAppSelector(selectProductsRequestStatus);
  const products = useAppSelector(selectProducts);
  const departments = useAppSelector(selectDepartments);
  const departmentsRequest = useAppSelector(selectDepartmentsRequestStatus);
  const brands = useAppSelector(selectBrands);
  const brandsRequest = useAppSelector(selectBrandsRequestStatus);
  const categories = useAppSelector(selectProductCategories);
  const categoriesRequest = useAppSelector(selectProductCategoriesRequestStatus);
  //const deleteStatus = useAppSelector(selectDeleteCustomerStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState(searchProductFilter);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [searchByCode, setSearchByCode] = useState(false);

  useEffect(() => {
    if (!departments.isLoaded && !departmentsRequest.loading) {
      dispatch(listDepartments());
    }
    if (!brands.isLoaded && !brandsRequest.loading) {
      dispatch(listBrands());
    }
    if (!categories.isLoaded && !categoriesRequest.loading) {
      dispatch(listProductCategories());
    }
  }, []);

  useEffect(() => {
    if (type === REQUEST_TYPE.DELETE && success) {
      dispatch(listProducts(filter));
    }
  }, [type, success]);

  const handleDelete = () => {
    if (idToDelete !== '') {
      dispatch(deleteProduct(idToDelete.toString()));
    }
    setShowDeleteConfirmation(false);
  };

  const handleSearchByCode = (enabled: boolean) => {
    const query = filter.query;
    enabled ? setFilter({ ...filter, codigo: query }) : setFilter({ ...filter, codigo: '' });
    setSearchByCode(enabled);
  };

  const handleSearch = (value: string) => {
    if (searchByCode) {
      setFilter({ ...filter, codigo: value, query: '' });
    } else {
      setFilter({ ...filter, codigo: '', query: value });
    }
  };

  const handleEdit = (id: string) => {
    dispatch(getProduct(id.toString()));
  };

  const handleSetDelete = (id: string) => {
    setIdToDelete(id.toString());
    setShowDeleteConfirmation(true);
  };

  if (error && type === REQUEST_TYPE.LIST) {
    return (
      <>
        <ErrorMesssage title="Almacen" />
        <Outlet />
      </>
    );
  } else {
    return (
      <>
        <br />
        <div className="d-flex align-items-center justify-content-between">
          <Col sm={10}>
            <Row>
              <Col sm={10}>
                <Row className="align-items-center">
                  <Label for="Search">Palabras clave, codigo UPC o SKU:</Label>
                  <Col sm={12}>
                    <InputGroup>
                      <Input id="Search" name="search" placeholder="" type="search" onKeyDown={(e) => (e.key === 'Enter' ? handleSearchByCode(true) : null)} onChange={(e) => handleSearch(e.target.value)} />
                      <InputGroupText>
                        <Input addon checked={searchByCode} onChange={() => handleSearchByCode(!searchByCode)} type="checkbox" />
                        Buscar por código o SKU
                      </InputGroupText>
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={10}>
                <Select
                  id="departmentsSelect"
                  options={departments.data.map((d) => ({
                    value: d.clave,
                    label: d.descripcion,
                  }))}
                  isClearable
                  isLoading={departmentsRequest.loading}
                  placeholder="Departamentos ..."
                  onChange={(e) => setFilter({ ...filter, depto: e?.value || '' })}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={10}>
                <Select
                  options={categories.data.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  isClearable
                  isLoading={categoriesRequest.loading}
                  placeholder="Categorias ..."
                  onChange={(e) => setFilter({ ...filter, familia: e?.label || '' })}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm={10}>
                <Select
                  options={brands.data.map((b) => ({
                    value: b.clave,
                    label: b.name,
                  }))}
                  isClearable
                  isLoading={brandsRequest.loading}
                  placeholder="Marcas ..."
                  onChange={(e) => setFilter({ ...filter, marca: e?.label || '' })}
                />
              </Col>
            </Row>
          </Col>
          <Button color="primary" onClick={() => navigate('../' + paths.client.PRODUCT_MANAGER.PRODUCT_NEW)}>
            Agregar Producto
            <br />
            <i className="ri-add-fill" />
            <i className="ri-box-3-fill" />
          </Button>
        </div>
        <hr />
        {loading ? <Spinner /> : null}
        <ProductsTable showActions editCallback={handleEdit} removeCallback={handleSetDelete} pathToEdit={paths.client.PRODUCT_MANAGER.PRODUCT_DETAILS} productsFilter={filter} showPaginationBottom />
        <Modal delete isOpen={showDeleteConfirmation} onContinue={() => handleDelete()} onCancel={() => setShowDeleteConfirmation(false)} />
        <Outlet />
      </>
    );
  }
};

export default ProductSearch;
