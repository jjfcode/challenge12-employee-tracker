const inquirer = require('inquirer')
const { printTable } = require('console-table-printer');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    {
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME
    },
    console.log(`Connected to the books_db database.`)
)

pool.connect(() => {
    mainMenu()
});

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'menu',
            choices:['view all employees', 'add an employee', 'update employee role', 'view all roles', 'add a role', 'view all departments', 'add a department']
        }
    ])
        .then(response => {
            if (response.menu === 'view all departments') {
                viewDepartments()
            }
            else if (response.menu === 'view all roles') {
                viewRoles()
            }
            else if (response.menu === 'view all employees') {
                viewEmployees()
            }
            else if (response.menu === 'add a department') {
                addDepartment()
            }
            else if (response.menu === 'add a role') {
                addRole()
            }
            else if (response.menu === 'add an employee') {
                addEmployee()
            }
            else if (response.menu === 'update employee role') {
                updateEmployeeRole()
            }

        })
}

function updateEmployeeRole() {
    pool.query("SELECT CONCAT(first_name,' ',last_name) as name, id as value from employee", (err, { rows }) => {
        pool.query("SELECT title as name, id as value from role", (err, { rows: roleRows }) => {
            inquirer.prompt([
                {
                    type: 'list',
                    message: "Which employee's do you want to update the role?",
                    name: 'employee',
                    choices: rows
                },
                {
                    type: 'list',
                    message: "Which role do you want to assign to the selected employee?",
                    name: 'role',
                    choices: roleRows
                }
            ])
                .then(res => {
                    pool.query(`update employee set role_id = ${res.role} where id=${res.employee}`, (err) => {
                        console.log("Employee's role has been updated!")
                        viewEmployees()
                    })
                })
        })
    })
}

function addRole() {
    pool.query('SELECT name, id as value from department', (err, { rows }) => {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'title',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid role name';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid salary';
                    }
                    return true;
                }
            },
            {
                type: 'list',
                message: 'Which department does the role belong to?',
                name: 'department',
                choices: rows
            }
        ])
            .then(res => {
                pool.query(`INSERT INTO role (title, salary, department_id) VALUES ('${res.title}', '${res.salary}', ${res.department})`, (err) => {
                    console.log(`Added ${res.title} to the database`)
                    mainMenu()
                })
            })
    })

}

function addDepartment() {
    pool.query('SELECT name as name from department', (err, { rows }) => {
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'title',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'Please enter a valid department name';
                    }
                    return true;
                }
            }
        ])
            .then(res => {
                pool.query(`INSERT INTO department (name) VALUES ('${res.title}')`, (err) => {
                    console.log(`Added ${res.title} to the database`);
                    mainMenu();
                })
            })
    })
}

function addEmployee() {
    pool.query('SELECT title as name, id as value from role', (err, { rows }) => {
        pool.query("SELECT CONCAT(first_name,' ',last_name) as name, id as value from employee", (err, { rows: managerRows }) => {
            inquirer.prompt([
                {
                    type: 'input',
                    message: "What is the employee's first name?",
                    name: 'first_name',
                    validate: (input) => {
                        if (input.trim() === '') {
                            return 'Please enter a valid first name';
                        }
                        return true;
                    }
                },
                {
                    type: 'input',
                    message: "What is the employee's last name?",
                    name: 'last_name',
                    validate: (input) => {
                        if (input.trim() === '') {
                            return 'Please enter a valid last name';
                        }
                        return true;
                    }
                },
                {
                    type: 'list',
                    message: "What is the employee's role?",
                    name: 'role',
                    choices: rows
                },
                {
                    type: 'list',
                    message: "What is the employee's manager?",
                    name: 'manager',
                    choices: managerRows
                }
            ])
                .then(res => {
                    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${res.first_name}', '${res.last_name}', ${res.role}, ${res.manager})`,
                        (err) => {
                            console.log(`Added ${res.first_name} ${res.last_name} to the database`);
                            mainMenu();
                        });
                });
        });
    });
}

function viewEmployees() {
    pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
CONCAT(employee_manager.first_name, ' ', employee_manager.last_name) AS manager 
FROM employee
LEFT JOIN role 
ON role.id = employee.role_id
LEFT JOIN department 
ON department.id = role.department_id
LEFT JOIN employee as employee_manager 
ON employee.manager_id = employee_manager.id ORDER BY employee.id;`, (err, { rows }) => {
        printTable(rows)
        mainMenu()
    })
}

function viewDepartments() {
    pool.query('SELECT * FROM department', (err, { rows }) => {
        printTable(rows)
        mainMenu()
    })
}

function viewRoles() {
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department
ON department.id = role.department_id;`, (err, { rows }) => {
        printTable(rows)
        mainMenu()
    })
}