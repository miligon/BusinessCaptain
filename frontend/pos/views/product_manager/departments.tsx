import { REQUEST_TYPE, paths } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';
import React, { FC, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Col, Row, Label, Input, Button, Spinner, Table } from 'reactstrap';
import { selectDepartments, selectDepartmentsRequestStatus } from 'pos/store/departments/departments_selectors';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { useDebounce } from 'use-debounce';
import { deleteDepartment, listDepartments, postDepartment, putDepartment } from 'pos/store/departments/departments_thunk';
import { Department } from 'pos/store/departments/departments_slice';
import Modal from 'pos/components/forms/Modal';

const Departments: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const departments = useAppSelector(selectDepartments);
  const departmentsRequest = useAppSelector(selectDepartmentsRequestStatus);

  const [filter, setFilter] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([] as Department[]);
  const [sorting, setSorting] = useState(true);
  const [newDepartmentClave, setNewDepartmentClave] = useState('');
  const [newDepartmentClaveInvalid, setNewDepartmentClaveInvalid] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newDepartmentInvalid, setNewDepartmentInvalid] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [idToModify, setIdToModify] = useState(0);
  const [modifiedDepartmentInvalid, setModifiedDepartmentInvalid] = useState(false);
  const [modifiedDepartment, setModifiedDepartment] = useState({} as Department);
  const [modifyFlag, setModifyFlag] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [debouncedFilter] = useDebounce(filter, 500);

  useEffect(() => {
    if (!departments.isLoaded && !departmentsRequest.loading) {
      dispatch(listDepartments());
    }
  }, []);

  useEffect(() => {
    if ((departmentsRequest.type === REQUEST_TYPE.DELETE || departmentsRequest.type === REQUEST_TYPE.POST || departmentsRequest.type === REQUEST_TYPE.PUT) && departmentsRequest.success) {
      dispatch(listDepartments());
    }
  }, [departmentsRequest]);

  const sortDepartments = (filtered: Department[]) => {
    if (sorting) {
      return filtered.sort((a, b) => a.descripcion.toLowerCase().localeCompare(b.descripcion.toLowerCase()));
    } else {
      return filtered.sort((b, a) => a.descripcion.toLowerCase().localeCompare(b.descripcion.toLowerCase()));
    }
  };

  useEffect(() => {
    if (departmentsRequest.type === REQUEST_TYPE.LIST && departmentsRequest.success && departments.isLoaded) {
      let filtered = departments.data;
      if (debouncedFilter !== '') {
        filtered = [...filtered.filter((b) => b.descripcion.toLowerCase().includes(debouncedFilter.toLowerCase()) || b.clave.toLowerCase().includes(debouncedFilter.toLowerCase()))];
      }
      setFilteredDepartments(sortDepartments([...filtered]));
    }
  }, [debouncedFilter, sorting, departments, departmentsRequest]);

  const handleAddDepartment = () => {
    if (newDepartment === '' || departments.data.find((d) => d.descripcion === newDepartment)) {
      setNewDepartmentInvalid(true);
      return;
    }
    if (newDepartmentClave === '' || /\s/.test(newDepartmentClave) || departments.data.find((d) => d.clave === newDepartmentClave)) {
      setNewDepartmentClaveInvalid(true);
      return;
    }

    dispatch(
      postDepartment({
        clave: newDepartmentClave,
        descripcion: newDepartment,
      }),
    );
  };

  const handleDeleteDepartment = () => {
    if (idToDelete !== 0) {
      dispatch(deleteDepartment(idToDelete.toString()));
    }
    setShowDeleteConfirmation(false);
  };

  const handleSaveDepartment = () => {
    const clave = modifiedDepartment.clave.replace(/\s/g, '_');
    if (modifiedDepartment.clave === '' || modifiedDepartment.descripcion === '' || departments.data.find((b) => b.id !== idToModify && b.clave === clave && b.descripcion === modifiedDepartment.descripcion)) {
      setModifiedDepartmentInvalid(true);
      return;
    }
    dispatch(
      putDepartment({
        id: idToModify.toString(),
        data: { ...modifiedDepartment },
      }),
    );
    setModifyFlag(false);
  };

  const renderDepartments = () => (
    <>
      <Table hover>
        <thead>
          <tr>
            <th>Clave</th>
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
          {filteredDepartments.map((b) => (
            <tr key={b.id}>
              <td>{modifyFlag && b.id === idToModify ? <Input invalid={modifiedDepartmentInvalid} value={modifiedDepartment.clave} onChange={(e) => setModifiedDepartment({ ...modifiedDepartment, clave: e.target.value })} /> : b.clave}</td>
              <td>
                {modifyFlag && b.id === idToModify ? <Input invalid={modifiedDepartmentInvalid} value={modifiedDepartment.descripcion} onChange={(e) => setModifiedDepartment({ ...modifiedDepartment, descripcion: e.target.value })} /> : b.descripcion}
              </td>
              <td>
                {!modifyFlag ? (
                  <Button
                    onClick={() => {
                      setModifiedDepartment(b);
                      setIdToModify(b.id);
                      setModifyFlag(true);
                    }}
                  >
                    <i className="ri-pencil-fill" />
                  </Button>
                ) : modifyFlag && b.id === idToModify ? (
                  <Button onClick={() => handleSaveDepartment()}>
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
      {filteredDepartments.length === 0 ? <h6 className="text-center">Sin resultados</h6> : null}
    </>
  );

  if (departmentsRequest.error && departmentsRequest.type === REQUEST_TYPE.LIST) {
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
                  <Col sm={1}>
                    <Label for="Search">Clave:</Label>
                  </Col>
                  <Col sm={2}>
                    <Input
                      id="marca"
                      name="text"
                      placeholder=""
                      invalid={newDepartmentClaveInvalid}
                      type="text"
                      value={newDepartmentClave}
                      onChange={(e) => {
                        setNewDepartmentClave(e.target.value);
                        setNewDepartmentClaveInvalid(false);
                      }}
                    />
                  </Col>
                  <Col sm={2}>
                    <Label for="Search">Descripción:</Label>
                  </Col>
                  <Col sm={4}>
                    <Input
                      id="marca"
                      name="text"
                      placeholder=""
                      invalid={newDepartmentInvalid}
                      type="text"
                      value={newDepartment}
                      onChange={(e) => {
                        setNewDepartment(e.target.value);
                        setNewDepartmentInvalid(false);
                      }}
                    />
                  </Col>
                  <Col sm={3}>
                    <Button color="primary" onClick={() => handleAddDepartment()}>
                      Añadir Departamento
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
        {(departmentsRequest.type === REQUEST_TYPE.PUT || departmentsRequest.type === REQUEST_TYPE.POST) && departmentsRequest.loading ? (
          <>
            <h5>Guardando datos en el servidor . . .</h5>
            <Spinner />
          </>
        ) : null}

        {(departmentsRequest.type === REQUEST_TYPE.PUT || departmentsRequest.type === REQUEST_TYPE.POST) && departmentsRequest.error ? (
          <>
            <h5 className="text-danger">Ocurrio un error al guardar los datos ...</h5>
          </>
        ) : null}
        {departmentsRequest.type === REQUEST_TYPE.DELETE && departmentsRequest.error ? (
          <>
            <h5 className="text-danger">No se pudo eliminar el registro ...</h5>
          </>
        ) : null}
        <hr />

        {departmentsRequest.loading ? <Spinner /> : null}
        {departments.isLoaded && !departmentsRequest.loading ? renderDepartments() : null}
        <Modal delete isOpen={showDeleteConfirmation} onContinue={() => handleDeleteDepartment()} onCancel={() => setShowDeleteConfirmation(false)} />
        <Outlet />
      </>
    );
  }
};

export default Departments;
