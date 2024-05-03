import React from 'react';
import { FieldError } from 'react-hook-form';
import { FormFeedback } from 'reactstrap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Input = (errorFlag: FieldError | undefined, isDirty: boolean = false, props: any, type: string = 'text') => {
  return (
    <>
      <input className={`form-control ${isDirty && errorFlag ? 'is-invalid' : ''}`} type={type} {...props} />
      {isDirty && errorFlag ? <FormFeedback>{errorFlag?.message}</FormFeedback> : null}
    </>
  );
};
