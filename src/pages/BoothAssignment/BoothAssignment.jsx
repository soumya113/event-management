import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import Toolbar from "../../components/Toolbar";
import DataTable from "../../components/DataTable";
import FormModal from "../../components/FormModal";
import ConfirmModal from "../../components/ConfirmModal";
import StatusBadge from "../../components/StatusBadge";

import BoothAssignmentForm from "./BoothAssignmentForm";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

const statusOptions = [
  { label: "Waiting", value: "Waiting" },
  { label: "Assigned", value: "Assigned" },
  { label: "In Discussion", value: "In Discussion" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const BoothAssignment = () => {
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  //--------------------------------------------------
  // Fetch Assignments
  //--------------------------------------------------

  const getAssignments = async () => {
    try {
      setLoading(true);

      const response = await apiService.get(
        apiPath.BOOTH_ASSIGNMENTS
      );

      setAssignments(response);

      setError("");
    } catch (err) {
      console.error(err);

      setError("Unable to load booth assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  //--------------------------------------------------
  // Search + Filter
  //--------------------------------------------------

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch = item.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus = status
        ? item.status === status
        : true;

      return matchSearch && matchStatus;
    });
  }, [assignments, search, status]);

  //--------------------------------------------------
  // Pagination
  //--------------------------------------------------

  const totalPages = Math.ceil(
    filteredAssignments.length / pageSize
  );

  const paginatedAssignments =
    filteredAssignments.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

  //--------------------------------------------------
  // Delete
  //--------------------------------------------------

  const handleDelete = async () => {
    try {
      await apiService.delete(
        apiPath.BOOTH_ASSIGNMENT_BY_ID(
          selectedAssignment.id
        )
      );

      toast.success(
        "Assignment deleted successfully"
      );

      getAssignments();

      setShowDelete(false);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  //--------------------------------------------------
  // Table Columns
  //--------------------------------------------------

  const columns = [
    {
      header: "Customer",

      accessor: "customerName",
    },

    {
      header: "Booth",

      accessor: "boothNumber",
    },

    {
      header: "Sales Manager",

      accessor: "salesManager",
    },

    {
      header: "Status",

      render: (row) => (
        <StatusBadge status={row.status} />
      ),
    },

    {
      header: "Action",

      render: (row) => (
        <>
          <Button
            size="sm"
            variant="warning"
            className="me-2"
            onClick={() => {
              setSelectedAssignment(row);
              setShowForm(true);
            }}
          >
            <FaEdit />
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedAssignment(row);
              setShowDelete(true);
            }}
          >
            <FaTrash />
          </Button>
        </>
      ),
    },
  ];

  //--------------------------------------------------

  return (
    <>
      <h3 className="mb-4">
        Booth Assignment
      </h3>

      <Toolbar
        searchValue={search}
        onSearch={setSearch}
        filterValue={status}
        onFilter={setStatus}
        filters={statusOptions}
        buttonText="Assign Booth"
        onButtonClick={() => {
          setSelectedAssignment(null);
          setShowForm(true);
        }}
      />

      <DataTable
        columns={columns}
        data={paginatedAssignments}
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
        title={
          selectedAssignment
            ? "Edit Booth Assignment"
            : "Assign Booth"
        }
      >
        <BoothAssignmentForm
          assignment={selectedAssignment}
          onSuccess={() => {
            getAssignments();
            setShowForm(false);
          }}
        />
      </FormModal>

      {/* Delete */}

      <ConfirmModal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment?"
        onConfirm={handleDelete}
      />
    </>
  );
};

export default BoothAssignment;