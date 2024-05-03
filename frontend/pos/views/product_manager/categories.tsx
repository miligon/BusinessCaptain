import { REQUEST_TYPE, paths } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';
import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Col, Row, Label, Input, Button, Spinner, Table } from 'reactstrap';
import { selectProductCategories, selectProductCategoriesRequestStatus } from 'pos/store/product_categories/product_categories_selectors';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { useDebounce } from 'use-debounce';
import { deleteProductCategory, listProductCategories, postProductCategory, putProductCategory } from 'pos/store/product_categories/product_categories_thunk';
import { ProductCategory } from 'pos/store/product_categories/product_categories_slice';
import Modal from 'pos/components/forms/Modal';

const Categories: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const productCategories = useAppSelector(selectProductCategories);
  const productCategoriesRequest = useAppSelector(selectProductCategoriesRequestStatus);

  const [filter, setFilter] = useState('');
  const [filteredProductCategories, setFilteredProductCategories] = useState([] as ProductCategory[]);
  const [sorting, setSorting] = useState(true);
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductCategoryInvalid, setNewProductCategoryInvalid] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [idToModify, setIdToModify] = useState(0);
  const [modifiedCategoryInvalid, setModifiedCategoryInvalid] = useState(false);
  const [modifiedCategory, setModifiedCategory] = useState('');
  const [modifyFlag, setModifyFlag] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [debouncedFilter] = useDebounce(filter, 500);

  useEffect(() => {
    if (!productCategories.isLoaded && !productCategoriesRequest.loading) {
      dispatch(listProductCategories());
    }
  }, []);

  useEffect(() => {
    if ((productCategoriesRequest.type === REQUEST_TYPE.DELETE || productCategoriesRequest.type === REQUEST_TYPE.POST || productCategoriesRequest.type === REQUEST_TYPE.PUT) && productCategoriesRequest.success) {
      dispatch(listProductCategories());
    }
  }, [productCategoriesRequest]);

  const sortProductCategories = (filtered: ProductCategory[]) => {
    if (sorting) {
      return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else {
      return filtered.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
  };

  useEffect(() => {
    if (productCategoriesRequest.type === REQUEST_TYPE.LIST && productCategoriesRequest.success && productCategories.isLoaded) {
      let filtered = productCategories.data;
      if (debouncedFilter !== '') {
        filtered = [...filtered.filter((b) => b.name.toLowerCase().includes(debouncedFilter.toLowerCase()))];
      }
      setFilteredProductCategories(sortProductCategories([...filtered]));
    }
  }, [debouncedFilter, sorting, productCategories, productCategoriesRequest]);

  const handleAddProductCategory = () => {
    if (newProductCategory === '' || productCategories.data.find((c) => c.name === newProductCategory)) {
      setNewProductCategoryInvalid(true);
      return;
    }
    const clave = newProductCategory; //.replace(/\s/g, '_');
    dispatch(
      postProductCategory({
        clave: clave,
        name: newProductCategory,
      }),
    );
  };

  const handleDeleteProductCategory = () => {
    if (idToDelete !== 0) {
      dispatch(deleteProductCategory(idToDelete.toString()));
    }
    setShowDeleteConfirmation(false);
  };

  const handleSaveCategory = () => {
    const clave = modifiedCategory; //.replace(/\s/g, '_');
    if (modifiedCategory === '' || productCategories.data.find((b) => b.id !== idToModify && b.name === modifiedCategory)) {
      setModifiedCategoryInvalid(true);
      return;
    }
    dispatch(
      putProductCategory({
        id: idToModify.toString(),
        data: {
          clave: clave,
          name: modifiedCategory,
        },
      }),
    );
    setModifyFlag(false);
  };

  const renderProductCategories = () => (
    <>
      <Table hover>
        <thead>
          <tr>
            <th>
              <button className="button-link" onClick={() => setSorting(!sorting)}>
                {sorting ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}
              </button>
              Categoria
            </th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductCategories.map((b) => (
            <tr key={b.id}>
              <td>{modifyFlag && b.id === idToModify ? <Input invalid={modifiedCategoryInvalid} value={modifiedCategory} onChange={(e) => setModifiedCategory(e.target.value)} /> : b.name}</td>
              <td>
                {!modifyFlag ? (
                  <Button
                    onClick={() => {
                      setModifiedCategory(b.name);
                      setIdToModify(b.id);
                      setModifyFlag(true);
                    }}
                  >
                    <i className="ri-pencil-fill" />
                  </Button>
                ) : modifyFlag && b.id === idToModify ? (
                  <Button onClick={() => handleSaveCategory()}>
                    <i className="ri-save-fill" />
                  </Button>
                ) : null}
                {modifyFlag ? null : (
                  <>
                    <span> </span>
                    <Button
                      onClick={() => {
                        setIdToDelete(b.id);
                        setShowDeleteConfirmation(true);
                      }}
                    >
                      <i className="ri-delete-bin-6-line" />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredProductCategories.length === 0 ? <h6 className="text-center">Sin resultados</h6> : null}
    </>
  );

  if (productCategoriesRequest.error && productCategoriesRequest.type === REQUEST_TYPE.LIST) {
    return (
      <>
        <ErrorMesssage reload={true} title="Almacen" />
        <Outlet />
      </>
    );
  } else {
    return (
      <>
        <br />
        <div className="d-flex align-items-center justify-content-between">
          <Col sm={12}>
            <Row>
              <Col sm={12}>
                <Row className="align-items-center">
                  <Col sm={2}>
                    <Label for="Search">Categoria:</Label>
                  </Col>
                  <Col sm={5}>
                    <Input
                      id="marca"
                      name="text"
                      placeholder=""
                      invalid={newProductCategoryInvalid}
                      pattern="[A-Za-z\s]+"
                      type="text"
                      value={newProductCategory}
                      onChange={(e) => {
                        setNewProductCategory(e.target.value);
                        setNewProductCategoryInvalid(false);
                      }}
                    />
                  </Col>
                  <Col sm={5}>
                    <Button color="primary" onClick={() => handleAddProductCategory()}>
                      Añadir Categoria
                      <i className="ri-add-fill" />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row className="justify-content-between">
              <Col sm={4}>
                <Row className="align-items-center">
                  <Col sm={2}>
                    <Label for="Search">Buscar:</Label>
                  </Col>
                  <Col sm={10}>
                    <Input id="Search" name="search" placeholder="" value={filter} onChange={(e) => setFilter(e.target.value)} type="search" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </div>
        {(productCategoriesRequest.type === REQUEST_TYPE.PUT || productCategoriesRequest.type === REQUEST_TYPE.POST) && productCategoriesRequest.loading ? (
          <>
            <h5>Guardando datos en el servidor . . .</h5>
            <Spinner />
          </>
        ) : null}

        {(productCategoriesRequest.type === REQUEST_TYPE.PUT || productCategoriesRequest.type === REQUEST_TYPE.POST) && productCategoriesRequest.error ? (
          <>
            <h5 className="text-danger">Ocurrio un error al guardar los datos ...</h5>
          </>
        ) : null}
        {productCategoriesRequest.type === REQUEST_TYPE.DELETE && productCategoriesRequest.error ? (
          <>
            <h5 className="text-danger">No se pudo eliminar el registro ...</h5>
          </>
        ) : null}
        <hr />

        {productCategoriesRequest.loading ? <Spinner /> : null}
        {productCategories.isLoaded && !productCategoriesRequest.loading ? renderProductCategories() : null}
        <Modal delete isOpen={showDeleteConfirmation} onContinue={() => handleDeleteProductCategory()} onCancel={() => setShowDeleteConfirmation(false)} />
        <Outlet />
      </>
    );
  }
};

export default Categories;
