import React, { FC, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { selectAuthStatus } from 'pos/store/auth/auth_selectors';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { doVerifyAndRefresh } from 'pos/store/auth/auth_thunk';
import { getConfig } from 'pos/store/config/config_thunk';

export interface PrivateRouteProps {
  children: React.ReactNode;
}
export const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const authState = useAppSelector(selectAuthStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refresh = localStorage.getItem('refresh');
    if (authState === 'VERIFY' && refresh) {
      dispatch(doVerifyAndRefresh(refresh));
    }
    if (authState === 'SUCCESS') {
      dispatch(getConfig());
    }
  }, [authState]);

  return authState === 'SUCCESS' ? children : authState === 'ERROR' || authState === 'NONE' ? <Navigate to="/" replace={true} /> : null;
};
