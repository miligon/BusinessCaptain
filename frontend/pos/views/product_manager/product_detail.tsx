import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectProductDetail } from 'pos/store/products/products_selectors';
import React, { FC, useEffect, useState } from 'react';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import {
  Input as InputReactstrap,
  Button,
  Col,
  Row,
  Spinner,
  Form,
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  FormGroup,
  Label,
  InputGroupText,
  InputGroup,
  ButtonGroup,
  Table,
  Collapse,
  Card,
  CardBody,
  FormFeedback,
} from 'reactstrap';
import { selectProductsRequestStatus } from '../../store/products/products_selectors';
import ErrorMesssage from 'pos/components/error_message';
import { deleteProduct, getProduct, listProducts, postProduct, putProduct } from 'pos/store/products/products_thunk';
import { paths, REQUEST_TYPE } from 'common/constants';
import Select from 'react-select';
import { Input } from 'pos/components/forms/Input';
import { selectBrands, selectBrandsRequestStatus } from 'pos/store/brands/brands_selectors';
import { listBrands } from 'pos/store/brands/brands_thunk';
import { selectDepartments, selectDepartmentsRequestStatus } from 'pos/store/departments/departments_selectors';
import { listDepartments } from 'pos/store/departments/departments_thunk';
import { selectProductCategories, selectProductCategoriesRequestStatus } from 'pos/store/product_categories/product_categories_selectors';
import { listProductCategories } from 'pos/store/product_categories/product_categories_thunk';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Codigo, Producto } from 'pos/store/products/products_slice';
import { generateBarcode } from 'common/utils';
import Modal from 'pos/components/forms/Modal';

