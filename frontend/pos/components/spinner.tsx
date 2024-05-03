import React, { FC } from 'react';

const Spinner: FC = () => (
  <div className="spinner-border" role="status">
    <span className="visually-hidden"> Loading...</span>
  </div>
);

export default Spinner;
