import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import Toolbar from "../../components/Toolbar";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/StatusBadge";
import FormModal from "../../components/FormModal";
import ConfirmModal from "../../components/ConfirmModal";

import CustomerForm from "./CustomerForm";
import CustomerDetails from "./CustomerDetails";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

const statusOptions = [
  { label: "Waiting", value: "Waiting" },
  { label: "Checked-In", value: "Checked-In" },
  { label: "Assigned", value: "Assigned" },
  { label: "Completed", value: "Completed" },
];

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  //---------------------------------------
  // Fetch Customers
  //---------------------------------------

  const getCustomers = async () => {
    try {
      setLoading(true);

      const response = await apiService.get(apiPath.CUSTOMERS);

      setCustomers(response);

      setError("");
    } catch (err) {
      setError("Unable to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  //---------------------------------------
  // Filter
  //---------------------------------------

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.mobile.includes(search);

      const matchStatus = status ? customer.eventStatus === status : true;

      return matchSearch && matchStatus;
    });
  }, [customers, search, status]);

  //---------------------------------------
  // Pagination
  //---------------------------------------

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  //---------------------------------------
  // Delete
  //---------------------------------------

  const handleDelete = async () => {
    try {
      await apiService.delete(apiPath.CUSTOMER_BY_ID(selectedCustomer.id));

      toast.success("Customer Deleted");

      getCustomers();

      setShowDelete(false);
    } catch {
      toast.error("Delete Failed");
    }
  };

  //---------------------------------------
  // Columns
  //---------------------------------------

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },

    {
      header: "Mobile",
      accessor: "mobile",
    },

    {
      header: "Email",
      accessor: "email",
    },

    {
      header: "Project",
      accessor: "projectName",
    },
    {
      header: "QR Code",
      accessor: "qrCode",
    },

    {
      header: "QR",

      render: (row) => (
        <img
          src={row.qrImage}
          alt="QR"
          width={60}
          height={60}
          style={{ border: "1px solid #ddd" }}
        />
      ),
    },

    {
      header: "Status",

      render: (row) => <StatusBadge status={row.eventStatus} />,
    },

    {
      header: "Booth",

      render: (row) => row.assignedBooth || "-",
    },

    {
      header: "Action",

      render: (row) => (
        <>
          <Button
            size="sm"
            className="me-2"
            variant="info"
            onClick={() => {
              setSelectedCustomer(row);
              setShowDetails(true);
            }}
          >
            <FaEye />
          </Button>

          <Button
            size="sm"
            className="me-2"
            variant="warning"
            onClick={() => {
              setSelectedCustomer(row);
              setShowForm(true);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedCustomer(row);
              setShowDelete(true);
            }}
          >
            <FaTrash />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h3 className="mb-4">Customers</h3>

      <Toolbar
        searchValue={search}
        onSearch={setSearch}
        filterValue={status}
        onFilter={setStatus}
        filters={statusOptions}
        buttonText="Add Customer"
        onButtonClick={() => {
          setSelectedCustomer(null);
          setShowForm(true);
        }}
      />

      <DataTable
        columns={columns}
        data={paginatedCustomers}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit */}

      <FormModal
        show={showForm}
        onHide={() => setShowForm(false)}
        title={selectedCustomer ? "Edit Customer" : "Add Customer"}
      >
        <CustomerForm
          customer={selectedCustomer}
          onSuccess={() => {
            getCustomers();
            setShowForm(false);
          }}
        />
      </FormModal>

      {/* Details */}

      <FormModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        title="Customer Details"
        submitText="Close"
        onSubmit={() => setShowDetails(false)}
      >
        <CustomerDetails customer={selectedCustomer} />
      </FormModal>

      {/* Delete */}

      <ConfirmModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
      />
    </>
  );
};

export default Customers;