const ProductDetails: FC = () => {
  const { id: id_producto } = useParams();
  const basePath = paths.client.APP_BASE + '/' + paths.client.PRODUCT_MANAGER.BASE + '/';
  const matchDetails = useMatch(basePath + paths.client.PRODUCT_MANAGER.PRODUCT_DETAILS);
  const isNew = useMatch(basePath + paths.client.PRODUCT_MANAGER.PRODUCT_NEW) ? true : false;

  const producto = useAppSelector(selectProductDetail);
  const productStatus = useAppSelector(selectProductsRequestStatus);
  const departments = useAppSelector(selectDepartments);
  const departmentsRequest = useAppSelector(selectDepartmentsRequestStatus);
  const brands = useAppSelector(selectBrands);
  const brandsRequest = useAppSelector(selectBrandsRequestStatus);
  const categories = useAppSelector(selectProductCategories);
  const categoriesRequest = useAppSelector(selectProductCategoriesRequestStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [productoModified, setProductoModified] = useState(producto.data);
  const [inputCodebar, setInputCodebar] = useState('');
  const [inputCodebarInvalid, setInputCodebarInvalid] = useState(false);
  const [codebars, setCodebars] = useState([] as Codigo[]);
  const [publicacionImpresa, setPublicacionImpresa] = useState(false);

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitted, isSubmitting },
  } = useForm<Producto>({ defaultValues: productoModified });

  useEffect(() => {
    if (!producto.isLoaded && !productStatus.loading && !isNew && id_producto) {
      dispatch(getProduct(id_producto));
    }
    if (!producto.isLoaded && !productStatus.loading && matchDetails && id_producto) {
      dispatch(getProduct(id_producto));
    }
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
    if (!isSubmitting) {
      if (producto.isLoaded && !isNew) {
        setProductoModified(producto.data);
        setPublicacionImpresa(producto.data.PubImpresaInfo ? true : false);
        setCodebars(producto.data.codigos);
        reset(producto.data);
      }
    }
  }, [producto, isNew]);

  useEffect(() => {
    if (!isSubmitting) {
      if (isNew) {
        const initialValues: unknown = { costo: 0, tasaIVA: 0.16, tasaIEPS: 0, departamento: null, marca: null, familia: null, modelo: '', sku: '', claveSAT: '', precio: '', PubImpresaInfo: { editorial: '', autorPrincipal: '' } };
        setProductoModified(initialValues as Producto);
        setPublicacionImpresa(false);
        setCodebars([]);
        reset(initialValues as Producto);
      }
    }
  }, []);

  const calcCostWithTaxes = () => {
    const costo = typeof watch('costo') === 'string' ? parseFloat(watch('costo').toString()) : watch('costo');
    const tasaIVA = typeof watch('tasaIVA') === 'string' ? parseFloat(watch('tasaIVA').toString()) : watch('tasaIVA');
    const tasaIEPS = typeof watch('tasaIEPS') === 'string' ? parseFloat(watch('tasaIEPS').toString()) : watch('tasaIEPS');

    const resultado: number = costo + costo * tasaIVA + costo * tasaIEPS;

    return resultado.toFixed(2);
  };

  const handleDeleteCodebar = (codigo: string) => setCodebars([...codebars.filter((c) => c.codigo !== codigo)]);

  const handleAddCodebar = () => {
    const newCodebars = codebars;
    if (newCodebars.find((c) => c.codigo === inputCodebar) || inputCodebar === '') {
      setInputCodebarInvalid(true);
      return;
    }

    setCodebars([...newCodebars, { codigo: inputCodebar }]);
  };

  const onSubmit: SubmitHandler<Producto> = (data) => {
    const costo = typeof watch('costo') === 'string' ? parseFloat(watch('costo').toString()) : watch('costo');
    const tasaIVA = typeof watch('tasaIVA') === 'string' ? parseFloat(watch('tasaIVA').toString()) : watch('tasaIVA');
    const tasaIEPS = typeof watch('tasaIEPS') === 'string' ? parseFloat(watch('tasaIEPS').toString()) : watch('tasaIEPS');
    const precio = typeof watch('precio') === 'string' ? parseFloat(watch('precio').toString()) : watch('precio');
    const producto = { ...data, costo: costo, tasaIVA: tasaIVA, tasaIEPS: tasaIEPS, precio: precio, codigos: codebars, PubImpresaInfo: publicacionImpresa ? data.PubImpresaInfo : null };
    console.log(producto);
    if (isNew) {
      dispatch(postProduct(producto));
    } else {
      dispatch(putProduct({ id: producto.id.toString(), data: producto }));
    }
    return;
  };

  const handleReturn = () => navigate('../' + paths.client.PRODUCT_MANAGER.PRODUCT_SEARCH, { replace: true });

  useEffect(() => {
    if ((productStatus.type === REQUEST_TYPE.PUT || productStatus.type === REQUEST_TYPE.POST) && productStatus.success && isSubmitted) {
      handleReturn();
    }
    if (productStatus.type === REQUEST_TYPE.DELETE && productStatus.success) {
      dispatch(listProducts());
      handleReturn();
    }
  }, [productStatus, isSubmitted]);

  const handleDelete = () => {
    if (id_producto) {
      dispatch(deleteProduct(id_producto));
    }
  };

  const handleKeyDownOnCode = (code: string) => {
    if (code === 'Enter' || code === 'NumpadEnter') {
      handleAddCodebar();
      setInputCodebar('');
    }
  };

  const renderEditor = () => (
    <>
      <Form>
        <UncontrolledAccordion className="product-editor" toggle={(c) => c} defaultOpen={publicacionImpresa ? ['1', '2', '3', '4'] : ['1', '2', '3']} stayOpen>
          <AccordionItem>
            <AccordionHeader targetId="1">Clasificación</AccordionHeader>
            <AccordionBody accordionId="1">
              Departamento:
              <Controller
                name="departamento"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable
                    isLoading={departmentsRequest.loading}
                    placeholder="Departamento"
                    options={departments.data.map((c) => ({
                      value: c.id,
                      label: c.clave,
                    }))}
                    value={{ value: field.value, label: departments.data.find((d) => d.id === field.value)?.clave }}
                    onChange={(e) => field.onChange(e?.value)}
                  />
                )}
              />
              <br />
              Categoria:
              <Controller
                name="familia"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable
                    isLoading={categoriesRequest.loading}
                    placeholder="Categoria"
                    options={categories.data.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={{ value: field.value, label: categories.data.find((d) => d.id === field.value)?.name }}
                    onChange={(e) => field.onChange(e?.value)}
                  />
                )}
              />
              <br />
              Marca:
              <Controller
                name="marca"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable
                    isLoading={brandsRequest.loading}
                    placeholder="Marca"
                    options={brands.data.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={{ value: field.value, label: brands.data.find((d) => d.id === field.value)?.name }}
                    onChange={(e) => field.onChange(e?.value)}
                  />
                )}
              />
              <br />
              <Row>
                <Col sm={12}>
                  <FormGroup>
                    <Label>Modelo:</Label>
                    {Input(errors.modelo, isDirty, register('modelo', { required: 'Este campo es obligatorio' }))}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <Label>SKU:</Label>
                    {isNew ? Input(errors.sku, isDirty, register('sku', { required: 'Este campo es obligatorio' })) : <InputReactstrap readOnly value={producto.data.sku} type="text" />}
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <Label>Clave SAT:</Label>
                    {Input(errors.claveSAT, isDirty, register('claveSAT', { required: 'Este campo es obligatorio' }))}
                  </FormGroup>
                </Col>
              </Row>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="2">Económico</AccordionHeader>
            <AccordionBody accordionId="2">
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Costo sin IVA</Label>
                    <InputGroup>
                      <InputGroupText>$</InputGroupText>
                      {Input(errors.costo, isDirty, { ...register('costo', { required: 'Este campo es obligatorio', min: 0 }), step: 0.01, min: 0.0 }, 'number')}
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Tasa IVA (0.0 - 1.0)</Label>
                    {Input(errors.tasaIVA, isDirty, { ...register('tasaIVA', { required: 'Este campo es obligatorio', max: 1.0, min: 0 }), max: 1.0, step: 0.01, min: 0.0 }, 'number')}
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Tasa IEPS (0.0 - 1.0)</Label>
                    {Input(errors.tasaIEPS, isDirty, { ...register('tasaIEPS', { required: 'Este campo es obligatorio', max: 1.0, min: 0 }), max: 1.0, step: 0.01, min: 0.0 }, 'number')}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Costo con IVA</Label>
                    <InputGroup>
                      <InputGroupText>$</InputGroupText>
                      <InputReactstrap readOnly value={calcCostWithTaxes()} type="number" />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Precio IVA incluido</Label>
                    <InputGroup>
                      <InputGroupText>$</InputGroupText>
                      {Input(errors.precio, isDirty, { ...register('precio', { required: 'Este campo es obligatorio', min: 0 }), step: 0.01, min: 0.0 }, 'number')}
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="3">Códigos del producto</AccordionHeader>
            <AccordionBody accordionId="3">
              <Row>
                <Col sm={8}>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupText>Codigo UPC:</InputGroupText>
                      <InputReactstrap
                        invalid={inputCodebarInvalid}
                        value={inputCodebar}
                        onChange={(e) => {
                          setInputCodebar(e.target.value);
                          setInputCodebarInvalid(false);
                        }}
                        onKeyDown={(e) => handleKeyDownOnCode(e.code)}
                      />
                      <FormFeedback>Código invalido o ya en uso</FormFeedback>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <ButtonGroup>
                    <Button onClick={() => handleAddCodebar()}>Añadir</Button>
                    <Button onClick={() => setInputCodebar(generateBarcode())}>Generar</Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Codigo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {codebars.map((c) => (
                        <tr key={c.codigo}>
                          <td>{c.codigo}</td>
                          <td>
                            <Button onClick={() => handleDeleteCodebar(c.codigo)}>
                              <i className="ri-close-circle-line" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <br />
                </Col>
              </Row>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader targetId="4">Clasificación adicional</AccordionHeader>
            <AccordionBody accordionId="4">
              <input
                type="checkbox"
                name=""
                id="pubImpresa"
                onChange={() => {
                  setPublicacionImpresa(!publicacionImpresa);
                }}
                checked={publicacionImpresa}
              />
              <label htmlFor="pubImpresa">Publicación impresa</label>
              <Collapse isOpen={publicacionImpresa}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col sm={6}>
                        <FormGroup>
                          <Label>Editorial:</Label>
                          {Input(errors.PubImpresaInfo?.editorial, isDirty, register('PubImpresaInfo.editorial', publicacionImpresa ? { required: 'Este campo es obligatorio' } : {}))}
                        </FormGroup>
                      </Col>
                      <Col sm={6}>
                        <FormGroup>
                          <Label>Autor:</Label>
                          {Input(errors.PubImpresaInfo?.autorPrincipal, isDirty, register('PubImpresaInfo.autorPrincipal', publicacionImpresa ? { required: 'Este campo es obligatorio' } : {}))}
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Collapse>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
      </Form>
    </>
  );

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <Button onClick={() => (isDirty && !isSubmitted ? setShowExitConfirmation(true) : handleReturn())}>
          <i className="ri-arrow-left-line" />
          Regresar
        </Button>
        <h3>Editor de productos</h3>
        <Button color="success" onClick={handleSubmit(onSubmit)}>
          Guardar
          <i className="ri-save-3-fill" />
        </Button>
      </div>
      {(productStatus.type === REQUEST_TYPE.PUT || productStatus.type === REQUEST_TYPE.POST) && productStatus.loading ? (
        <>
          <h5>Guardando datos en el servidor . . .</h5>
          <Spinner />
        </>
      ) : null}

      {(productStatus.type === REQUEST_TYPE.PUT || productStatus.type === REQUEST_TYPE.POST) && productStatus.error ? (
        <>
          <h5 className="text-danger">Ocurrio un error al guardar los datos ...</h5>
        </>
      ) : null}
      <hr />
      {productStatus.loading ? <Spinner /> : null}
      {productStatus.error ? <ErrorMesssage title="Editor de productos" /> : null}
      <div className="product-editor-container">
        {producto.isLoaded || isNew ? renderEditor() : null}
        <br />
        <Button onClick={() => setShowDeleteConfirmation(true)} color="danger">
          <i className="ri-delete-bin-6-line" />
          Eliminar
        </Button>
      </div>
      <Modal delete isOpen={showDeleteConfirmation} onContinue={() => handleDelete()} onCancel={() => setShowDeleteConfirmation(false)} />
      <Modal isOpen={isDirty && !isSubmitted && showExitConfirmation} onContinue={() => handleReturn()} onCancel={() => setShowExitConfirmation(false)} />
      <Outlet />
    </>
  );
};

export default ProductDetails;
