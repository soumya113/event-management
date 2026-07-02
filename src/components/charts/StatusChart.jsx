import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

const StatusChart = ({ summary }) => {
  const data = [
    {
      name: "Waiting",
      value: summary.waitingCustomers,
    },
    {
      name: "Checked In",
      value: summary.checkedInCustomers,
    },
    {
      name: "Assigned",
      value: summary.assignedCustomers,
    },
    {
      name: "Completed",
      value: summary.completedCustomers,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={120} label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusChart;
