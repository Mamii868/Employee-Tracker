const inquirer = require('inquirer')

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
            addDepartment()
            break;
        case 'Add a Role':
            addRole()
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update An Employee Role':
            updateEmployeeRole();
            break;
        case 'Back':
            mainMenu()
            break;
    }
};

function showAllEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
    })  
  };

function showAllDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
        console.log(results);
    })  
}

 mainMenu();