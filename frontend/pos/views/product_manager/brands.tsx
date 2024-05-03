import { REQUEST_TYPE, paths } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';
import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Col, Row, Label, Input, Button, Spinner, Table } from 'reactstrap';
import { selectBrands, selectBrandsRequestStatus } from 'pos/store/brands/brands_selectors';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { useDebounce } from 'use-debounce';
import { deleteBrand, listBrands, postBrand, putBrand } from 'pos/store/brands/brands_thunk';
import { Brand } from 'pos/store/brands/brands_slice';
import Modal from 'pos/components/forms/Modal';

const Brands: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const brands = useAppSelector(selectBrands);
  const brandsRequest = useAppSelector(selectBrandsRequestStatus);

  const [filter, setFilter] = useState('');
  const [filteredBrands, setFilteredBrands] = useState([] as Brand[]);
  const [sorting, setSorting] = useState(true);
  const [newBrand, setNewBrand] = useState('');
  const [newBrandInvalid, setNewBrandInvalid] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [idToModify, setIdToModify] = useState(0);
  const [modifiedBrandInvalid, setModifiedBrandInvalid] = useState(false);
  const [modifiedBrand, setModifiedBrand] = useState('');
  const [modifyFlag, setModifyFlag] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [debouncedFilter] = useDebounce(filter, 500);

  useEffect(() => {
    if (!brands.isLoaded && !brandsRequest.loading) {
      dispatch(listBrands());
    }
  }, []);

  useEffect(() => {
    if ((brandsRequest.type === REQUEST_TYPE.DELETE || brandsRequest.type === REQUEST_TYPE.POST || brandsRequest.type === REQUEST_TYPE.PUT) && brandsRequest.success) {
      dispatch(listBrands());
    }
  }, [brandsRequest]);

  const sortBrands = (filtered: Brand[]) => {
    if (sorting) {
      return filtered.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    } else {
      return filtered.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
  };

  useEffect(() => {
    if (brandsRequest.type === REQUEST_TYPE.LIST && brandsRequest.success && brands.isLoaded) {
      let filtered = brands.data;
      if (debouncedFilter !== '') {
        filtered = [...filtered.filter((b) => b.name.toLowerCase().includes(debouncedFilter.toLowerCase()))];
      }
      setFilteredBrands(sortBrands([...filtered]));
    }
  }, [debouncedFilter, sorting, brands, brandsRequest]);

  const handleAddBrand = () => {
    const clave = newBrand.replace(/\s/g, '_');
    if (newBrand === '' || brands.data.find((b) => b.clave === clave && b.name === newBrand)) {
      setNewBrandInvalid(true);
      return;
    }
    dispatch(
      postBrand({
        clave: clave,
        name: newBrand,
      }),
    );
  };

  const handleDeleteBrand = () => {
    if (idToDelete !== 0) {
      dispatch(deleteBrand(idToDelete.toString()));
    }
    setShowDeleteConfirmation(false);
  };

  const handleSaveBrand = () => {
    const clave = modifiedBrand.replace(/\s/g, '_');
    if (modifiedBrand === '' || brands.data.find((b) => b.id !== idToModify && b.clave === clave && b.name === newBrand)) {
      setModifiedBrandInvalid(true);
      return;
    }
    dispatch(
      putBrand({
        id: idToModify.toString(),
        data: {
          clave: clave,
          name: modifiedBrand,
        },
      }),
    );
    setModifyFlag(false);
  };

  const renderBrands = () => (
    <>
      <Table hover>
        <thead>
          <tr>
            <th>
              <button className="button-link" onClick={() => setSorting(!sorting)}>
                {sorting ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}
              </button>
              Marca
            </th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredBrands.map((b) => (
            <tr key={b.id}>
              <td>{modifyFlag && b.id === idToModify ? <Input invalid={modifiedBrandInvalid} value={modifiedBrand} onChange={(e) => setModifiedBrand(e.target.value)} /> : b.name}</td>
              <td>
                {!modifyFlag ? (
                  <Button
                    onClick={() => {
                      setModifiedBrand(b.name);
                      setIdToModify(b.id);
                      setModifyFlag(true);
                    }}
                  >
                    <i className="ri-pencil-fill" />
                  </Button>
                ) : modifyFlag && b.id === idToModify ? (
                  <Button onClick={() => handleSaveBrand()}>
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
      {filteredBrands.length === 0 ? <h6 className="text-center">Sin resultados</h6> : null}
    </>
  );

  if (brandsRequest.error && brandsRequest.type === REQUEST_TYPE.LIST) {
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
              <Col sm={6}>
                <Row className="align-items-center">
                  <Col sm={2}>
                    <Label for="Search">Marca:</Label>
                  </Col>
                  <Col sm={5}>
                    <Input
                      id="marca"
                      name="text"
                      placeholder=""
                      invalid={newBrandInvalid}
                      pattern="[A-Za-z\s]+"
                      type="text"
                      value={newBrand}
                      onChange={(e) => {
                        setNewBrand(e.target.value);
                        setNewBrandInvalid(false);
                      }}
                    />
                  </Col>
                  <Col sm={5}>
                    <Button color="primary" onClick={() => handleAddBrand()}>
                      Añadir Marca
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
        {(brandsRequest.type === REQUEST_TYPE.PUT || brandsRequest.type === REQUEST_TYPE.POST) && brandsRequest.loading ? (
          <>
            <h5>Guardando datos en el servidor . . .</h5>
            <Spinner />
          </>
        ) : null}

        {(brandsRequest.type === REQUEST_TYPE.PUT || brandsRequest.type === REQUEST_TYPE.POST) && brandsRequest.error ? (
          <>
            <h5 className="text-danger">Ocurrio un error al guardar los datos ...</h5>
          </>
        ) : null}

        {brandsRequest.type === REQUEST_TYPE.DELETE && brandsRequest.error ? (
          <>
            <h5 className="text-danger">No se pudo eliminar el registro ...</h5>
          </>
        ) : null}
        <hr />

        {brandsRequest.loading ? <Spinner /> : null}
        {brands.isLoaded && !brandsRequest.loading ? renderBrands() : null}
        <Modal delete isOpen={showDeleteConfirmation} onContinue={() => handleDeleteBrand()} onCancel={() => setShowDeleteConfirmation(false)} />
        <Outlet />
      </>
    );
  }
};

export default Brands;
