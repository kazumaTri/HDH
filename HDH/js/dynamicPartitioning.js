// Lấy các phần tử từ DOM
const resultTableBody = document.querySelector("#resultBody");
const displayOption = document.getElementById("displayOption");
const tableView = document.getElementById("table-view");
const chartView = document.getElementById("chart-view");

// Hàm thêm chú thích
function generateExplanation(
  process,
  allocated,
  partition,
  internalFragmentation
) {
  if (allocated) {
    return `Process ${process} was allocated to partition ${partition} with internal fragmentation of ${internalFragmentation}.`;
  } else {
    return `Process ${process} could not be allocated due to insufficient space.`;
  }
}

// Thuật toán First Fit
function firstFit(partitions, processes) {
  let results = [];
  let partitionStatus = [...partitions]; // Sao chép trạng thái ban đầu của phân vùng

  processes.forEach((process, index) => {
    let allocated = false;
    let internalFragmentation = 0;

    for (let i = 0; i < partitionStatus.length; i++) {
      if (partitionStatus[i] >= process) {
        internalFragmentation = partitionStatus[i] - process;
        results.push({
          process: `P${index + 1}`,
          size: process,
          partition: `Partition ${i + 1}`,
          internalFragmentation,
          explanation: generateExplanation(
            index + 1,
            true,
            i + 1,
            internalFragmentation
          ),
        });
        partitionStatus[i] -= process;
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      results.push({
        process: `P${index + 1}`,
        size: process,
        partition: "Not Allocated",
        internalFragmentation: "-",
        explanation: generateExplanation(index + 1, false),
      });
    }
  });

  return results;
}

// Thuật toán Best Fit
function bestFit(partitions, processes) {
  let results = [];
  let partitionStatus = [...partitions];

  processes.forEach((process, index) => {
    let bestIndex = -1;
    let minFragmentation = Infinity;

    for (let i = 0; i < partitionStatus.length; i++) {
      if (partitionStatus[i] >= process) {
        let fragmentation = partitionStatus[i] - process;
        if (fragmentation < minFragmentation) {
          minFragmentation = fragmentation;
          bestIndex = i;
        }
      }
    }

    if (bestIndex !== -1) {
      results.push({
        process: `P${index + 1}`,
        size: process,
        partition: `Partition ${bestIndex + 1}`,
        internalFragmentation: minFragmentation,
        explanation: generateExplanation(
          index + 1,
          true,
          bestIndex + 1,
          minFragmentation
        ),
      });
      partitionStatus[bestIndex] -= process;
    } else {
      results.push({
        process: `P${index + 1}`,
        size: process,
        partition: "Not Allocated",
        internalFragmentation: "-",
        explanation: generateExplanation(index + 1, false),
      });
    }
  });

  return results;
}

// Thuật toán Worst Fit
function worstFit(partitions, processes) {
  let results = [];
  let partitionStatus = [...partitions];

  processes.forEach((process, index) => {
    let worstIndex = -1;
    let maxFragmentation = -1;

    for (let i = 0; i < partitionStatus.length; i++) {
      if (partitionStatus[i] >= process) {
        let fragmentation = partitionStatus[i] - process;
        if (fragmentation > maxFragmentation) {
          maxFragmentation = fragmentation;
          worstIndex = i;
        }
      }
    }

    if (worstIndex !== -1) {
      results.push({
        process: `P${index + 1}`,
        size: process,
        partition: `Partition ${worstIndex + 1}`,
        internalFragmentation: maxFragmentation,
        explanation: generateExplanation(
          index + 1,
          true,
          worstIndex + 1,
          maxFragmentation
        ),
      });
      partitionStatus[worstIndex] -= process;
    } else {
      results.push({
        process: `P${index + 1}`,
        size: process,
        partition: "Not Allocated",
        internalFragmentation: "-",
        explanation: generateExplanation(index + 1, false),
      });
    }
  });

  return results;
}

// Biến lưu kết quả
let algorithmResults = [];
let currentStep = 0;

// Lấy phần tử <select> cho thuật toán
const algorithmSelect = document.querySelector("#allocationMethod");

// Hàm reset bảng
function resetTable() {
  algorithmResults = [];
  currentStep = 0;
  resultTableBody.innerHTML = "";
}

// Lắng nghe sự kiện thay đổi trên <select>
algorithmSelect.addEventListener("change", resetTable);

// Biến để lưu trữ thông tin về biểu đồ
const chartContainer = document.querySelector("#chartContainer");
const chartPlaceholder = document.querySelector(".chart-placeholder");

// Hàm tạo biểu đồ
function renderChart(results) {
  chartPlaceholder.innerHTML = ""; // Xóa biểu đồ cũ

  results.forEach((result, index) => {
    const bar = document.createElement("div");
    bar.style.display = "inline-block";
    bar.style.marginRight = "10px";
    bar.style.textAlign = "center";

    const barHeight = result.size * 10; // Chiều cao tỉ lệ theo kích thước process
    const barDiv = document.createElement("div");
    if (result.partition == "Not Allocated") {
      barDiv.style.backgroundColor = "red";
    } else {
      barDiv.style.backgroundColor = "green";
    }
    barDiv.style.width = "50px";
    barDiv.style.height = `50px`;

    barDiv.style.border = "1px solid black";

    // Thông tin chú thích
    const label = document.createElement("div");
    label.innerText = result.process;

    // Ghép phần tử
    bar.appendChild(barDiv);
    bar.appendChild(label);
    chartPlaceholder.appendChild(bar);
  });
}

// Hàm chạy thuật toán
function runDynamicPartitioning() {
  const partitionSizes = document
    .querySelector("#partitionSizes")
    .value.split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  const processSizes = document
    .querySelector("#processSizes")
    .value.split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  const algorithm = document.querySelector("#allocationMethod").value;
  const displayOption = document.querySelector("#displayOption").value;

  // Kiểm tra dữ liệu đầu vào
  if (partitionSizes.length === 0 || processSizes.length === 0) {
    alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
    return;
  }

  if (algorithmResults.length === 0) {
    if (algorithm === "First Fit") {
      algorithmResults = firstFit(partitionSizes, processSizes);
    } else if (algorithm === "Best Fit") {
      algorithmResults = bestFit(partitionSizes, processSizes);
    } else if (algorithm === "Worst Fit") {
      algorithmResults = worstFit(partitionSizes, processSizes);
    }
    currentStep = 0;
  }

  if (displayOption === "table") {
    tableView.style.display = "";
    chartView.style.display = "none";
  } else if (displayOption === "chart") {
    tableView.style.display = "none";
    chartView.style.display = "";
  }
  // Hiển thị thêm một bước
  if (currentStep < algorithmResults.length) {
    const result = algorithmResults[currentStep];
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${result.process}</td>
          <td>${result.size}</td>
          <td>${result.partition}</td>
          <td>${result.internalFragmentation}</td>
          <td>${result.explanation}</td>
        `;
    resultTableBody.appendChild(row);
    // Hiển thị biểu đồ
    if (displayOption === "chart") {
      renderChart(algorithmResults.slice(0, currentStep + 1));
    }
    currentStep++;
  } else {
    alert("Đã hiển thị toàn bộ các bước.");
  }
}
