// =====================================================
// EMPLOYEE PAYROLL SYSTEM
// =====================================================


// New storage key
// Purane data ke saath conflict nahi hoga.

const STORAGE_KEY = "EMPLOYEE_PAYROLL_FINAL_2026";


// Get employees

let employees =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


// Edit mode

let editIndex = -1;


// Current payslip

let currentPayslip = null;


// =====================================================
// GET ELEMENTS
// =====================================================

const form =
    document.getElementById("employeeForm");

const nameInput =
    document.getElementById("name");

const idInput =
    document.getElementById("employeeId");

const departmentInput =
    document.getElementById("department");

const monthInput =
    document.getElementById("payMonth");

const basicInput =
    document.getElementById("basicSalary");

const bonusInput =
    document.getElementById("bonus");

const overtimeInput =
    document.getElementById("overtime");

const deductionInput =
    document.getElementById("otherDeduction");

const table =
    document.getElementById("employeeTable");

const emptyMessage =
    document.getElementById("emptyMessage");


// =====================================================
// MONEY FORMAT
// =====================================================

function money(number) {

    return "₹" +
        Number(number)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// =====================================================
// SALARY CALCULATION
// =====================================================

function calculateSalary(
    basic,
    bonus,
    overtime,
    otherDeduction
) {

    // HRA = 20% of basic

    const hra =
        basic * 0.20;


    // DA = 10% of basic

    const da =
        basic * 0.10;


    // PF = 12% of basic

    const pf =
        basic * 0.12;


    // Tax = 10% of basic

    const tax =
        basic * 0.10;


    // Gross salary

    const gross =
        basic +
        hra +
        da +
        bonus +
        overtime;


    // Total deductions

    const totalDeductions =
        pf +
        tax +
        otherDeduction;


    // Net salary

    const netSalary =
        gross -
        totalDeductions;


    return {

        basic: basic,

        hra: hra,

        da: da,

        bonus: bonus,

        overtime: overtime,

        gross: gross,

        pf: pf,

        tax: tax,

        otherDeduction: otherDeduction,

        totalDeductions: totalDeductions,

        netSalary: netSalary

    };

}


// =====================================================
// SAVE DATA
// =====================================================

function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(employees)

    );

}


// =====================================================
// GET FORM DATA
// =====================================================

function getFormData() {

    const basic =
        Number(basicInput.value);


    const bonus =
        Number(bonusInput.value) || 0;


    const overtime =
        Number(overtimeInput.value) || 0;


    const otherDeduction =
        Number(deductionInput.value) || 0;


    const salary =
        calculateSalary(

            basic,

            bonus,

            overtime,

            otherDeduction

        );


    return {

        id:
            idInput.value
            .trim()
            .toUpperCase(),

        name:
            nameInput.value
            .trim(),

        department:
            departmentInput.value,

        payMonth:
            monthInput.value,

        ...salary

    };

}


// =====================================================
// ADD / UPDATE EMPLOYEE
// =====================================================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const employee =
            getFormData();


        // Validation

        if (
            !employee.name ||
            !employee.id ||
            !employee.department ||
            !employee.payMonth
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        if (employee.basic <= 0) {

            alert(
                "Please enter a valid basic salary."
            );

            return;

        }


        // Duplicate ID check

        const duplicate =
            employees.some(
                (item, index) =>

                    item.id === employee.id &&
                    index !== editIndex
            );


        if (duplicate) {

            alert(
                "Employee ID already exists!"
            );

            return;

        }


        // ADD

        if (editIndex === -1) {

            employees.push(employee);

            alert(
                "Employee added successfully!"
            );

        }

        // UPDATE

        else {

            employees[editIndex] =
                employee;

            alert(
                "Employee updated successfully!"
            );

        }


        saveData();

        resetForm();

        displayEmployees();

    }
);


// =====================================================
// RESET FORM
// =====================================================

