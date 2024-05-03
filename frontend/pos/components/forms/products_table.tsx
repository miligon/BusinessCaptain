import { useAppSelector, useAppDispatch } from 'landing_page/store/hooks';
import { selectProductsRequestStatus, selectProducts } from 'pos/store/products/products_selectors';
import { ProductList, Producto } from 'pos/store/products/products_slice';
import { listProducts } from 'pos/store/products/products_thunk';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { useDebounce } from 'use-debounce';
import CustomPagination from './pagination';
import Spinner from '../spinner';
interface ProdsTableProps {
  editCallback?: (id: string) => void;
  pathToEdit?: string;
  removeCallback?: (id: string) => void;
  onClick?: (p: ProductList) => void;
  onEnter?: (p: ProductList) => void;
  showActions: boolean;
  productsFilter: {
    depto: string;
    marca: string;
    familia: string;
    query: string;
    codigo: string;
    page: number;
  };
  showPaginationBottom?: boolean;
}

interface sortingConfig {
  [key: string]: boolean | string;
  current: string;
  sku: boolean;
  depto: boolean;
  familia: boolean;
  marca: boolean;
  producto: boolean;
  precio: boolean;
}

const initialSorting: sortingConfig = { current: 'none', sku: false, depto: false, familia: false, marca: false, producto: false, precio: false };

const ProductsTable: FC<ProdsTableProps> = ({ showActions, editCallback, pathToEdit, removeCallback, onEnter, onClick, productsFilter, showPaginationBottom = false }) => {
  const { loading: loading, error: error, type: type, success: success } = useAppSelector(selectProductsRequestStatus);
  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  const [selectedItem, setSelectedItem] = useState(0);
  const [sorting, setSorting] = useState(initialSorting);
  const [filteredProducts, setFilteredProducts] = useState([] as ProductList[]);
  const [filter, setFilter] = useState(productsFilter);
  const [debouncedFilter] = useDebounce(filter, 50);
  const activeRowRef = React.createRef<HTMLTableRowElement>();

  useEffect(() => {
    // Check if activeRowRef has been set and if so, scroll to it
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [activeRowRef]);

  useEffect(() => {
    // Check if activeRowRef has been set and if so, scroll to it
    setFilter(productsFilter);
  }, [productsFilter]);

  useEffect(() => {
    if (!loading) {
      dispatch(listProducts(debouncedFilter));
      setSorting(initialSorting);
    }
  }, [debouncedFilter]);

  useEffect(() => {
    if (products.isLoaded) {
      setFilteredProducts(sortProducts([...products.results]));
      //setFilteredProducts([...products.data]);
    }
  }, [sorting, products, selectedItem]);

  useEffect(() => {
    if (onClick) {
      const handleKeyDown = (event: { key: string }) => {
        if (event.key === 'ArrowDown') {
          // Do something when ArrowDown key is pressed
          if (filteredProducts.length > 0) {
            const index = filteredProducts.findIndex((f) => f.id === selectedItem);
            setSelectedItem(filteredProducts.length - 1 < index + 1 ? selectedItem : filteredProducts[index + 1].id);
          }
        }
        if (event.key === 'ArrowUp') {
          // Do something when ArrowDown key is pressed
          if (filteredProducts.length > 0) {
            const index = filteredProducts.findIndex((f) => f.id === selectedItem);
            setSelectedItem(index - 1 >= 0 ? filteredProducts[index - 1].id : selectedItem);
          }
        }
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
          // Do something when ArrowDown key is pressed
          const product = filteredProducts.find((f) => f.id === selectedItem);
          if (onEnter && product) {
            onEnter(product);
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [filteredProducts, onClick, selectedItem]);

  const sortProducts = (filtered: ProductList[]) => {
    if (sorting.current !== 'none') {
      if (sorting.current === 'precio' && sorting[sorting.current]) {
        return filtered.sort((a, b) => (a[sorting.current] as number) - (b[sorting.current] as number));
      }
      if (sorting.current === 'precio' && !sorting[sorting.current]) {
        return filtered.sort((b, a) => (a[sorting.current] as number) - (b[sorting.current] as number));
      }
      if (sorting[sorting.current]) {
        return filtered.sort((a, b) => (a[sorting.current] as string).toLowerCase().localeCompare((b[sorting.current] as string).toLowerCase()));
      } else {
        return filtered.sort((b, a) => (a[sorting.current] as string).toLowerCase().localeCompare((b[sorting.current] as string).toLowerCase()));
      }
    }

    return filtered;
  };

  const handleOnClick = (p: ProductList) => {
    if (onClick) {
      setSelectedItem(p.id);
      onClick(p);
    }
  };

  return (
    <>
      {products.pages > 1 ? <CustomPagination currentPage={products.current} totalPages={products.pages} onChange={(p: number) => setFilter({ ...filter, page: p })} /> : null}
      <Table hover bordered striped className="customer-manager-table">
        <thead>
          <tr>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'sku', sku: !sorting.sku })}>{sorting.sku ? <i className="ri-sort-number-asc" /> : <i className="ri-sort-number-desc" />}</button>
              SKU
            </th>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'depto', depto: !sorting.depto })}>{sorting.depto ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}</button>
              Depto.
            </th>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'familia', familia: !sorting.familia })}>{sorting.familia ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}</button>
              Categoria
            </th>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'marca', marca: !sorting.marca })}>{sorting.marca ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}</button>
              Marca
            </th>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'producto', producto: !sorting.producto })}>{sorting.producto ? <i className="ri-sort-alphabet-asc" /> : <i className="ri-sort-alphabet-desc" />}</button>
              Modelo
            </th>
            <th>
              <button onClick={() => setSorting({ ...initialSorting, current: 'precio', precio: !sorting.precio })}>{sorting.precio ? <i className="ri-sort-number-asc" /> : <i className="ri-sort-number-desc" />}</button>
              Precio
            </th>
            {showActions ? <th>Acción</th> : null}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((c) => (
            <tr ref={selectedItem !== 0 && selectedItem === c.id ? activeRowRef : undefined} className={selectedItem !== 0 && selectedItem === c.id ? 'active-row table-info' : ''} key={c.id} onClick={() => handleOnClick(c)}>
              <th scope="row">{c.sku}</th>
              <td>{c.depto}</td>
              <td>{c.familia}</td>
              <td>{c.marca}</td>
              <td>{c.producto}</td>
              <td>$ {c.precio.toFixed(2)}</td>
              {showActions && editCallback && pathToEdit && removeCallback ? (
                <td>
                  <Link replace onClick={() => editCallback(c.id.toString())} to={'../' + pathToEdit.replace(':id', c.id.toString())}>
                    <i className="ri-pencil-fill" />
                  </Link>
                  <span> </span>
                  <button onClick={() => removeCallback(c.id.toString())}>
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredProducts.length === 0 ? <h6 className="text-center">Sin resultados</h6> : null}
      {loading ? <Spinner /> : null}
      {error ? <h1 className="text-danger text-centered">Error al recuperar los resultados</h1> : null}
      {showPaginationBottom && products.pages > 1 ? <CustomPagination currentPage={products.current} totalPages={products.pages} onChange={(p: number) => setFilter({ ...filter, page: p })} /> : null}
    </>
  );
};

export default ProductsTable;
