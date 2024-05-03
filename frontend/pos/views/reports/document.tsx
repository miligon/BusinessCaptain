import { getLocalDate } from 'common/utils';
import { useAppDispatch, useAppSelector } from 'landing_page/store/hooks';
import { selectDocumentsReport } from 'pos/store/reports/reports_selectors';
import { getDepartmentsReport, getDocumentReport } from 'pos/store/reports/reports_thunk';
import React, { FC, useEffect, useState } from 'react';
import { FormGroup, Label, Col, Input, Button, Table } from 'reactstrap';

const DocumentReports: FC = () => {
  const reportData = useAppSelector(selectDocumentsReport);

  const dispatch = useAppDispatch();
  const [dateStart, setDateStart] = useState(getLocalDate());
  const [dateEnd, setDateEnd] = useState(getLocalDate());

  const refreshReport = () => (dateStart !== '' && dateEnd !== '' ? dispatch(getDocumentReport({ inicio: dateStart, fin: dateEnd })) : null);

  useEffect(() => {
    refreshReport();
  }, [dateEnd, dateStart]);

  return (
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
        {reportData.isLoaded ? (
          <Table>
            <thead>
              <tr>
                {reportData.data.columns.map((d, index) => (
                  <th key={index}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.data.data.map((d, i) => (
                <tr key={i}>
                  {d.map((row, index) => (
                    <td key={index}>{index > 0 ? '$' + parseFloat(row).toFixed(2) : row}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </div>
    </>
  );
};

export default DocumentReports;
