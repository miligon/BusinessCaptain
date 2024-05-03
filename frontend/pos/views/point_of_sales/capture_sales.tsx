import { DOCUMENT_TYPE, PAYMENT_MOD, PAYMENT_TYPE, REQUEST_TYPE, searchProductFilter } from 'common/constants';
import { selectCustomerRequestStatus, selectCustomers } from 'pos/store/customers/customers_selectors';
import { listCustomer } from 'pos/store/customers/customers_thunk';
import { Customer } from 'pos/store/customers/customers_slice';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectSellers, selectSellersRequestStatus } from 'pos/store/sellers/sellers_selectors';
import { listSellers } from 'pos/store/sellers/sellers_thunk';
import React, { FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Select from 'react-select';
import { Row, InputGroup, InputGroupText, Col, Table, Button, Input } from 'reactstrap';
import { SaleCaptureFormat, SalesRecords } from 'pos/store/sales/sales_slice';
import ModalProdsSearch from 'pos/components/forms/modal_prods_search';
import { ProductList } from 'pos/store/products/products_slice';
import { listProducts } from 'pos/store/products/products_thunk';
import { selectProducts, selectProductsRequestStatus } from 'pos/store/products/products_selectors';
import { getLocalDateTime } from 'common/utils';
import ModalCobro from 'pos/components/forms/modal_cobro';

interface CaptureSale {
  dateTime: string;
  vendedor: { value: number; label: string } | null;
  cliente: { value: number; label: string } | null;
  docType: { value: string; label: string } | null;
  infoPago: {
    forma: { value: string; label: string } | null;
    modo: string;
    monto: number;
    montoEfectivo: number;
    cambioEfectivo: number;
  };
  partidas: SalesRecords[];
  observaciones: string;
  productos?: ProductList[];
}

const CaptureSales: FC = () => {
  const docTypes = [DOCUMENT_TYPE.TICKET, DOCUMENT_TYPE.NOTA_DE_VENTA, DOCUMENT_TYPE.ORDEN_DE_TRABAJO];
  const paymentType = [PAYMENT_TYPE.EFECTIVO, PAYMENT_TYPE.TRANSFERENCIA_BANCARIA, PAYMENT_TYPE.CHEQUE, PAYMENT_TYPE.TARJETA_CREDITO, PAYMENT_TYPE.TARJETA_DEBITO];

  const initialData: CaptureSale = {
    dateTime: getLocalDateTime(),
    vendedor: null,
    cliente: null,
    docType: DOCUMENT_TYPE.TICKET,
    infoPago: {
      forma: PAYMENT_TYPE.EFECTIVO,
      modo: PAYMENT_MOD.UNA_EXHIBICION.value,
      monto: 0.0,
      montoEfectivo: 0.0,
      cambioEfectivo: 0.0,
    },
    partidas: [] as SalesRecords[],
    observaciones: '',
    productos: [] as ProductList[],
  };

  const sellers = useAppSelector(selectSellers);
  const sellersStatus = useAppSelector(selectSellersRequestStatus);
  const customers = useAppSelector(selectCustomers);
  const customersStatus = useAppSelector(selectCustomerRequestStatus);
  const products = useAppSelector(selectProducts);
  const productsStatus = useAppSelector(selectProductsRequestStatus);
  const dispatch = useAppDispatch();

  const [selectProductOpen, setSelectProductOpen] = useState(false);
  const [selectCobroOpen, setCobroOpen] = useState(false);
  const [saleCaptureData, setSaleCaptureData] = useState({} as SaleCaptureFormat);
  const [currentSale, setCurrentSale] = useState(initialData);
  const [clockActive, setClockActive] = useState(true);
  const [dateTime, setDateTime] = useState(getLocalDateTime());
  const [searchKeywords, setSearchKeywords] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [searchCode, setSearchCode] = useState(false);
  const [searchInvalid, setSearchInvalid] = useState(false);

  const lastRowRef = React.createRef<HTMLTableRowElement>();
  const busquedaRef = React.createRef<HTMLInputElement>();

  useEffect(() => {
    if (!sellers.isLoaded && !sellersStatus.loading) {
      dispatch(listSellers());
    }
    if (!customers.isLoaded && !customersStatus.loading) {
      dispatch(listCustomer());
    }
  }, []);

  useEffect(() => {
    let intervalId = 0;

    if (clockActive) {
      intervalId = setInterval(() => {
        setDateTime(getLocalDateTime());
      }, 60000);
    }

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [clockActive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeDate = (e: any) => {
    let date = e.target.value;
    date = date.length === 16 ? date + ':00' : date;
    setDateTime(date);
    setClockActive(false);
  };

  const handleResetPOS = () => {
    setClockActive(true);
    setDateTime(getLocalDateTime());
    setCurrentSale(initialData);
    setCobroOpen(false);
    setSearchKeywords('');
    setObservaciones('');
    busquedaRef.current?.focus();
    busquedaRef.current?.select();
  };

  useEffect(() => {
    if (productsStatus.success && productsStatus.type === REQUEST_TYPE.LIST && searchCode) {
      if (products.count === 1) {
        handleProductSelect(products.results[0]);
      } else {
        setSearchInvalid(true);
      }
    }
  }, [productsStatus, searchCode]);

  useEffect(() => {
    window.onbeforeunload = function () {
      return true;
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const handleKeyDownOnSearch = (code: string) => {
    if (code === 'ArrowDown') {
      setSelectProductOpen(true);
    }
    if (code === 'Enter' || code === 'NumpadEnter') {
      setSearchCode(true);
      dispatch(listProducts({ ...searchProductFilter, codigo: searchKeywords }));
    }
    if (code === 'F8') {
      handleCobrar();
    }
  };

  const handleProductSelect = (p: ProductList) => {
    const productos = currentSale.productos || [];
    const newSale = {
      ...currentSale,
      partidas: [
        ...currentSale.partidas,
        {
          id: p.id,
          cantidad: 1,
          precioUnitario: p.precio,
          precioTotal: p.precio,
        },
      ],
      productos: [...productos, { ...p }],
    };
    const partidas = [...newSale.partidas];
    newSale.infoPago.monto = 0.0;
    partidas.forEach((p) => (newSale.infoPago.monto += p.precioTotal));
    setCurrentSale(newSale);
    if (lastRowRef.current) {
      lastRowRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
    setSelectProductOpen(false);
    busquedaRef.current?.focus();
    busquedaRef.current?.select();
  };

  const handleChangeQty = (id: number, qty: string) => {
    const cantidad = parseFloat(qty);
    const index = currentSale.partidas.findIndex((p) => p.id === id);
    const partidas = [...currentSale.partidas];
    const infoPago = { ...currentSale.infoPago };
    if (index > -1) {
      partidas[index].cantidad = Math.round(cantidad * 1000) / 1000;
      partidas[index].precioTotal = Math.round(cantidad * partidas[index].precioUnitario * 100) / 100;
      infoPago.monto = 0.0;
      partidas.forEach((p) => (infoPago.monto += p.precioTotal));
      setCurrentSale({
        ...currentSale,
        partidas: [...partidas],
        infoPago: infoPago,
      });
    }
  };

  const handleChangePrice = (id: number, price: string) => {
    const precio = parseFloat(price);
    const index = currentSale.partidas.findIndex((p) => p.id === id);
    const partidas = [...currentSale.partidas];
    const infoPago = { ...currentSale.infoPago };
    if (index > -1) {
      partidas[index].precioUnitario = Math.round(precio * 100) / 100;
      partidas[index].precioTotal = Math.round(partidas[index].cantidad * partidas[index].precioUnitario * 100) / 100;
      infoPago.monto = 0.0;
      partidas.forEach((p) => p.precioTotal && (infoPago.monto += p.precioTotal));
      setCurrentSale({
        ...currentSale,
        partidas: [...partidas],
        infoPago: infoPago,
      });
    }
  };

  const handleDelete = (index: number) => {
    const partidas = currentSale.partidas.filter((p, i) => p && i !== index);
    const infoPago = { ...currentSale.infoPago };
    const productos = currentSale.productos || [];
    if (index > -1) {
      infoPago.monto = 0.0;
      partidas.forEach((p) => (infoPago.monto += p.precioTotal));
      setCurrentSale({
        ...currentSale,
        partidas: partidas,
        productos: productos.filter((p, i) => p && i !== index),
        infoPago: infoPago,
      });
    }
  };

  const handleCobrar = () => {
    if (currentSale.cliente && currentSale.docType && currentSale.vendedor && currentSale.partidas.length > 0 && currentSale.infoPago.forma && dateTime) {
      const newSale = {
        ...currentSale,
        dateTime: dateTime,
        cliente: currentSale.cliente.value,
        docType: currentSale.docType.value,
        vendedor: currentSale.vendedor.value,
        infoPago: { ...currentSale.infoPago, forma: currentSale.infoPago.forma.value },
        observaciones: currentSale.cliente.value === 1 ? observaciones : '',
      };
      delete newSale.productos;
      console.log(newSale);

      if (
        ([PAYMENT_TYPE.TRANSFERENCIA_BANCARIA.value, PAYMENT_TYPE.CHEQUE.value, PAYMENT_TYPE.TARJETA_CREDITO.value, PAYMENT_TYPE.TARJETA_DEBITO.value].includes(newSale.infoPago.forma) && [DOCUMENT_TYPE.TICKET.value].includes(newSale.docType)) ||
        (!currentSale.cliente.label.includes('PUBLICO GENERAL') && [DOCUMENT_TYPE.TICKET.value].includes(newSale.docType))
      ) {
        window.alert('Seleccione como tipo de venta: Nota de Venta u Orden de Trabajo');
        return;
      }
      setSaleCaptureData(newSale as SaleCaptureFormat);
      setCobroOpen(true);
    } else {
      window.alert('Complete los datos o capture productos');
    }
  };

  const getCustomerLabel = (c: Customer) => {
    let label = c.observaciones !== '' ? c.razonSocial + ' - ' + c.observaciones : c.razonSocial;
    label = label + (c.regimen_fiscal.includes('NO ACTUALIZADO') ? ' - NO ACTUALIZADO' : '');
    return label;
  };

  return (
    <>
      <div className="pos container">
        <br />
        <Row className="align-items-center">
          <Col sm={4}>
            <span>Fecha y Hora:</span>
            <Input value={dateTime} onChange={(e) => handleChangeDate(e)} type="datetime-local" />
          </Col>
          <Col sm={4}>
            <span>Tipo de venta: </span>
            <Select options={docTypes} value={currentSale.docType} onChange={(e) => setCurrentSale({ ...currentSale, docType: e })} isClearable isLoading={false} placeholder="Tipo de venta" />
          </Col>
          <Col sm={4}>
            <span>Vendedor: </span>
            <Select
              options={sellers.data.map((s) => ({
                value: s.id,
                label: s.first_name,
              }))}
              value={currentSale.vendedor}
              onChange={(e) => setCurrentSale({ ...currentSale, vendedor: e })}
              isClearable
              isLoading={!sellers.isLoaded}
              placeholder="Vendedor"
            />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col>
            <span>Cliente: </span>
            <Select
              options={customers.data.map((c) => ({
                value: c.id_client,
                label: getCustomerLabel(c),
              }))}
              value={currentSale.cliente}
              onChange={(e) => setCurrentSale({ ...currentSale, cliente: e })}
              isClearable
              isLoading={!customers.isLoaded}
              placeholder="Cliente"
            />
          </Col>
          <Col>
            <span>Forma de Pago: </span>
            <Select options={paymentType} value={currentSale.infoPago.forma} onChange={(e) => setCurrentSale({ ...currentSale, infoPago: { ...currentSale.infoPago, forma: e } })} isClearable isLoading={false} placeholder="Forma de Pago" />
          </Col>
        </Row>
        {currentSale.cliente?.label.includes('PUBLICO GENERAL') ? (
          <Row>
            <InputGroup>
              <InputGroupText>
                Nombre del cliente
                <br />u observaciones:
              </InputGroupText>
              <Input type="text" value={observaciones} onChange={(e) => setObservaciones(e.currentTarget.value)} />
            </InputGroup>
          </Row>
        ) : null}
        <div className="pt-3">
          <InputGroup>
            <InputGroupText>
              <strong>Buscar producto:</strong>
            </InputGroupText>
            <Input
              innerRef={busquedaRef}
              className="search-box"
              type="text"
              value={searchKeywords}
              onChange={(e) => {
                setSearchInvalid(false);
                setSearchKeywords(e.target.value);
              }}
              invalid={searchInvalid}
              onKeyDown={(e) => handleKeyDownOnSearch(e.code)}
            />
          </InputGroup>
          <div className="pos-products-table">
            <Table hover>
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentSale.partidas.map((p, index) => (
                  <tr key={index} ref={currentSale.partidas.length - 1 === index ? lastRowRef : null}>
                    <td>
                      <Input step={0.001} min={0} value={p.cantidad} onChange={(e) => p.id && handleChangeQty(p.id, e.target.value)} type="number" />
                    </td>
                    <td>{currentSale.productos ? currentSale.productos[index].producto : ''}</td>
                    <td>
                      <Input step={0.01} min={0} value={p.precioUnitario} onChange={(e) => p.id && handleChangePrice(p.id, e.target.value)} type="number" />
                    </td>
                    <td>${p.precioTotal ? p.precioTotal.toFixed(2) : 0.0}</td>
                    <td>
                      <Button onClick={() => p.id && handleDelete(index)}>
                        <i className="ri-delete-bin-6-line" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <br />
          <Row>
            <Col className="d-flex justify-content-center">
              <Button className="pay-button" onClick={() => handleCobrar()}>
                <i className="ri-currency-line" />
                Cobrar
              </Button>
            </Col>
            <Col>
              <div className="total-summary">
                <InputGroup className="total-input">
                  <InputGroupText>
                    <strong>Total: $</strong>
                  </InputGroupText>
                  <Input readOnly value={currentSale.infoPago.monto.toFixed(2)} type="number" />
                </InputGroup>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <ModalProdsSearch initialfilterkeyword={searchKeywords} isOpen={selectProductOpen} onContinue={(e) => handleProductSelect(e)} onCancel={() => setSelectProductOpen(false)} />
      <ModalCobro saleData={saleCaptureData} isOpen={selectCobroOpen} onFinish={() => handleResetPOS()} onCancel={() => setCobroOpen(false)} />
      <Outlet />
    </>
  );
};

export default CaptureSales;
