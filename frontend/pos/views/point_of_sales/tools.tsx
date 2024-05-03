import { getLocalDate } from 'common/utils';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectSales, selectSalesRequestStatus, selectTicket } from 'pos/store/sales/sales_selectors';
import { deleteSale, getSale, listSales } from 'pos/store/sales/sales_thunk';
import React, { FC, useEffect, useState } from 'react';
import { Row, Col, Button, Table, Input, InputGroup, InputGroupText, Spinner } from 'reactstrap';
import { selectSaleDetail } from 'pos/store/sales/sales_selectors';
import { SaleListing, SalesDetail } from '../../store/sales/sales_slice';
import Modal from 'pos/components/forms/Modal';
import { PAYMENT_TYPE, REQUEST_TYPE } from 'common/constants';
import { PDFViewer } from 'pos/components/forms/pdf_viewer';

const PointOfSalesTools: FC = () => {
  const ticketURL = useAppSelector(selectTicket);
  const sales = useAppSelector(selectSales);
  const saleDetail = useAppSelector(selectSaleDetail);
  const salesRequest = useAppSelector(selectSalesRequestStatus);
  const [salesOrdered, setSalesOrdered] = useState([] as SaleListing[]);
  const [date, setDate] = useState(getLocalDate());
  const [showDevolucionTotalConfirmation, setShowDevolucionTotalConfirmation] = useState(false);
  const [idSelected, setIdSelected] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!salesRequest.loading) {
      dispatch(listSales(date));
    }
  }, [date]);

  useEffect(() => {
    if (salesRequest.success && salesRequest.type === REQUEST_TYPE.DELETE) {
      dispatch(listSales(date));
    }
    if (salesRequest.success && salesRequest.type === REQUEST_TYPE.LIST) {
      if (sales.data.length > 2) {
        const salesData = [...sales.data];
        setSalesOrdered(salesData.sort((a, b) => (a.fechaDeVenta && b.fechaDeVenta ? Date.parse(b.fechaDeVenta) - Date.parse(a.fechaDeVenta) : 0)));
      } else {
        setSalesOrdered([...sales.data]);
      }
    }
  }, [salesRequest]);

  useEffect(() => {
    if (idSelected !== '') {
      dispatch(getSale(idSelected));
    }
  }, [idSelected]);

  const handleDevolucionTotal = () => {
    dispatch(deleteSale(idSelected));
    setIdSelected('');
    setShowDevolucionTotalConfirmation(false);
  };

  const renderSalesTable = () => (
    <>
      <Table>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.isLoaded ? (
            sales.data.length > 0 ? (
              salesOrdered.map((s) => (
                <React.Fragment key={s.carrito}>
                  <tr onClick={() => setIdSelected(s.carrito)} className={idSelected !== '' && idSelected === s.carrito ? 'active-row table-info' : ''}>
                    <td>
                      {s.documentType}-{s.folio}
                      {s.OT ? ` (OT-${s.OT})` : null}
                      {s.cancelado ? (
                        <>
                          <span className="text-danger">
                            <i className="ri-error-warning-fill" />
                          </span>
                          <br />
                          <span className="text-danger">Cancelado</span>
                        </>
                      ) : null}
                    </td>
                    <td>{s.fechaDeVenta}</td>
                    <td>${parseFloat(s.Total).toFixed(2)}</td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <h5> No se encontraron registros</h5>
            )
          ) : (
            <Spinner />
          )}
        </tbody>
      </Table>
    </>
  );

  const renderSale = () => (
    <>
      <h5>
        Detalle del ticket - {saleDetail.data.documentType}
        {saleDetail.data.folio}
        {saleDetail.data.cancelado ? (
          <>
            <br />
            <span className="text-danger">
              <i className="ri-error-warning-fill" />
              Cancelado
            </span>
          </>
        ) : null}
      </h5>
      <p>Cliente: {saleDetail.data.cliente_name}</p>
      <p>Vendedor: {saleDetail.data.vendedor_name}</p>
      {saleDetail.data.OT ? <p>Orden de trabajo: OT-{saleDetail.data.OT}</p> : null}
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
          {saleDetail.data.carrito.partidas.map((p) => (
            <tr key={p.id}>
              <td>{p.cantidad}</td>
              <td>{p.modelo}</td>
              <td>{p.precioUnitario}</td>
              <td>${p.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-end">
        <p>Subtotal: ${saleDetail.data.Subtotal}</p>
        <p>IVA: ${saleDetail.data.IVA}</p>
        <p>IEPS: ${saleDetail.data.IEPS}</p>
        <h6>
          <strong>Total: ${saleDetail.data.Total}</strong>
        </h6>
        <hr />
        {saleDetail.data.detalle_pago ? (
          <>
            <p>Forma de pago: {saleDetail.data.detalle_pago.formaDePago}</p>
            {saleDetail.data.detalle_pago.formaDePago === PAYMENT_TYPE.EFECTIVO.value ? (
              <>
                <p>Monto efectivo: {saleDetail.data.detalle_pago.montoEfectivo}</p>
                <p>Cambio efectivo: {saleDetail.data.detalle_pago.montoCambioEfectivo}</p>
              </>
            ) : (
              <>
                <p>Banco: {saleDetail.data.detalle_pago.banco}</p>
                <p>Referencia: {saleDetail.data.detalle_pago.referencia}</p>
              </>
            )}
          </>
        ) : null}
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        {!saleDetail.data.cancelado ? (
          <Button color="danger" onClick={() => setShowDevolucionTotalConfirmation(true)}>
            Devolucion Total
          </Button>
        ) : null}
        <PDFViewer url={saleDetail.data.ticket} autoOpen={false} />
      </div>
    </>
  );

  return (
    <>
      <div className="pos-tools container">
        <Row className="align-items-center justify-content-between">
          <Col sm={7}>
            <InputGroup>
              <InputGroupText>Fecha y Hora:</InputGroupText>
              <Input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
            </InputGroup>
          </Col>
        </Row>
        <br />
        <Row>
          <div className="d-flex tickets-workspace">
            <Col className="tickets-table">{renderSalesTable()}</Col>
            <div className="vr me-4 ms-4"></div>
            <Col>{saleDetail.isLoaded ? renderSale() : null}</Col>
          </div>
        </Row>
      </div>
      <Modal delete isOpen={showDevolucionTotalConfirmation} onContinue={() => handleDevolucionTotal()} onCancel={() => setShowDevolucionTotalConfirmation(false)} />
    </>
  );
};

export default PointOfSalesTools;
