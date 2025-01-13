// chart.js

// Hàm vẽ biểu đồ (Chart.js)
function drawChart(results) {
  // Lấy phần tử canvas để vẽ biểu đồ
  const ctx = document.getElementById("memoryChart").getContext("2d");

  // Xử lý dữ liệu cho biểu đồ
  const processNames = results.map((result) => result.process); // Tên quá trình (P1, P2, P3, ...)
  const partitionNames = results.map((result) => result.partition); // Tên phân vùng (Partition 1, Partition 2, ...)
  const internalFragmentation = results.map((result) =>
    result.internalFragmentation === "-" ? 0 : result.internalFragmentation
  ); // Mức độ phân mảnh

  // Dữ liệu biểu đồ
  const chartData = {
    labels: processNames,
    datasets: [
      {
        label: "Internal Fragmentation (KB)",
        data: internalFragmentation,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const config = {
    type: "bar", // Biểu đồ thanh (Bar Chart)
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Fragmentation (KB)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `Fragmentation: ${tooltipItem.raw} KB`;
            },
          },
        },
      },
    },
  };

  // Vẽ biểu đồ
  const memoryChart = new Chart(ctx, config);
}
