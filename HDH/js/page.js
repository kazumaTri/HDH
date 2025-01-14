// Lấy các phần tử từ DOM
const resultTableBody = document.querySelector("#resultBody");
const pageFaultsCountElement = document.querySelector("#pageFaultsCount"); // Phần tử hiển thị tổng số page faults

// Hàm thêm chú thích
function generateExplanation(page, pageFault) {
  if (pageFault === "Yes") {
    return `Page ${page} was not found in frames, so it caused a fault.`;
  } else {
    return `Page ${page} was already in the frames, no fault.`;
  }
}

// Các thuật toán page replacement
function fifo(pageReferences, framesCount) {
  let frames = new Array(framesCount).fill(null);
  let pageFaults = 0;
  let pageFaultsPerStep = [];
  let pointer = 0;

  pageReferences.forEach((page) => {
    const prevPageFaults = pageFaults;
    if (!frames.includes(page)) {
      pageFaults++;
      frames[pointer] = page;
      pointer = (pointer + 1) % framesCount;
    }
    const pageFault = pageFaults > prevPageFaults ? "Yes" : "No";
    pageFaultsPerStep.push({
      page,
      frames: [...frames],
      pageFault,
      explanation: generateExplanation(page, pageFault),
    });
  });

  return { pageFaultsPerStep, pageFaults };
}

function lru(pageReferences, framesCount) {
  let frames = new Array(framesCount).fill(null);
  let pageFaults = 0;
  let pageFaultsPerStep = [];
  let cache = new Map();

  pageReferences.forEach((page) => {
    const prevPageFaults = pageFaults;
    if (!cache.has(page)) {
      if (frames.includes(null)) {
        let emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
      } else {
        frames.shift();
        frames.push(page);
      }
      pageFaults++;
    } else {
      frames.splice(frames.indexOf(page), 1);
      frames.push(page);
    }
    const pageFault = pageFaults > prevPageFaults ? "Yes" : "No";
    pageFaultsPerStep.push({
      page,
      frames: [...frames],
      pageFault,
      explanation: generateExplanation(page, pageFault),
    });
  });

  return { pageFaultsPerStep, pageFaults };
}

function optimal(pageReferences, framesCount) {
  let frames = new Array(framesCount).fill(null);
  let pageFaults = 0;
  let pageFaultsPerStep = [];

  pageReferences.forEach((page, index) => {
    const prevPageFaults = pageFaults;
    if (!frames.includes(page)) {
      pageFaults++;
      if (frames.includes(null)) {
        frames[frames.indexOf(null)] = page;
      } else {
        let futureUse = frames.map((frame) => {
          let futureIndex = pageReferences.slice(index + 1).indexOf(frame);
          return futureIndex === -1 ? Infinity : futureIndex;
        });
        let farthestPageIndex = futureUse.indexOf(Math.max(...futureUse));
        frames[farthestPageIndex] = page;
      }
    }
    const pageFault = pageFaults > prevPageFaults ? "Yes" : "No";
    pageFaultsPerStep.push({
      page,
      frames: [...frames],
      pageFault,
      explanation: generateExplanation(page, pageFault),
    });
  });

  return { pageFaultsPerStep, pageFaults };
}

let algorithmResults = []; // Lưu kết quả của thuật toán
let currentStep = 0; // Theo dõi bước hiện tại
let totalPageFaults = 0; // Lưu tổng số lỗi trang

// Lấy phần tử <select> cho thuật toán
const algorithmSelect = document.querySelector("#algorithm");

// Hàm reset bảng
function resetTable() {
  algorithmResults = []; // Xóa kết quả hiện tại
  currentStep = 0; // Đặt lại bước hiện tại
  totalPageFaults = 0; // Reset tổng số lỗi trang
  resultTableBody.innerHTML = ""; // Xóa bảng kết quả
  pageFaultsCountElement.innerText = "0"; // Đặt lại số lỗi trang
}

// Lắng nghe sự kiện thay đổi trên <select>
algorithmSelect.addEventListener("change", resetTable);

// Hàm chạy thuật toán
function runAlgorithm() {
  // Lấy dữ liệu từ các trường nhập liệu
  const pageReferences = document
    .querySelector("#pageReferences")
    .value.split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  const framesCount = parseInt(document.querySelector("#frameCount").value);
  const algorithm = document.querySelector("#algorithm").value;

  // Kiểm tra dữ liệu đầu vào
  if (pageReferences.length === 0 || isNaN(framesCount) || framesCount <= 0) {
    alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
    return;
  }

  // Nếu chưa chạy hoặc muốn khởi động lại, tính toán lại kết quả
  if (algorithmResults.length === 0) {
    let result;
    if (algorithm === "FIFO") {
      result = fifo(pageReferences, framesCount);
    } else if (algorithm === "LRU") {
      result = lru(pageReferences, framesCount);
    } else if (algorithm === "MIN/Optimal") {
      result = optimal(pageReferences, framesCount);
    }
    algorithmResults = result.pageFaultsPerStep;
    currentStep = 0; // Đặt lại bước hiện tại
  }

  // Hiển thị thêm một bước
  if (currentStep < algorithmResults.length) {
    const result = algorithmResults[currentStep];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${currentStep + 1}</td>
      <td>${result.page}</td>
      <td>${result.frames.join(", ")}</td>
      <td>${result.pageFault}</td>
      <td>${result.explanation}</td>
    `;
    resultTableBody.appendChild(row);
    currentStep++;

    // Cập nhật tổng số lỗi trang sau mỗi bước
    if (result.pageFault === "Yes") {
      totalPageFaults++;
    }
    pageFaultsCountElement.innerText = totalPageFaults; // Cập nhật số lỗi trang
  } else {
    alert("Đã hiển thị toàn bộ các bước.");
  }
}
