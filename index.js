const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

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
];


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
            roleMenu();
            addRoleMenu();
            break;
        case 'Add an Employee':
            employeeList();
            addEmployeeMenu();
            break;
        case 'Update an Employee Role':
            employeeList();
            updateEmployeeMenu();
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
       db.query('SELECT first_name, last_name, id FROM employee', (err,data) => {    
        let managerList = data.map(info => {
            return {name: info.first_name + ' ' + info.last_name, value: info.id}
         });
    
        db.query('SELECT id, title FROM role', (err, data) => {
        let roleList =  data.map(info => {
            return {name: info.title, value: info.id}
        });
    

    inquirer.prompt([
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
            choices: roleList
        },
        {
            type: 'list',
            message: "who is the manager?",
            name: 'manager',
            choices: managerList
        }
    ])
    .then((answers) => {
        addEmployee(answers)
        console.log(answers)
    })
})})};

function addRoleMenu() {
    db.query('SELECT id, name FROM department', (err, data) => {
        let departmentList =  data.map(info => {
            return {name: info.name, value: info.id}
        });
    inquirer.prompt([ 
    {
        type: 'input',
        message: 'Please enter new role name',
        name:'title'
    },
    {
        type: 'input',
        message: 'Please enter the salary (use whole number with no commas)',
        name: 'salary'
    },
    {
        type: 'list',
        message: 'What department does the role belong to?',
        name: 'department',
        choices: departmentList
    }])
    .then((answers) => {
        addRole(answers);
    })
})};

function updateEmployeeMenu() {
    db.query('SELECT first_name, last_name, id FROM employee', (err,data) => {
        if (err) throw err;    
        let employees = data.map(info => {
            return {name: info.first_name + ' ' + info.last_name, value: info.id}
         });
         db.query('SELECT id, title FROM role', (err, data) => {
             if (err) throw err;
            let roleList =  data.map(info => {
                return {name: info.title, value: info.id}
            });

         inquirer.prompt([
            {
                type: 'list',
                message: "Please select the employee you want to update",
                name: 'employee',
                choices: employees
            },
            {
                type: 'list',
                message: "What role do you want to give?",
                name: 'roleId',
                choices: roleList
            }
        ]).then((answers) => {
            updateEmployee(answers);
        })

})})};


function showAllEmployees() {
    db.query(`SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', manager_id AS 'Manager ID' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        console.table(results);
        mainMenu();
    })    
  };

function showAllDepartments() {
    db.query(`SELECT department.id AS 'ID', department.name AS 'Name' FROM department`, function (err, results) {
        console.table(results);
        mainMenu();
    })  
}

function showAllRoles() {
    db.query(`SELECT role.id AS 'ID', role.title AS 'Title', role.salary AS 'Salary', department.name AS 'Department' FROM role INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        console.table(results);
        mainMenu();
    })
}
// Takes answers and adds rows to tables
function addDepartment(answers) {
    db.query(`INSERT INTO department (name) VALUES ('${answers.name}')`, function (err, results) {
        console.log("added Department")
        showAllDepartments();
    })
    
}

  function addEmployee(answers) {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', '${answers.role}', '${answers.manager}')`, function (err, results) {
        if (err) console.log(err)
        console.log("added Employee")
        showAllEmployees();
    })
}

function addRole(answers) {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', '${answers.salary}', '${answers.department}')`, function (err, results) {
        if (err) console.log(err)
        console.log("added role")})
        showAllRoles();
}

function updateEmployee(answers) {
    db.query(`UPDATE employee SET role_id = '${answers.roleId}'WHERE id = '${answers.employee}'`, function (err, results) {
        if (err) console.log(err)
        console.log("updated Employee")
        showAllEmployees();
    })
}

//Used to display data without redirecting to the Main Menu
function departmentList() {
    db.query(`SELECT department.id AS 'ID', department.name AS 'Name' FROM department`, function (err, results) {
        console.table(results);
    })  
}
function employeeList() {
    db.query(`SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary', manager_id AS 'Manager ID' FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        console.table(results);
    })  
}

function roleMenu() {
    db.query(`SELECT role.id AS 'ID', role.title AS 'Title', role.salary AS 'Salary', department.name AS 'Department' FROM role INNER JOIN department ON role.department_id = department.id`, function (err, results) {
        console.table(results);
    })
}

//Starts program
 mainMenu();
