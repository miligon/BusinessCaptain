import React, { FC } from 'react';
import { Modal as ModalReactstrap, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

interface ModalProps {
  isOpen: boolean;
  delete?: boolean;
  onContinue: () => void;
  onCancel: () => void;
}
const Modal: FC<ModalProps> = ({ isOpen, onContinue, onCancel, ...props }) => {
  if (props.delete) {
    return (
      <ModalReactstrap isOpen={isOpen} centered>
        <ModalHeader></ModalHeader>
        <ModalBody>
          ¿Esta seguro que desea <strong>eliminar</strong> este registro?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={onContinue}>
            Si, eliminar
          </Button>{' '}
          <Button color="primary" onClick={onCancel}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalReactstrap>
    );
  } else {
    return (
      <ModalReactstrap isOpen={isOpen} centered>
        <ModalHeader>Atencion!</ModalHeader>
        <ModalBody>Hay cambios sin guardar, ¿Esta seguro de quiere continuar sin guardar los cambios?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onContinue}>
            Continuar, sin guardar los cambios
          </Button>{' '}
          <Button color="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalReactstrap>
    );
  }
};

export default Modal;
