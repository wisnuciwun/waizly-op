// React
import { useEffect } from 'react';
// component
import { Icon } from '@/components/atoms';
// Third party
import {
  Pagination,
  PaginationLink,
  PaginationItem,
  Row,
  Col,
} from 'reactstrap';

const DataTablePagination = ({
  itemPerPage,
  totalItems,
  paginate,
  currentPage,
  onChangeRowsPerPage,
  customItemPerPage,
  setRowsPerPage,
  valueSelectRow,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginationNumber = () => {
    if (pageNumbers.length <= 5) {
      return pageNumbers;
    } else if (pageNumbers.length >= 5 && currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', pageNumbers[pageNumbers.length - 1]];
    } else if (
      pageNumbers.length >= 5 &&
      currentPage >= pageNumbers[pageNumbers.length - 4]
    ) {
      return [
        1,
        '...',
        pageNumbers[pageNumbers.length - 5],
        pageNumbers[pageNumbers.length - 4],
        pageNumbers[pageNumbers.length - 3],
        pageNumbers[pageNumbers.length - 2],
        pageNumbers[pageNumbers.length - 1],
      ];
    } else if (
      pageNumbers.length > 5 &&
      currentPage > 4 &&
      currentPage < pageNumbers[pageNumbers.length - 4]
    ) {
      return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        pageNumbers[pageNumbers.length - 1],
      ];
    }
  };

  let paginationItms = paginationNumber();

  const firstPage = () => {
    paginate(1);
  };

  const lastPage = () => {
    paginate(pageNumbers[pageNumbers.length - 1]);
  };

  const nextPage = () => {
    paginate(currentPage + 1);
  };

  const prevPage = () => {
    paginate(currentPage - 1);
  };

  useEffect(() => {
    onChangeRowsPerPage(customItemPerPage);
    setRowsPerPage(customItemPerPage);
  }, [customItemPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row
        className="align-items-center bg-white py-4 px-2 rounded-2"
        style={{ marginLeft: '0px', marginRight: '0px' }}
      >
        <Col className="col-7" sm="12 " md="9">
          <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage - 1 === 0 ? true : false}>
              <PaginationLink
                className="page-link-first"
                onClick={(ev) => {
                  ev.preventDefault();
                  firstPage();
                }}
                href="#first"
              >
                <Icon name="chevrons-left" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem disabled={currentPage - 1 === 0 ? true : false}>
              <PaginationLink
                className="page-link-prev"
                onClick={(ev) => {
                  ev.preventDefault();
                  prevPage();
                }}
                href="#prev"
              >
                <Icon name="chevron-left" />
              </PaginationLink>
            </PaginationItem>
            {paginationItms.map((item, idx) => {
              return (
                <PaginationItem
                  disabled={isNaN(item)}
                  className={`d-none d-sm-block ${
                    currentPage === item ? 'active' : ''
                  }`}
                  key={idx}
                >
                  <PaginationLink
                    tag="a"
                    href="#pageitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                      paginate(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem
              disabled={pageNumbers[pageNumbers.length - 1] === currentPage}
            >
              <PaginationLink
                className="page-link-next"
                onClick={(ev) => {
                  ev.preventDefault();
                  nextPage();
                }}
                href="#next"
              >
                <Icon name="chevron-right" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              disabled={pageNumbers[pageNumbers.length - 1] === currentPage}
            >
              <PaginationLink
                className="page-link-next"
                onClick={(ev) => {
                  ev.preventDefault();
                  lastPage();
                }}
                href="#last"
              >
                <Icon name="chevrons-right" />
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </Col>
        <Col sm="12" md="3" className="col-5 text-start text-md-end">
          <div className="dataTables_length" id="DataTables_Table_0_length">
            <label>
              <span className="d-none d-sm-inline-block">Data Per Halaman</span>
              <div className="form-control-select">
                <select
                  name="DataTables_Table_0_length"
                  className="custom-select custom-select-sm form-control form-control-sm shadow-none"
                  onChange={(e) => setRowsPerPage(e.target.value)}
                  value={valueSelectRow}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                </select>
              </div>
            </label>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default DataTablePagination;
