import React, { FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FormGroup, Label, Input, Row, Col, Table, Button } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectDepartmentsReport } from 'pos/store/reports/reports_selectors';
import { getDepartmentsReport } from 'pos/store/reports/reports_thunk';
import Spinner from 'pos/components/spinner';
import { Articles, Departments } from 'pos/store/reports/reports_slice';
import { PieChart } from 'pos/components/pie_char';
import { getLocalDate } from 'common/utils';

const DepartmentsReports: FC = () => {
  const dispatch = useAppDispatch();
  const report = useAppSelector(selectDepartmentsReport);
  const [dateStart, setDateStart] = useState(getLocalDate());
  const [dateEnd, setDateEnd] = useState(getLocalDate());
  const [departmentsData, setDepartmentsData] = useState([] as Departments[]);
  const [sortDepartmentTotals, setSortDepartmentTotals] = useState(true);
  const [articlesData, setArticlesData] = useState([] as Articles[]);
  const [sortArticlesQty, setSortArticlesQty] = useState(false);
  const [sortArticlesTotal, setSortArticlesTotal] = useState(true);
  const [currentSort, setCurrentSort] = useState('QTY');

  const refreshReport = () => (dateStart !== '' && dateEnd !== '' ? dispatch(getDepartmentsReport({ inicio: dateStart, fin: dateEnd })) : null);

  useEffect(() => {
    refreshReport();
  }, [dateEnd, dateStart]);

  useEffect(() => {
    if (report.isLoaded) {
      const departments = [...report.departamentos];
      if (sortDepartmentTotals) {
        setDepartmentsData(departments.sort((a, b) => a.total - b.total));
      } else {
        setDepartmentsData(departments.sort((a, b) => b.total - a.total));
      }
      let articulos = [...report.articulos];
      switch (currentSort) {
        case 'QTY':
          if (sortArticlesQty) {
            articulos = articulos.sort((a, b) => a.cantidad - b.cantidad);
          } else {
            articulos = articulos.sort((a, b) => b.cantidad - a.cantidad);
          }
          break;
        case 'TOTAL':
          if (sortArticlesTotal) {
            articulos = articulos.sort((a, b) => a.total - b.total);
          } else {
            articulos = articulos.sort((a, b) => b.total - a.total);
          }
          break;
        default:
          break;
      }
      setArticlesData(articulos);
    }
  }, [report, sortDepartmentTotals, sortArticlesQty, sortArticlesTotal]);

  const renderDepartmentsTable = () => (
    <Table bordered size="sm">
      <thead className="table-departments-head">
        <tr>
          <th className="w-25 text-center">Departamento</th>
          <th className="text-center">
            <button className="button-link" onClick={() => setSortDepartmentTotals(!sortDepartmentTotals)}>
              {sortDepartmentTotals ? <i className="ri-sort-number-asc" /> : <i className="ri-sort-number-desc" />}
            </button>
            <span></span>
            <span>Total</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {departmentsData.map((val, index) => (
          <tr className="table-departments-body" key={index}>
            <th className="text-center" scope="row">
              {val.departamento}
            </th>
            <td className="text-end">$ {val.total.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderArticlesTable = () => (
    <Table size="sm">
      <thead>
        <tr className="d-flex">
          <th className="text-center col-1">
            <button
              className="button-link"
              onClick={() => {
                setCurrentSort('QTY');
                setSortArticlesQty(!sortArticlesQty);
              }}
            >
              {sortArticlesQty ? <i className="ri-sort-number-asc" /> : <i className="ri-sort-number-desc" />}
            </button>
            <span></span>
            <span>Cantidad</span>
          </th>
          <th className="text-center col-1">Depto.</th>
          <th className="text-center col-2">Famlia</th>
          <th className="text-center col-2">Marca</th>
          <th className="text-center col-4">Modelo</th>
          <th className="text-center col-2">
            <button
              className="button-link"
              onClick={() => {
                setCurrentSort('TOTAL');
                setSortArticlesTotal(!sortArticlesTotal);
              }}
            >
              {sortArticlesTotal ? <i className="ri-sort-number-asc" /> : <i className="ri-sort-number-desc" />}
            </button>
            <span></span>
            <span>Total</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {articlesData.map((value, index) => (
          <tr key={index} className="d-flex">
            <th className="text-center col-1" scope="row">
              {value.cantidad}
            </th>
            <td className="text-center col-1">{value.departamento}</td>
            <td className="text-center col-2">{value.familia}</td>
            <td className="text-center col-2">{value.marca}</td>
            <td className="text-start col-4">{value.modelo}</td>
            <td className="text-end col-2">$ {value.total}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return report.isLoaded ? (
    <>
      <br />
      <div className="d-flex align-items-center justify-content-between">
        <FormGroup row>
          <Label sm={1} for="dateStart">
            Inicio
          </Label>
          <Col sm={4}>
            <Input id="dateStart" value={dateStart} onChange={(e) => setDateStart(e.target.value)} placeholder="date placeholder" type="date" />
          </Col>
          <Label sm={1} for="dateEnd">
            Fin
          </Label>
          <Col sm={4}>
            <Input id="dateEnd" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} placeholder="date placeholder" type="date" />
          </Col>
        </FormGroup>
        <Button color="success" onClick={() => refreshReport()}>
          <i className="ri-refresh-line" />
        </Button>
      </div>

      <div className="container">
        <hr />
        <Row>
          <Col sm={4}>{renderDepartmentsTable()}</Col>
          <Col>
            <div className="departments-report-piechart">
              <PieChart data={departmentsData.map((d) => d.total)} labels={departmentsData.map((d) => d.departamento)} />
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <h1 className="text-center">Total: $ {report.total.toFixed(2)} </h1>
          {report.acumulado ? <h5 className="text-center">Acumulado en el mes: $ {report.acumulado.toFixed(2)} </h5> : null}
        </Row>
        <hr />
        <h5>Desglose por articulos</h5>
        <Row>
          <h6>Filtros:</h6>
        </Row>
        <br />
        <Row>{renderArticlesTable()}</Row>
      </div>

      <Outlet />
    </>
  ) : (
    <>
      <br />
      <h1>Loading ...</h1>
      <Spinner />
      <Outlet />
    </>
  );
};

export default DepartmentsReports;
