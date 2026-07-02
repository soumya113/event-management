import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {message}

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={onHide}
        >
          {cancelText}
        </Button>

        <Button
          variant={variant}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Please wait..." : confirmText}
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;