const monthlySalaryInput = document.getElementById("monthlySalary");
const taxFreeAmountInput = document.getElementById("taxFreeAmount");
const dependentsInput = document.getElementById("dependents");
const netSalaryValue = document.getElementById("netSalaryValue");
const salaryBreakdown = document.getElementById("salaryBreakdown");
const salaryCalculateButton = document.getElementById("salaryCalculateButton");
const salaryResetButton = document.getElementById("salaryResetButton");

const hourlyWageInput = document.getElementById("hourlyWage");
const weeklyHoursInput = document.getElementById("weeklyHours");
const workDaysInput = document.getElementById("workDays");
const weeksPerMonthInput = document.getElementById("weeksPerMonth");
const holidayPayValue = document.getElementById("holidayPayValue");
const holidayBreakdown = document.getElementById("holidayBreakdown");
const holidayCalculateButton = document.getElementById("holidayCalculateButton");
const holidayResetButton = document.getElementById("holidayResetButton");

function formatCurrency(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function clampNumber(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function renderRows(target, rows) {
  target.innerHTML = "";

  rows.forEach((item) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<strong>${item.label}</strong><span>${item.value}</span>`;
    target.appendChild(row);
  });
}

function calculateSalary() {
  const monthlySalary = clampNumber(Number(monthlySalaryInput.value));
  const taxFreeAmount = Math.min(clampNumber(Number(taxFreeAmountInput.value)), monthlySalary);
  const dependents = Number(dependentsInput.value);
  const taxableIncome = Math.max(monthlySalary - taxFreeAmount, 0);

  const pension = taxableIncome * 0.045;
  const healthInsurance = taxableIncome * 0.03545;
  const longTermCare = healthInsurance * 0.1295;
  const employmentInsurance = taxableIncome * 0.009;

  let incomeTaxRate = 0.03;
  if (taxableIncome >= 5000000) incomeTaxRate = 0.055;
  else if (taxableIncome >= 4000000) incomeTaxRate = 0.045;
  else if (taxableIncome >= 3000000) incomeTaxRate = 0.04;

  const dependentRelief = Math.max(0, dependents - 1) * 12000;
  const incomeTax = Math.max(taxableIncome * incomeTaxRate - dependentRelief, 0);
  const localIncomeTax = incomeTax * 0.1;

  const totalDeduction = pension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;
  const netSalary = Math.max(monthlySalary - totalDeduction, 0);

  netSalaryValue.textContent = formatCurrency(netSalary);

  renderRows(salaryBreakdown, [
    { label: "국민연금", value: formatCurrency(pension) },
    { label: "건강보험", value: formatCurrency(healthInsurance) },
    { label: "장기요양보험", value: formatCurrency(longTermCare) },
    { label: "고용보험", value: formatCurrency(employmentInsurance) },
    { label: "소득세", value: formatCurrency(incomeTax) },
    { label: "지방소득세", value: formatCurrency(localIncomeTax) },
    { label: "총 공제액", value: formatCurrency(totalDeduction) }
  ]);
}

function calculateHolidayPay() {
  const hourlyWage = clampNumber(Number(hourlyWageInput.value));
  const weeklyHours = clampNumber(Number(weeklyHoursInput.value));
  const workDays = clampNumber(Number(workDaysInput.value));
  const weeksPerMonth = clampNumber(Number(weeksPerMonthInput.value));

  const regularWeeklyPay = hourlyWage * weeklyHours;
  const dailyAverageHours = workDays > 0 ? weeklyHours / workDays : 0;
  const weeklyHolidayPay = weeklyHours >= 15 ? dailyAverageHours * hourlyWage : 0;
  const weeklyTotalPay = regularWeeklyPay + weeklyHolidayPay;
  const monthlyHolidayPay = weeklyHolidayPay * weeksPerMonth;
  const monthlyEstimatedPay = weeklyTotalPay * weeksPerMonth;

  holidayPayValue.textContent = formatCurrency(weeklyHolidayPay);

  renderRows(holidayBreakdown, [
    { label: "주간 기본급", value: formatCurrency(regularWeeklyPay) },
    { label: "주휴 포함 주간 총액", value: formatCurrency(weeklyTotalPay) },
    { label: "월 환산 주휴수당", value: formatCurrency(monthlyHolidayPay) },
    { label: "월 환산 총임금", value: formatCurrency(monthlyEstimatedPay) }
  ]);
}

function resetSalary() {
  monthlySalaryInput.value = "3000000";
  taxFreeAmountInput.value = "200000";
  dependentsInput.value = "1";
  calculateSalary();
}

function resetHolidayPay() {
  hourlyWageInput.value = "10030";
  weeklyHoursInput.value = "20";
  workDaysInput.value = "5";
  weeksPerMonthInput.value = "4.345";
  calculateHolidayPay();
}

salaryCalculateButton.addEventListener("click", calculateSalary);
salaryResetButton.addEventListener("click", resetSalary);
holidayCalculateButton.addEventListener("click", calculateHolidayPay);
holidayResetButton.addEventListener("click", resetHolidayPay);

calculateSalary();
calculateHolidayPay();
