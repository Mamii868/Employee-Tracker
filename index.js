const inquirer = require('inquirer')


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
     choices: ['Departments', 'Roles', 'Employees']
    }
];

const addMenu = [
    {
        type: 'list',
        message: 'What would you like to add or update?',
        name: 'add',
        choices: ['Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    }
];

 function program(){ 
    inquirer.prompt(startMenu)
    .then((answers) => {
        chamgeMainMenu(answers)
    })
 }

function chamgeMainMenu(answers) {
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

 program();