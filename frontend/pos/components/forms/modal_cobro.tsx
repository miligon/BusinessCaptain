import React, { FC, useEffect, useRef, useState, memo } from 'react';
import { Modal as ModalReactstrap, ModalHeader, ModalBody, ModalFooter, Button, Col, Input, InputGroup, InputGroupText, Label, Row, Table } from 'reactstrap';
import ProductsTable from './products_table';
import { useDebounce } from 'use-debounce';
import { PAYMENT_TYPE, REQUEST_TYPE, searchProductFilter } from 'common/constants';
import { ProductList } from 'pos/store/products/products_slice';
import Select from 'react-select';
import sales_slice, { SaleCaptureFormat } from 'pos/store/sales/sales_slice';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { postSale } from 'pos/store/sales/sales_thunk';
import { selectSalesRequestStatus, selectTicket } from 'pos/store/sales/sales_selectors';
import { PDFViewer } from './pdf_viewer';

interface ModalProps {
  isOpen: boolean;
  delete?: boolean;
  saleData: SaleCaptureFormat;
  onFinish: () => void;
  onCancel: () => void;
}

const ModalCobro: FC<ModalProps> = memo(function ModalCobro({ isOpen, onCancel, onFinish, saleData }) {
  const [efectivoInvalid, setEfectivoInvalid] = useState(false);
  const [cambioInvalid, setCambioInvalid] = useState(true);
  const [montoInvalid, setMontoInvalid] = useState(true); 
  const [cobroDispatched, setCobroDispatched] = useState(false);
  const [ticket, setTicket] = useState('');
  const inputRef = React.createRef<HTMLInputElement>();
  const [total, setTotal] = useState(0.0);
  const [montoConfirmado, setMontoConfirmado] = useState(0.0) 
  const [efectivo, setEfectivo] = useState(0.0);
  const [cambio, setCambio] = useState(0.0);
  const [banco, setBanco] = useState('');
  const [referencia, setReferencia] = useState('');
  const debouncedEfectivo = useDebounce(efectivo, 1000);
  const saleResquestStatus = useAppSelector(selectSalesRequestStatus);
  const ticketURL = useAppSelector(selectTicket);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (saleResquestStatus.type === REQUEST_TYPE.POST && saleResquestStatus.success && ticketURL !== '') {
      setTicket(ticketURL);
    }
  }, [saleResquestStatus]);

  useEffect(() => {
    if (saleData.infoPago?.monto) {
      setTotal(saleData.infoPago.monto);
    }
    if (isOpen && !debouncedEfectivo[1].isPending()) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen, debouncedEfectivo, saleData, inputRef]);

  useEffect(() => {
    const cambio = efectivo - total;
    setCambio(cambio);
    if (cambio < 0) {
      setCambioInvalid(true);
    } else {
      setCambioInvalid(false);
    }
  }, [efectivo, total]);

  useEffect(() => {
    if (montoConfirmado >= 0 && montoConfirmado !== total) {
      setMontoInvalid(true); 
    } else {
      setMontoInvalid(false); 
    }
  }, [montoConfirmado, total]);

  const handleCobrar = () => {
    if (saleData.infoPago?.forma) {
      if (saleData.infoPago?.forma === PAYMENT_TYPE.EFECTIVO.value) {
        if (cambio < 0.0) {
          setCambioInvalid(true);
          return;
        }
        saleData.infoPago = { ...saleData.infoPago, montoEfectivo: efectivo, cambioEfectivo: cambio };
      }
      if ([PAYMENT_TYPE.CHEQUE.value, PAYMENT_TYPE.TRANSFERENCIA_BANCARIA.value].includes(saleData.infoPago?.forma)) {
        if (banco === '' || referencia === '') {
          return;
        }
        saleData.infoPago = { ...saleData.infoPago, banco: banco, referencia: referencia };
      }
      if([PAYMENT_TYPE.TARJETA_CREDITO.value, PAYMENT_TYPE.TARJETA_DEBITO.value].includes(saleData.infoPago?.forma)){
        if(total !== montoConfirmado){
          return;
        }
      }
    }
    dispatch(postSale(saleData));
    setCobroDispatched(true);
  };

  const handleKeyDownOnSearch = (code: string) => {
    if (code === 'Enter' || code === 'NumpadEnter') {
      handleCobrar();
    }
  };

  const handleReset = () => {
    setEfectivoInvalid(false);
    setCambioInvalid(true);
    setMontoInvalid(false);
    setTicket('');
    setBanco('');
    setReferencia('');
    setTotal(0.0);
    setEfectivo(0.0);
    setCambio(0.0);
    setMontoConfirmado(0.0);
    setCobroDispatched(false);
  };

  const renderCobro = () => {
    if (saleData.infoPago?.forma) {
      if (saleData.infoPago?.forma === PAYMENT_TYPE.EFECTIVO.value) {
        return renderCobroEfectivo();
      }
      if ([PAYMENT_TYPE.CHEQUE.value, PAYMENT_TYPE.TRANSFERENCIA_BANCARIA.value].includes(saleData.infoPago?.forma)) {
        return renderCobroBanco();
      }
      if([PAYMENT_TYPE.TARJETA_CREDITO.value, PAYMENT_TYPE.TARJETA_DEBITO.value].includes(saleData.infoPago?.forma)){
        return renderCobroTarjeta();
      }
    }
    return null;
  };

  const renderCobroBanco = () => (
    <ModalBody>
      <Row>
        <Col className="d-flex align-items-center justify-content-center text" sm={2}>
          <h1>
            <i className="ri-bank-fill" />
          </h1>
        </Col>
        <Col sm={10}>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Total: $</strong>
              </InputGroupText>
              <Input readOnly step={0.01} min={0} type="number" value={total.toFixed(2)} invalid={false} />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Banco:</strong>
              </InputGroupText>
              <Input onChange={(e) => setBanco(e.target.value)} type="text" invalid={banco === ''} />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Referencia:</strong>
              </InputGroupText>
              <Input onChange={(e) => setReferencia(e.target.value)} type="text" invalid={referencia === ''} />
            </InputGroup>
          </Row>
        </Col>
      </Row>
    </ModalBody>
  );
  const renderCobroEfectivo = () => (
    <ModalBody>
      <Row>
        <Col className="d-flex align-items-center justify-content-center text" sm={2}>
          <h1>
            <i className="ri-cash-line" />
          </h1>
        </Col>
        <Col sm={10}>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Total: $</strong>
              </InputGroupText>
              <Input readOnly step={0.01} min={0} type="number" value={total.toFixed(2)} invalid={false} />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Efectivo del cliente: $</strong>
              </InputGroupText>
              <Input innerRef={inputRef} onKeyDown={(e) => handleKeyDownOnSearch(e.code)} value={efectivo} onChange={(e) => setEfectivo(parseFloat(e.target.value))} step={0.01} min={0} type="number" invalid={efectivoInvalid} />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Cambio: $</strong>
              </InputGroupText>
              <Input step={0.01} value={cambio.toFixed(2)} onChange={(e) => setCambio(parseFloat(e.target.value))} type="number" invalid={cambioInvalid} />
            </InputGroup>
          </Row>
        </Col>
      </Row>
    </ModalBody>
  );

  const renderCobroTarjeta = () => (
    <ModalBody>
      <Row>
        <Col className="d-flex align-items-center justify-content-center text" sm={2}>
          <h1>
            <i className="ri-bank-card-fill" />
          </h1>
        </Col>
        <Col sm={10}>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Total: $</strong>
              </InputGroupText>
              <Input readOnly step={0.01} min={0} type="number" value={total.toFixed(2)} invalid={false} />
            </InputGroup>
          </Row>
          <Row>
            <InputGroup>
              <InputGroupText>
                <strong>Confirmar monto: $</strong>
              </InputGroupText>
              <Input onKeyDown={(e) => handleKeyDownOnSearch(e.code)} value={montoConfirmado} onChange={(e) => setMontoConfirmado(parseFloat(e.target.value))} step={0.01} min={0} type="number" invalid={montoInvalid} />
            </InputGroup>
          </Row>
        </Col>
      </Row>
    </ModalBody>
  );

  const renderVisorPDF = () => {
    return (
      <>
        <PDFViewer url={ticketURL} />
      </>
    );
  };

  return (
    <ModalReactstrap isOpen={isOpen} centered>
      <ModalHeader>{!cobroDispatched ? 'Ventana de cobro' : 'Venta capturada'}</ModalHeader>
      {!cobroDispatched ? renderCobro() : renderVisorPDF()}
      <ModalFooter className="justify-content-between">
        {!cobroDispatched ? (
          <Button color="primary" onClick={() => handleCobrar()}>
            Cobrar
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={() => {
              onFinish();
            }}
          >
            Salir
          </Button>
        )}
        {!cobroDispatched ? (
          <Button
            color="secondary"
            onClick={() => {
              onCancel();
            }}
          >
            Cancelar
          </Button>
        ) : null}
      </ModalFooter>
    </ModalReactstrap>
  );
});

export default ModalCobro;
