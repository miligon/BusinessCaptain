import React, { FC, useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectCustomerRequestStatus, selectCustomers } from 'pos/store/customers/customers_selectors';
import { listCustomer, getCustomer, deleteCustomer } from 'pos/store/customers/customers_thunk';
import Spinner from 'pos/components/spinner';
import { Customer } from 'pos/store/customers/customers_slice';
import { paths, REQUEST_TYPE } from 'common/constants';
import ErrorMesssage from 'pos/components/error_message';

const CustomerManager: FC = () => {
  const { success: success, loading: isLoading, error: isRejected, type: requestType } = useAppSelector(selectCustomerRequestStatus);
  const { data: customers, isLoaded: isLoaded } = useAppSelector(selectCustomers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('');
  const [AscendingSort, setAscendingSort] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState([] as Customer[]);

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      dispatch(listCustomer());
    }
  }, []);

  useEffect(() => {
    if (requestType === REQUEST_TYPE.DELETE && success) {
      dispatch(listCustomer());
    }
  }, [requestType, success]);

  useEffect(() => {
    if (filter === '') {
      dispatch(listCustomer());
    }
  }, [filter]);

  const sortCustomers = (filtered: Customer[]) => {
    if (AscendingSort) {
      return filtered.sort((a, b) => a.razonSocial.toLowerCase().localeCompare(b.razonSocial.toLowerCase()));
    } else {
      return filtered.sort((b, a) => a.razonSocial.toLowerCase().localeCompare(b.razonSocial.toLowerCase()));
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (filter === '') {
        setFilteredCustomers(sortCustomers([...customers]));
      } else {
        const filtered = customers.filter((c) => c.razonSocial.toLowerCase().includes(filter.toLowerCase()));
        setFilteredCustomers(sortCustomers(filtered));
      }
    }
  }, [filter, AscendingSort, isLoaded, isLoading]);

  const renderCustomers = () => (
    <div className="customer-manager-table">
      <Table hover bordered striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>
              <button onClick={() => setAscendingSort(!AscendingSort)}>{AscendingSort ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}</button>
              <span></span>
              <span>Razon Social</span>
            </th>
            <th>RFC</th>
            <th>Régimen fiscal</th>
            <th>Telefono</th>
            <th>Email</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((c) => (
            <tr key={c.id_client}>
              <th scope="row">{c.id_client}</th>
              <td>{c.observaciones !== '' ? c.razonSocial + ' - ' + c.observaciones : c.razonSocial}</td>
              <td>{c.RFC}</td>
              <td>{c.regimen_fiscal}</td>
              <td>{c.telefono_movil}</td>
              <td>{c.email}</td>
              <td>
                <Link replace onClick={() => dispatch(getCustomer(c.id_client.toString()))} to={'../' + paths.client.CUSTOMER_MANAGER.EDITOR.replace(':id', c.id_client.toString())}>
                  <i className="ri-pencil-fill" />
                </Link>
                <span> </span>
                <button onClick={() => dispatch(deleteCustomer(c.id_client.toString()))}>
                  <i className="ri-delete-bin-6-line" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  if (isRejected) {
    return (
      <>
        <ErrorMesssage title="Administrador de Clientes" />
      </>
    );
  } else {
    return (
      <>
        <h1>Administrador de clientes</h1>
        <hr />
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <label htmlFor="Search">Buscar:</label>
            <input id="Search" onChange={(e) => setFilter(e.target.value)} type="text" />
          </div>
          <Button onClick={() => navigate('../' + paths.client.CUSTOMER_MANAGER.NEW)}>
            Añadir Cliente <i className="ri-user-add-line" />
          </Button>
        </div>
        <hr />
        {isLoading ? <Spinner /> : null}
        {isLoaded ? renderCustomers() : null}
      </>
    );
  }
};

export default CustomerManager;
