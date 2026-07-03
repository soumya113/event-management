import { http, HttpResponse } from "msw";
import { customers, booths, statusHistory } from "./data";
import { adminCredential,jwtToken } from "../config/Constant";

let customerData = [...customers];
let boothData = [...booths];
let historyData = [...statusHistory];

const dashboard = () => {
  return {
    totalCustomers: customerData.length,

    checkedInCustomers: customerData.filter(
      (c) => c.eventStatus === "Checked-In",
    ).length,

    waitingCustomers: customerData.filter((c) => c.eventStatus === "Waiting")
      .length,

    assignedCustomers: customerData.filter((c) => c.assignedBooth).length,

    completedCustomers: customerData.filter(
      (c) => c.eventStatus === "Completed",
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
        token: jwtToken,
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
      { status: 401 },
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
          c.mobile.includes(search),
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
    const customer = customerData.find((c) => c.id === Number(params.id));

    if (!customer) {
      return HttpResponse.json(
        { message: "Customer not found" },
        { status: 404 },
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

    console.log("After POST", customerData);

    return HttpResponse.json(customer, {
      status: 201,
    });
  }),

  //----------------------------------------------------
  // UPDATE CUSTOMER
  //----------------------------------------------------

  http.put("/api/customers/:id", async ({ request, params }) => {
    const body = await request.json();

    const index = customerData.findIndex((c) => c.id === Number(params.id));

    if (index === -1) {
      return HttpResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    customerData[index] = {
      ...customerData[index],
      ...body,
    };

    return HttpResponse.json(customerData[index]);
  }),

  //----------------------------------------------------
  // DELETE CUSTOMER
  //----------------------------------------------------

  http.delete("/api/customers/:id", ({ params }) => {
    customerData = customerData.filter((c) => c.id !== Number(params.id));

    return HttpResponse.json({
      message: "Deleted Successfully",
    });
  }),

  //----------------------------------------------------
  // VERIFY QR
  //----------------------------------------------------

  http.get("/api/qr-codes/verify/:qrCode", ({ params }) => {
    const customer = customerData.find((c) => c.qrCode === params.qrCode);

    if (!customer) {
      return HttpResponse.json(
        {
          message: "Invalid QR Code",
        },
        {
          status: 404,
        },
      );
    }

    if (customer.qrUsed) {
      return HttpResponse.json(
        {
          message: "QR already used",
        },
        {
          status: 400,
        },
      );
    }

    return HttpResponse.json(customer);
  }),

  //----------------------------------------------------
  // CHECK IN
  //----------------------------------------------------

  http.post("/api/customers/check-in", async ({ request }) => {
    const { qrCode } = await request.json();

    const customer = customerData.find((c) => c.qrCode === qrCode);

    if (!customer) {
      return HttpResponse.json({ message: "Invalid QR" }, { status: 404 });
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
    const result = boothData.map((booth) => {
      const customer = customerData.find((c) => c.id === booth.customerId);

      return {
        ...booth,
        customerName: customer?.name || "",
      };
    });

    return HttpResponse.json(result);
  }),

  //----------------------------------------------------
  // CREATE BOOTH ASSIGNMENT
  //----------------------------------------------------

  http.post("/api/booth-assignments", async ({ request }) => {
    const body = await request.json();

    //----------------------------------------
    // Prevent duplicate booth
    //----------------------------------------

    const boothExists = boothData.find(
      (b) => b.boothNumber === body.boothNumber && b.customerId !== null,
    );

    if (boothExists) {
      return HttpResponse.json(
        {
          message: "Booth already assigned",
        },
        {
          status: 400,
        },
      );
    }

    //----------------------------------------
    // Prevent customer duplicate assignment
    //----------------------------------------

    const customerAssigned = boothData.find(
      (b) => b.customerId === body.customerId,
    );

    if (customerAssigned) {
      return HttpResponse.json(
        {
          message: "Customer already has a booth",
        },
        {
          status: 400,
        },
      );
    }

    //----------------------------------------

    const assignment = {
      id: Date.now(),
      ...body,
    };

    boothData.push(assignment);

    //----------------------------------------
    // Update customer
    //----------------------------------------

    const customer = customerData.find((c) => c.id === body.customerId);

    if (customer) {
      customer.assignedBooth = body.boothNumber;

      customer.eventStatus = "Assigned";
    }

    return HttpResponse.json(assignment, {
      status: 201,
    });
  }),

  //----------------------------------------------------
  // UPDATE BOOTH
  //----------------------------------------------------

  http.put("/api/booth-assignments/:id", async ({ request, params }) => {
    const body = await request.json();

    const assignment = boothData.find((b) => b.id === Number(params.id));

    if (!assignment) {
      return HttpResponse.json(
        {
          message: "Assignment not found",
        },
        {
          status: 404,
        },
      );
    }

    //----------------------------------------
    // Check duplicate booth
    //----------------------------------------

    const duplicate = boothData.find(
      (b) => b.id !== Number(params.id) && b.boothNumber === body.boothNumber,
    );

    if (duplicate) {
      return HttpResponse.json(
        {
          message: "Booth already assigned",
        },
        {
          status: 400,
        },
      );
    }

    //----------------------------------------
    // Reset old customer
    //----------------------------------------

    const oldCustomer = customerData.find(
      (c) => c.id === assignment.customerId,
    );

    if (oldCustomer) {
      oldCustomer.assignedBooth = null;

      oldCustomer.eventStatus = "Checked-In";
    }

    //----------------------------------------
    // Update assignment
    //----------------------------------------

    assignment.customerId = body.customerId;

    assignment.boothNumber = body.boothNumber;

    assignment.salesManager = body.salesManager;

    assignment.status = body.status;

    //----------------------------------------
    // Update new customer
    //----------------------------------------

    const newCustomer = customerData.find((c) => c.id === body.customerId);

    if (newCustomer) {
      newCustomer.assignedBooth = body.boothNumber;

      newCustomer.eventStatus = "Assigned";
    }

    return HttpResponse.json({
      message: "Updated Successfully",
    });
  }),
  //----------------------------------------------------
  // DELETE BOOTH
  //----------------------------------------------------
  http.delete("/api/booth-assignments/:id", ({ params }) => {
    const assignment = boothData.find((b) => b.id === Number(params.id));

    if (!assignment) {
      return HttpResponse.json(
        {
          message: "Assignment not found",
        },
        {
          status: 404,
        },
      );
    }

    //----------------------------------------
    // Reset Customer
    //----------------------------------------

    const customer = customerData.find((c) => c.id === assignment.customerId);

    if (customer) {
      customer.assignedBooth = null;

      customer.eventStatus = "Checked-In";
    }

    //----------------------------------------

    boothData = boothData.filter((b) => b.id !== Number(params.id));

    return HttpResponse.json({
      message: "Assignment Deleted",
    });
  }),

  //----------------------------------------------------
  // UPDATE STATUS
  //----------------------------------------------------

  http.post("/api/customer-status", async ({ request }) => {
    const body = await request.json();

    const customer = customerData.find((c) => c.id === body.customerId);

    if (!customer) {
      return HttpResponse.json(
        { message: "Customer not found" },
        { status: 404 },
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
      (h) => h.customerId === Number(params.customerId),
    );

    return HttpResponse.json(history);
  }),
];