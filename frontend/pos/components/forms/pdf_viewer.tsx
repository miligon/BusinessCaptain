import React, { FC, useState, useEffect } from 'react';
import print from 'print-js';
import { Button } from 'reactstrap';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Spinner } from 'reactstrap';

export interface PDFViewerProps {
  url: string;
  autoOpen?: boolean;
}

export const PDFViewer: FC<PDFViewerProps> = ({ url, autoOpen = true }) => {
  const [loaded, setLoaded] = useState(false);
  const [blob, setBlob] = useState('');

  console.log(url);
  useEffect(() => {
    if (url !== '') {
      const getDocument = async () => {
        await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access') || ''}` } })
          .then((response) => response.blob())
          .then((blobFile) => {
            setBlob(URL.createObjectURL(blobFile));
            setLoaded(true);
          });
      };
      getDocument();
    }
  }, [url]);

  useEffect(() => {
    if (loaded && autoOpen) {
      print(blob, 'pdf');
    }
  }, [loaded]);

  return (
    <>
      {!loaded && (
        <Button>
          Loading <Spinner />
        </Button>
      )}
      {loaded && <Button onClick={() => print(blob, 'pdf')}><i className="ri-printer-fill" /> Imprimir Ticket</Button>}
    </>
  );
};

