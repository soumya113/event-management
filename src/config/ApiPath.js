export const apiPath = {
  LOGIN: "/login",
  DASHBOARD_SUMMARY: "/dashboard-summary",
  CUSTOMERS: "/customers",
  CUSTOMER_BY_ID: (id) => `/customers/${id}`,
  VERIFY_QR: (qrCode) => `/qr-codes/verify/${qrCode}`,
  CHECK_IN: "/customers/check-in",
  BOOTH_ASSIGNMENTS: "/booth-assignments",
  BOOTH_ASSIGNMENT_BY_ID: (id) => `/booth-assignments/${id}`,
  CUSTOMER_STATUS: "/customer-status",
  CUSTOMER_STATUS_HISTORY: (customerId) => `/customer-status/${customerId}`,
};