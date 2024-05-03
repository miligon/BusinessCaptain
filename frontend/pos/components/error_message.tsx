import React, { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ErrorMesssageProps {
  title: string;
  reload?: boolean;
}

const ErrorMesssage: FC<ErrorMesssageProps> = ({ title, reload = false }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    reload ? window.location.reload() : navigate('../');
  };
  return (
    <>
      <h1>{title}</h1>
      <hr />
      <p>Ocurrio un problema al recuperar la información del servidor</p>
      <Link onClick={() => handleClick()} to={'#'}>
        {reload ? 'Recargar' : 'Regresar'}
      </Link>
    </>
  );
};

export default ErrorMesssage;