function resetForm() {

    form.reset();


    // Current month

    const date =
        new Date();


    monthInput.value =

        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    bonusInput.value = 0;

    overtimeInput.value = 0;

    deductionInput.value = 0;


    editIndex = -1;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Employee";


    document.getElementById(
        "submitBtn"
    ).textContent =
        "Add Employee";


    document.getElementById(
        "cancelBtn"
    ).classList.add(
        "hidden"
    );

}


document
    .getElementById("cancelBtn")
    .addEventListener(
        "click",
        resetForm
    );


// =====================================================
// DISPLAY EMPLOYEES
// =====================================================

function displayEmployees() {

    const search =
        document.getElementById(
            "search"
        )
        .value
        .trim()
        .toLowerCase();


    const department =
        document.getElementById(
            "departmentFilter"
        ).value;


    const salaryFilter =
        document.getElementById(
            "salaryFilter"
        ).value;


    table.innerHTML = "";


    let filtered =
        employees.map(
            (employee, index) => ({
                employee,
                index
            })
        );


    // Search

    filtered =
        filtered.filter(
            item => {

                const employee =
                    item.employee;


                return (

                    employee.name
                    .toLowerCase()
                    .includes(search)

                    ||

                    employee.id
                    .toLowerCase()
                    .includes(search)

                );

            }
        );


    // Department filter

    if (department) {

        filtered =
            filtered.filter(
                item =>
                    item.employee.department ===
                    department
            );

    }


    // Salary filter

    if (salaryFilter === "low") {

        filtered =
            filtered.filter(
                item =>
                    item.employee.netSalary < 30000
            );

    }


    if (salaryFilter === "medium") {

        filtered =
            filtered.filter(
                item =>

                    item.employee.netSalary >=
                    30000

                    &&

                    item.employee.netSalary <=
                    60000

            );

    }


    if (salaryFilter === "high") {

        filtered =
            filtered.filter(
                item =>
                    item.employee.netSalary > 60000
            );

    }


    // Empty

    if (filtered.length === 0) {

        emptyMessage.style.display =
            "block";

    }

    else {

        emptyMessage.style.display =
            "none";

    }


    // Rows

    filtered.forEach(
        item => {

            const employee =
                item.employee;

            const index =
                item.index;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${employee.id}
                </td>

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>
                    ${money(employee.basic)}
                </td>

                <td>
                    ${money(employee.gross)}
                </td>

                <td>
                    ${money(employee.pf)}
                </td>

                <td>
                    ${money(employee.tax)}
                </td>

                <td>
                    <b>
                        ${money(employee.netSalary)}
                    </b>
                </td>

                <td>
                    ${formatMonth(employee.payMonth)}
                </td>

                <td>

                    <button
                        class="primary-btn action"
                        onclick="showPayslip(${index})">

                        Payslip

                    </button>


                    <button
                        class="warning-btn action"
                        onclick="editEmployee(${index})">

                        Edit

                    </button>


                    <button
                        class="danger-btn action"
                        onclick="deleteEmployee(${index})">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );


    updateDashboard();

    updateChart();

}


// =====================================================
// FORMAT MONTH
// =====================================================

function formatMonth(month) {

    if (!month) {

        return "-";

    }


    const date =
        new Date(month + "-01");


    return date.toLocaleDateString(
        "en-IN",
        {
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================================
// EDIT EMPLOYEE
// =====================================================

function editEmployee(index) {

    const employee =
        employees[index];


    nameInput.value =
        employee.name;


    idInput.value =
        employee.id;


    departmentInput.value =
        employee.department;


    monthInput.value =
        employee.payMonth;


    basicInput.value =
        employee.basic;


    bonusInput.value =
        employee.bonus;


    overtimeInput.value =
        employee.overtime;


    deductionInput.value =
        employee.otherDeduction;


    editIndex =
        index;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Edit Employee";


    document.getElementById(
        "submitBtn"
    ).textContent =
        "Update Employee";


    document.getElementById(
        "cancelBtn"
    ).classList.remove(
        "hidden"
    );


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


// =====================================================
// DELETE EMPLOYEE
// =====================================================

function deleteEmployee(index) {

    const employee =
        employees[index];


    const confirmDelete =
        confirm(
            "Do you want to delete " +
            employee.name +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    employees.splice(
        index,
        1
    );


    saveData();


    if (
        currentPayslip === index
    ) {

        currentPayslip =
            null;

        document.getElementById(
            "payslip"
        ).innerHTML = `

            <p class="empty">

                Click <b>Payslip</b>
                button from employee list.

            </p>

        `;

    }


    displayEmployees();

}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    const count =
        employees.length;


    let total =
        0;


    employees.forEach(
        employee => {

            total +=
                employee.netSalary;

        }
    );


    const average =
        count > 0
            ? total / count
            : 0;


    let highest =
        0;


    let lowest =
        0;


    if (employees.length > 0) {

        const salaries =
            employees.map(
                employee =>
                    employee.netSalary
            );


        highest =
            Math.max(...salaries);


        lowest =
            Math.min(...salaries);

    }


    document.getElementById(
        "totalEmployees"
    ).textContent =
        count;


    document.getElementById(
        "totalPayroll"
    ).textContent =
        money(total);


    document.getElementById(
        "averageSalary"
    ).textContent =
        money(average);


    document.getElementById(
        "highestSalary"
    ).textContent =
        money(highest);


    document.getElementById(
        "lowestSalary"
    ).textContent =
        money(lowest);

}


// =====================================================
// PAYSLIP
// =====================================================

function showPayslip(index) {

    const employee =
        employees[index];


    currentPayslip =
        index;


    const payslip =
        document.getElementById(
            "payslip"
        );


    payslip.innerHTML = `

        <h2>
            Employee Payslip
        </h2>


        <p>
            <b>ABC Technologies</b>
        </p>


        <br>


        <div class="payslip-info">

            <div>
                <b>Employee ID</b>
                <br>
                ${employee.id}
            </div>


            <div>
                <b>Name</b>
                <br>
                ${employee.name}
            </div>


            <div>
                <b>Department</b>
                <br>
                ${employee.department}
            </div>


            <div>
                <b>Pay Month</b>
                <br>
                ${formatMonth(
                    employee.payMonth
                )}
            </div>


            <div>
                <b>Status</b>
                <br>
                Paid
            </div>


            <div>
                <b>Date</b>
                <br>
                ${new Date()
                    .toLocaleDateString(
                        "en-IN"
                    )}
            </div>

        </div>


        <table class="payslip-table">

            <tr>

                <th>
                    Earnings
                </th>

                <th>
                    Amount
                </th>

            </tr>


            <tr>

                <td>
                    Basic Salary
                </td>

                <td>
                    ${money(
                        employee.basic
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    HRA (20%)
                </td>

                <td>
                    ${money(
                        employee.hra
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    DA (10%)
                </td>

                <td>
                    ${money(
                        employee.da
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Bonus
                </td>

                <td>
                    ${money(
                        employee.bonus
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Overtime
                </td>

                <td>
                    ${money(
                        employee.overtime
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    <b>Gross Salary</b>
                </td>

                <td>
                    <b>
                        ${money(
                            employee.gross
                        )}
                    </b>
                </td>

            </tr>


            <tr>

                <th>
                    Deductions
                </th>

                <th>
                    Amount
                </th>

            </tr>


            <tr>

                <td>
                    PF (12%)
                </td>

                <td>
                    ${money(
                        employee.pf
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Tax (10%)
                </td>

                <td>
                    ${money(
                        employee.tax
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    Other Deduction
                </td>

                <td>
                    ${money(
                        employee.otherDeduction
                    )}
                </td>

            </tr>


            <tr>

                <td>
                    <b>Total Deduction</b>
                </td>

                <td>
                    <b>
                        ${money(
                            employee.totalDeductions
                        )}
                    </b>
                </td>

            </tr>


            <tr>

                <td class="net">
                    NET SALARY
                </td>

                <td class="net">
                    ${money(
                        employee.netSalary
                    )}
                </td>

            </tr>

        </table>

    `;


    document.getElementById(
        "payslipBox"
    ).scrollIntoView(
        {
            behavior: "smooth"
        }
    );

}


// =====================================================
// PRINT
// =====================================================

document.getElementById(
    "printBtn"
).addEventListener(
    "click",
    function() {

        if (currentPayslip === null) {

            alert(
                "First generate a payslip."
            );

            return;

        }


        window.print();

    }
);


// =====================================================
// SEARCH
// =====================================================

document.getElementById(
    "search"
).addEventListener(
    "input",
    displayEmployees
);


document.getElementById(
    "departmentFilter"
).addEventListener(
    "change",
    displayEmployees
);


document.getElementById(
    "salaryFilter"
).addEventListener(
    "change",
    displayEmployees
);


// =====================================================
// DEPARTMENT CHART
// =====================================================

function updateChart() {

    const chart =
        document.getElementById(
            "departmentChart"
        );


    chart.innerHTML = "";


    if (employees.length === 0) {

        chart.innerHTML = `

            <p class="empty">
                Add employees to see chart.
            </p>

        `;

        return;

    }


    const departments = {};


    employees.forEach(
        employee => {

            if (
                !departments[
                    employee.department
                ]
            ) {

                departments[
                    employee.department
                ] = 0;

            }


            departments[
                employee.department
            ]++;

        }
    );


    const max =
        Math.max(
            ...Object.values(
                departments
            )
        );


    Object.entries(
        departments
    ).forEach(
        ([department, count]) => {

            const width =
                (count / max) * 100;


            chart.innerHTML += `

                <div class="chart-row">

                    <b>
                        ${department}
                    </b>


                    <div class="chart-bg">

                        <div
                            class="chart-bar"
                            style="width:${width}%">
                        </div>

                    </div>


                    <b>
                        ${count}
                    </b>

                </div>

            `;

        }
    );

}


// =====================================================
// EXPORT CSV
// =====================================================

document.getElementById(
    "exportBtn"
).addEventListener(
    "click",
    function() {

        if (employees.length === 0) {

            alert(
                "No employee data available."
            );

            return;

        }


        let csv =

            "Employee ID,Name,Department,Month,Basic,HRA,DA,Bonus,Overtime,Gross,PF,Tax,Other Deduction,Net Salary\n";


        employees.forEach(
            employee => {

                csv +=

                    employee.id + "," +

                    employee.name + "," +

                    employee.department + "," +

                    employee.payMonth + "," +

                    employee.basic + "," +

                    employee.hra + "," +

                    employee.da + "," +

                    employee.bonus + "," +

                    employee.overtime + "," +

                    employee.gross + "," +

                    employee.pf + "," +

                    employee.tax + "," +

                    employee.otherDeduction + "," +

                    employee.netSalary +

                    "\n";

            }
        );


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "employee-payroll.csv";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


// =====================================================
// CLEAR ALL DATA
// =====================================================

document.getElementById(
    "clearBtn"
).addEventListener(
    "click",
    function() {

        if (employees.length === 0) {

            alert(
                "No employee data available."
            );

            return;

        }


        const answer =
            confirm(
                "Are you sure you want to delete all employees?"
            );


        if (!answer) {

            return;

        }


        employees = [];


        saveData();


        currentPayslip =
            null;


        document.getElementById(
            "payslip"
        ).innerHTML = `

            <p class="empty">

                Click <b>Payslip</b>
                button from employee list.

            </p>

        `;


        resetForm();


        displayEmployees();

    }
);


// =====================================================
// DARK MODE
// =====================================================

document.getElementById(
    "darkModeBtn"
).addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        this.textContent =

            isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";

    }
);


// =====================================================
// INITIAL SETUP
// =====================================================

function initialize() {

    resetForm();

    displayEmployees();

}


// Run application

initialize();