import Chart from "chart.js/auto";

// Lấy phần tử Canvas cho biểu đồ
const memoryChartCanvas = document
  .getElementById("memoryChart")
  .getContext("2d");

let myChart = null;

// Hàm tạo biểu đồ
function createChart(allocated, free) {
  const chartData = {
    labels: ["Allocated", "Free"],
    datasets: [
      {
        label: "Memory Usage",
        data: [allocated, free],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(200, 200, 200, 0.8)",
        ],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(200, 200, 200, 1)"],
        borderWidth: 1,
      },
    ],
  };

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(memoryChartCanvas, {
    type: "pie",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

export { createChart };
