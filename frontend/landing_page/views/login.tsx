import React, { FC, useEffect, useState } from 'react';
import { doLogin } from 'pos/store/auth/auth_thunk';
import { useAppDispatch } from 'landing_page/store/hooks';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from 'pos/store/auth/auth_selectors';
import { useNavigate } from 'react-router-dom';
import { paths } from 'common/constants';
import Spinner from 'landing_page/components/spinner';
import { Helmet } from 'react-helmet';

const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authState = useSelector(selectAuthStatus);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authState === 'SUCCESS') {
      navigate(paths.client.APP_BASE + '/' + paths.client.APP_DASHBOARD, { replace: true });
    }
  }, [authState]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = (e: any) => {
    e.preventDefault();
    dispatch(doLogin({ username: username, password: password }));
  };

  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="static/react/img/logo.svg" />
        <title>Business Captain</title>
      </Helmet>
      <div className="login-container">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <div className="login-form">
                <div className="logo-container d-flex align-items-center">
                  <Button outline color="secondary" onClick={() => navigate(paths.client.APP_BASE, { replace: true })}>
                    <i className="ri-arrow-left-line" />
                  </Button>
                  <img src="static/react/img/logo.svg" alt="Logo" />
                  <h3>Business Captain</h3>
                </div>
                <p>Para acceder a la version de prueba use los siguientes datos: username=test, password=test_password</p>
                <Form onSubmit={(e) => handleLogin(e)}>
                  <FormGroup row>
                    <Label sm={2} for="username">
                      Username
                    </Label>
                    <Col>
                      <Input type="text" id="username" onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label sm={2} for="password">
                      Password
                    </Label>
                    <Col>
                      <Input type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                    </Col>
                  </FormGroup>
                  <Button type="submit" color="primary" block>
                    {authState === 'PENDING' ? <Spinner /> : 'Login'}
                  </Button>
                </Form>
                {authState === 'ERROR' ? (
                  <>
                    <br />
                    <h6 className="text-danger text-center">Error credenciales no validas</h6>
                  </>
                ) : null}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export { LoginPage };
