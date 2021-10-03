const inquirer = require('inquirer')
const mysql = require('mysql2')

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root',
      database: 'departments_db'
    },
    console.log(`Connected to the departments_db database.`)
  );

const startMenu = [
    {
        type: 'list',
        message: 'Employee Tracker',
        name: 'menu',
        choices: ['View Menu', 'Add/Update Menu',]
    },
];

const viewMenu = [
    {
     type: 'list',
     message: 'What would you like to view?',
     name: 'view',
     choices: ['Departments', 'Roles', 'Employees', 'Back']
    }
];

const addMenu = [
    {
        type: 'list',
        message: 'What would you like to add or update?',
        name: 'add',
        choices: ['Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Back']
    }
];

const addDepartmentPrompt = [
    {
        type: 'input',
        message: 'Please enter new department name',
        name: 'name'
    }
]

const addEmployeePrompt = [
    {
        type: 'input',
        message: "Please enter employee's first name",
        name: 'first_name'
    },
    {
        type: 'input',
        message: "Please enter employee's last name",
        name: 'last_name'
    },
    {
        type: 'list',
        message: "What is the employee's role?",
        name: 'role',
        choices: roleList,
        default: "no assigned role"
    },
    {
        type: 'list',
        message: "who is the manager?",
        name: 'manager',
        choices: managerList,
        default: "no assigned manager"
    }
]

 function mainMenu(){ 
    inquirer.prompt(startMenu)
    .then((answers) => {
        changeMainMenu(answers)
    })
 }

function changeMainMenu(answers) {
    switch(answers.menu) {
        case 'View Menu':
            showViewMenu()
            break;
        case 'Add/Update Menu':
            showAddMenu()
            break;
    }

}

function showViewMenu() {
    inquirer.prompt(viewMenu)
    .then((answers) => {
        changeViewMenu(answers)
    })
}


function showAddMenu() {
    inquirer.prompt(addMenu)
    .then((answers) => {
        changeAddMenu(answers)
    })
}

function changeViewMenu(answers) {
    switch (answers.view) {
        case 'Departments':
            showAllDepartments();
            break;
        case 'Roles': 
            showAllRoles();
            break;
        case 'Employees':
            showAllEmployees();
            break;
        case 'Back':
            mainMenu()
            break;
    }
}

function changeAddMenu(answers) {
    switch (answers.add) {
        case 'Add a Department':
            departmentList();
            addDepartmentMenu();
            break;
        case 'Add a Role':
            showAllRoles();
            addRole();
            break;
        case 'Add an Employee':
            employeeList();
            addEmployeeMenu();
            break;
        case 'Update An Employee Role':
            employeeList();
            updateEmployeeRole();
            break;
        case 'Back':
            mainMenu()
            break;
    }
};

function addDepartmentMenu() {
    inquirer.prompt(addDepartmentPrompt)
    .then((answers) => {
        addDepartment(answers)
    })
}

function addEmployeeMenu() {
    
    db.query('SELECT id, first_name, last_name, manager_id FROM employee', function (err, results) {
        const managerList = results.map(
            (info) => {
                return {id:info.id, name:info.first_name, name:info.last_name}
            }
        )
    })

    db.query('SELECT id, title FROM role', function (err, results) {
        const roleList = results.map(
            (info) => {
                return {id:info.id, name:info.title}
            }
        )
    })

    inquirer.prompt(addEmployeePrompt)
    .then((answers) => {
        addEmployee(answers)
    })
}

function showAllEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
        mainMenu();
    })  
  };

function showAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        mainMenu();
    })  
}

function showAllRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
        mainMenu();
    })
}
// Takes answers and adds rows to tables
function addDepartment(answers) {
    db.query(`INSERT INTO department (name) VALUES ('${answers.name}')`, function (err, results) {
        console.log("added " + results.affectedRows + " Department/s")
        showAllDepartments();
    })
    
}

function addEmployee(answers) {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}, ${answers.last_name}, ${answers.role}, ${answers.manager}')`, function (err, results) {
        console.log("added " + results.affectedRows + " Employee/s")
    })
    showAllEmployees();
}

function addRole(answers) {
    db.query(`INSERT INTO role (title, salary) VALUES ('${answers.title}', '${answers.salary}')`, function (err, results) {
        console.log("added " + results.affectedRows + " role/s")})
        showAllRoles();
}

//Used to display data without redirecting to the Main Menu
function departmentList() {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
    })  
}
function employeeList() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.table(results);
    })  
}

//Starts program
 mainMenu();