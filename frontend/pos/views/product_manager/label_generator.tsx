import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

const LabelGenerator: FC = () => (
  <>
    <h1>ProductManagerLabelGen</h1>
    <Outlet />
  </>
);

export default LabelGenerator;
