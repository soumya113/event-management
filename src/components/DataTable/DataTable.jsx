import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Pagination from "react-bootstrap/Pagination";
import Alert from "react-bootstrap/Alert";

import Loader from "../Loader/Loader";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = "",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  striped = true,
  bordered = false,
  hover = true,
  responsive = true,
}) => {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Table
          responsive={responsive}
          striped={striped}
          bordered={bordered}
          hover={hover}
          className="align-middle mb-0"
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessor || column.header}
                  style={{
                    width: column.width,
                    textAlign: column.align || "left",
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!data.length ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-5 text-muted"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex}>
                  {columns.map((column) => (
                    <td
                      key={column.accessor || column.header}
                      style={{
                        textAlign: column.align || "left",
                      }}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              />

              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={currentPage === index + 1}
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataTable;