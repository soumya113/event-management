import { http, HttpResponse } from "msw";
import { customers, booths, statusHistory } from "./data";
import {adminCredential} from "../config/Constant"

let customerData = [...customers];
let boothData = [...booths];
let historyData = [...statusHistory];

const dashboard = () => {
  return {
    totalCustomers: customerData.length,

    checkedInCustomers: customerData.filter(
      (c) => c.eventStatus === "Checked-In"
    ).length,

    waitingCustomers: customerData.filter(
      (c) => c.eventStatus === "Waiting"
    ).length,

    assignedCustomers: customerData.filter(
      (c) => c.assignedBooth
    ).length,

    completedCustomers: customerData.filter(
      (c) => c.eventStatus === "Completed"
    ).length,
  };
};

export const handlers = [
  //----------------------------------------------------
  // LOGIN
  //----------------------------------------------------
  http.post("/api/login", async ({ request }) => {
    const body = await request.json();

    if (
      body.email === adminCredential.email &&
      body.password === adminCredential.password
    ) {
      return HttpResponse.json({
        token: "dummy-jwt-token",
        user: {
          id: 1,
          name: "Admin User",
          email: body.email,
        },
      });
    }

    return HttpResponse.json(
      {
        message: "Invalid Credentials",
      },
      { status: 401 }
    );
  }),

  //----------------------------------------------------
  // DASHBOARD
  //----------------------------------------------------

  http.get("/api/dashboard-summary", () => {
    return HttpResponse.json(dashboard());
  }),

  //----------------------------------------------------
  // CUSTOMERS LIST
  //----------------------------------------------------

  http.get("/api/customers", ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");

    let result = [...customerData];

    if (search) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.mobile.includes(search)
      );
    }

    if (status) {
      result = result.filter((c) => c.eventStatus === status);
    }

    return HttpResponse.json(result);
  }),

  //----------------------------------------------------
  // CUSTOMER DETAILS
  //----------------------------------------------------

  http.get("/api/customers/:id", ({ params }) => {
    const customer = customerData.find(
      (c) => c.id === Number(params.id)
    );

    if (!customer) {
      return HttpResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(customer);
  }),

  //----------------------------------------------------
  // CREATE CUSTOMER
  //----------------------------------------------------

  http.post("/api/customers", async ({ request }) => {
    const body = await request.json();

    const customer = {
      id: Date.now(),
      ...body,
      qrUsed: false,
      assignedBooth: null,
    };

    customerData.push(customer);

    return HttpResponse.json(customer, {
      status: 201,
    });
  }),

  //----------------------------------------------------
  // UPDATE CUSTOMER
  //----------------------------------------------------

  http.put("/api/customers/:id", async ({ request, params }) => {
    const body = await request.json();

    customerData = customerData.map((customer) =>
      customer.id === Number(params.id)
        ? { ...customer, ...body }
        : customer
    );

    return HttpResponse.json({
      message: "Updated Successfully",
    });
  }),

  //----------------------------------------------------
  // DELETE CUSTOMER
  //----------------------------------------------------

  http.delete("/api/customers/:id", ({ params }) => {
    customerData = customerData.filter(
      (c) => c.id !== Number(params.id)
    );

    return HttpResponse.json({
      message: "Deleted Successfully",
    });
  }),

  //----------------------------------------------------
  // VERIFY QR
  //----------------------------------------------------

  http.get("/api/qr-codes/verify/:qrCode", ({ params }) => {
    const customer = customerData.find(
      (c) => c.qrCode === params.qrCode
    );

    if (!customer) {
      return HttpResponse.json(
        {
          message: "Invalid QR Code",
        },
        {
          status: 404,
        }
      );
    }

    if (customer.qrUsed) {
      return HttpResponse.json(
        {
          message: "QR already used",
        },
        {
          status: 400,
        }
      );
    }

    return HttpResponse.json(customer);
  }),

  //----------------------------------------------------
  // CHECK IN
  //----------------------------------------------------

  http.post("/api/customers/check-in", async ({ request }) => {
    const { qrCode } = await request.json();

    const customer = customerData.find(
      (c) => c.qrCode === qrCode
    );

    if (!customer) {
      return HttpResponse.json(
        { message: "Invalid QR" },
        { status: 404 }
      );
    }

    customer.qrUsed = true;
    customer.eventStatus = "Checked-In";

    return HttpResponse.json({
      message: "Checked In Successfully",
      customer,
    });
  }),

  //----------------------------------------------------
  // BOOTH LIST
  //----------------------------------------------------

  http.get("/api/booth-assignments", () => {
    return HttpResponse.json(boothData);
  }),

  //----------------------------------------------------
  // CREATE BOOTH ASSIGNMENT
  //----------------------------------------------------

  http.post("/api/booth-assignments", async ({ request }) => {
    const body = await request.json();

    const exists = boothData.find(
      (b) =>
        b.boothNumber === body.boothNumber &&
        b.customerId !== null
    );

    if (exists) {
      return HttpResponse.json(
        {
          message: "Booth already assigned",
        },
        {
          status: 400,
        }
      );
    }

    boothData.push({
      id: Date.now(),
      ...body,
    });

    const customer = customerData.find(
      (c) => c.id === body.customerId
    );

    if (customer) {
      customer.assignedBooth = body.boothNumber;
      customer.eventStatus = "Assigned";
    }

    return HttpResponse.json({
      message: "Assigned Successfully",
    });
  }),

  //----------------------------------------------------
  // UPDATE BOOTH
  //----------------------------------------------------

  http.put("/api/booth-assignments/:id", async ({ request, params }) => {
    const body = await request.json();

    boothData = boothData.map((b) =>
      b.id === Number(params.id)
        ? { ...b, ...body }
        : b
    );

    return HttpResponse.json({
      message: "Updated",
    });
  }),

  //----------------------------------------------------
  // DELETE BOOTH
  //----------------------------------------------------

  http.delete("/api/booth-assignments/:id", ({ params }) => {
    boothData = boothData.filter(
      (b) => b.id !== Number(params.id)
    );

    return HttpResponse.json({
      message: "Deleted",
    });
  }),

  //----------------------------------------------------
  // UPDATE STATUS
  //----------------------------------------------------

  http.post("/api/customer-status", async ({ request }) => {
    const body = await request.json();

    const customer = customerData.find(
      (c) => c.id === body.customerId
    );

    if (!customer) {
      return HttpResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    customer.eventStatus = body.status;
    customer.remarks = body.remarks;
    customer.followUpDate = body.followUpDate || null;

    historyData.push({
      id: Date.now(),
      customerId: body.customerId,
      status: body.status,
      remarks: body.remarks,
      followUpDate: body.followUpDate,
      updatedAt: new Date().toISOString(),
    });

    return HttpResponse.json({
      message: "Status Updated",
    });
  }),

  //----------------------------------------------------
  // STATUS HISTORY
  //----------------------------------------------------

  http.get("/api/customer-status/:customerId", ({ params }) => {
    const history = historyData.filter(
      (h) => h.customerId === Number(params.customerId)
    );

    return HttpResponse.json(history);
  }),
];