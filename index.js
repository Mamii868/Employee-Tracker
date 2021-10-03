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
            showAllDepartments();
            addDepartmentMenu();
            break;
        case 'Add a Role':
            showAllRoles();
            addRole();
            break;
        case 'Add an Employee':
            showAllEmployees();
            addEmployee();
            break;
        case 'Update An Employee Role':
            showAllEmployees();
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
// Takes answers and adds rows to tables
function addDepartment(answers) {
    db.query(`INSERT INTO department (name) VALUES ('${answers.name}')`, function (err, results) {
        console.log("added " + results.affectedRows + " Department/s")
        showAllDepartments();
    })
    
}

function addEmployee(answers) {

}

function addRole(answers) {}

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