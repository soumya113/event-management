import { Modal, Button } from "react-bootstrap";

const FormModal = ({
  show,
  onHide,
  title,
  children,
  size = "lg",
  showFooter = false,
  submitText = "Save",
  cancelText = "Cancel",
  onSubmit,
  loading = false,
  centered = true,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>
      {showFooter && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {cancelText}
          </Button>

          <Button variant="primary" onClick={onSubmit} disabled={loading}>
            {loading ? "Saving..." : submitText}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default FormModal;
