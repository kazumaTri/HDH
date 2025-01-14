// Lấy phần tử DOM liên quan
const resultTableBody = document.querySelector("#resultBody");

// Hàm reset bảng
function resetTable() {
  resultTableBody.innerHTML = "";
}

// Hàm cập nhật bảng
function updateTable(results) {
  resetTable();

  results.forEach((result) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${result.process}</td>
      <td>${result.size}</td>
      <td>${result.partition}</td>
      <td>${result.internalFragmentation}</td>
      <td>${result.explanation}</td>
    `;
    resultTableBody.appendChild(row);
  });
}

export { resetTable, updateTable };
