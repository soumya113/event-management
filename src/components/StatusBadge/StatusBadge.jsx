import Badge from "react-bootstrap/Badge";

const STATUS_VARIANTS = {
  Waiting: "warning",

  "Checked-In": "success",

  Assigned: "primary",

  "In Discussion": "info",

  Completed: "dark",

  Cancelled: "secondary",

  "Not Interested": "danger",

  "Follow-Up Required": "warning",
};

const StatusBadge = ({
  status,
}) => {
  return (
    <Badge
      bg={STATUS_VARIANTS[status] || "secondary"}
      pill
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;