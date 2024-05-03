import React, { FC, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectCustomerDetail, selectCustomerRequestStatus } from 'pos/store/customers/customers_selectors';
import { getCustomer, postCustomer, putCustomer, deleteCustomer } from 'pos/store/customers/customers_thunk';
import { Customer } from 'pos/store/customers/customers_slice';
import Spinner from 'pos/components/spinner';
import { Input } from 'pos/components/forms/Input';
import { Form, FormGroup, Label, Col, Button, ButtonToolbar, ButtonGroup, Row } from 'reactstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { paths, REQUEST_TYPE } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';
import Modal from 'pos/components/forms/Modal';

const CustomerEditor: FC = () => {
  const { id } = useParams();
  const isNew = useLocation().pathname.endsWith('manager/new');
  const { success: success, loading: isLoading, error: isRejected, type: requestType } = useAppSelector(selectCustomerRequestStatus);
  const { data: customer, isLoaded: isLoaded } = useAppSelector(selectCustomerDetail);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<Customer>();

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  useEffect(() => {
    if (!isLoaded && !isLoading && id && !isNew) {
      dispatch(getCustomer(id));
    }
    if (isNew) {
      reset({ razonSocial: '' } as Customer);
    }
  }, [id, isLoaded, isLoading, isNew]);

  useEffect(() => {
    if (isLoaded && !isLoading && !isNew) {
      reset(customer);
    }
  }, [customer, isLoading, isLoaded, reset]);

  useEffect(() => {
    if ((requestType === REQUEST_TYPE.PUT || requestType === REQUEST_TYPE.POST) && success && isSubmitted) {
      handleReturn();
    }
  }, [requestType, requestType, success, isSubmitted]);

  const handleReturn = () => navigate('../' + paths.client.CUSTOMER_MANAGER.CUSTOMER_MANAGER, { replace: true });

  const onSubmit: SubmitHandler<Customer> = (data) => {
    if (!((requestType === REQUEST_TYPE.PUT || requestType === REQUEST_TYPE.POST) && isLoading) && isDirty) {
      if (isNew) {
        dispatch(postCustomer(data));
      } else {
        if (id) {
          dispatch(putCustomer({ id: id, data: data }));
        }
      }
    } else {
      alert('Ocurrio un error, intentelo de nuevo');
      reset(data);
    }
  };

  const handleDelete = () => {
    if (id) {
      dispatch(deleteCustomer(id));
      handleReturn();
    }
  };

  if (isLoaded || isNew) {
    return (
      <>
        <h1>{isNew ? `Cliente nuevo: ${watch('razonSocial')}` : `Cliente (${customer.id_client}): ${customer.razonSocial}`}</h1>
        {(requestType === REQUEST_TYPE.PUT || requestType === REQUEST_TYPE.POST) && isLoading ? (
          <>
            <h5>Guardando datos en el servidor . . .</h5>
            <Spinner />
          </>
        ) : null}

        {(requestType === REQUEST_TYPE.PUT || requestType === REQUEST_TYPE.POST) && isRejected ? (
          <>
            <h5 className="text-danger">Ocurrio un error al guardar los datos ...</h5>
          </>
        ) : null}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <hr />
          <ButtonToolbar>
            <ButtonGroup className="me-3">
              <Button color="primary" onClick={() => (isDirty && !isSubmitted ? setShowExitConfirmation(true) : handleReturn())}>
                Regresar
              </Button>
            </ButtonGroup>
            <ButtonGroup className="me-3">
              <Button type="submit" color="success">
                Guardar
              </Button>
            </ButtonGroup>
            {!isNew ? (
              <ButtonGroup>
                <Button color="danger" onClick={() => handleDelete()}>
                  Eliminar
                </Button>
              </ButtonGroup>
            ) : null}
          </ButtonToolbar>
          <hr />
          <FormGroup row>
            <Label sm={2} for="razonSocial">
              Razón Social
            </Label>
            <Col sm={10}>
              {/* <Input type="text" name="razonSocial" id="razonSocial" value={customer.razonSocial register('razonSocial', { required: true })} /> */}
              {Input(errors.razonSocial, isDirty, register('razonSocial', { required: 'Este campo es obligatorio' }))}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="RFC">
              RFC
            </Label>
            <Col sm={10}>{Input(errors.RFC, isDirty, register('RFC', { required: 'Este campo es obligatorio' }))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="regimen_fiscal">
              Régimen Fiscal
            </Label>
            <Col sm={10}>{Input(errors.regimen_fiscal, isDirty, register('regimen_fiscal', { required: 'Este campo es obligatorio' }))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="regimen_fiscal">
              Observaciones
            </Label>
            <Col sm={10}>{Input(errors.observaciones, isDirty, register('observaciones'))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="cp">
              Código Postal
            </Label>
            <Col sm={10}>{Input(errors.cp, isDirty, register('cp', { required: 'Este campo es obligatorio' }), 'text')}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="email">
              Email
            </Label>
            <Col sm={10}>{Input(errors.email, isDirty, register('email', { required: 'Este campo es obligatorio' }), 'email')}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="telefono_movil">
              Teléfono Móvil
            </Label>
            <Col sm={10}>{Input(errors.telefono_movil, isDirty, register('telefono_movil', { required: 'Este campo es obligatorio' }))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="calle">
              Calle
            </Label>
            <Col sm={10}>{Input(errors.calle, isDirty, register('calle'))}</Col>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup row>
                <Label sm={4} for="no_ext">
                  No. Ext.
                </Label>
                <Col sm={7}>{Input(errors.no_ext, isDirty, register('no_ext'))}</Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup row>
                <Label sm={2} for="no_int">
                  No. Int.
                </Label>
                <Col sm={10}>{Input(errors.no_int, isDirty, register('no_int'))}</Col>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Label sm={2} for="colonia">
              Colonia
            </Label>
            <Col sm={10}>{Input(errors.colonia, isDirty, register('colonia'))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="localidad">
              Localidad
            </Label>
            <Col sm={10}>{Input(errors.localidad, isDirty, register('localidad'))}</Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2} for="municipio">
              Municipio
            </Label>
            <Col sm={10}>{Input(errors.municipio, isDirty, register('municipio'))}</Col>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup row>
                <Label sm={4} for="estado">
                  Estado
                </Label>
                <Col sm={7}>{Input(errors.estado, isDirty, register('estado'))}</Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup row>
                <Label sm={2} for="pais">
                  País
                </Label>
                <Col sm={10}>{Input(errors.pais, isDirty, register('pais'))}</Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>

        <Modal isOpen={isDirty && !isSubmitted && showExitConfirmation} onContinue={() => handleReturn()} onCancel={() => setShowExitConfirmation(false)} />
      </>
    );
  }
  if (requestType === REQUEST_TYPE.GET && isLoading) {
    return (
      <>
        <Spinner />
      </>
    );
  }
  if (requestType === REQUEST_TYPE.GET && isRejected) {
    return (
      <>
        <ErrorMesssage title="Editor de clientes" />
      </>
    );
  }
};

export default CustomerEditor;
