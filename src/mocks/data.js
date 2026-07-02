// data.js

export const customers = [
  {
    id: 1,
    name: "John Doe",
    mobile: "9876543210",
    email: "john@example.com",
    projectName: "CRM Solution",
    qrCode: "QR001",
    eventStatus: "Waiting",
    assignedBooth: null,
    qrUsed: false,
    remarks: "",
    followUpDate: null,
  },
  {
    id: 2,
    name: "Alice Smith",
    mobile: "9123456789",
    email: "alice@example.com",
    projectName: "ERP",
    qrCode: "QR002",
    eventStatus: "Checked-In",
    assignedBooth: "B1",
    qrUsed: true,
    remarks: "",
    followUpDate: null,
  },
];

export const dashboardSummary = {
  totalCustomers: 2,
  checkedInCustomers: 1,
  waitingCustomers: 1,
  assignedCustomers: 1,
  completedCustomers: 0,
};

export const booths = [
  {
    id: 1,
    boothNumber: "B1",
    salesManager: "Rahul",
    customerId: 2,
    status: "Assigned",
  },
  {
    id: 2,
    boothNumber: "B2",
    salesManager: "",
    customerId: null,
    status: "Available",
  },
];

export const statusHistory = [];