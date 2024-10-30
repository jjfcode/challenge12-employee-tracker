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
  
  pool.connect(()=>{
    mainMenu()
  });

function mainMenu(){
    inquirer.prompt([
        {
            type:'list',
            message:'What would you like to do?',
            name:'menu',
            choices:['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ])
    .then(response => {
        if (response.menu === 'view all departments'){
            viewDepartments()
        }
        else if (response.menu === 'view all employees'){
            viewEmployees()
        }
        else if (response.menu === 'add an employee') {
            addEmployee()
        }
        else if (response.menu === 'update an employee role') {
            updateEmployeeRole()
        }
        else if (response.menu === 'view all roles') {
            viewRoles()
        }

    })
}

function updateEmployeeRole(){
    pool.query("SELECT CONCAT(first_name,' ',last_name) as name, id as value from employee",(err,{ rows }) => {
        pool.query("SELECT title as name, id as value from role", (err, { rows:roleRows }) => {
            inquirer.prompt([
                {
                    type:'list',
                    message:"Which employee's do you want to update the role?",
                    name:'employee',
                    choices:rows
                },
                {
                    type:'list',
                    message:"Which role do you want to assign to the selected employee?",
                    name:'role',
                    choices:roleRows
                }
            ])
            .then(res =>{
                pool.query(`update employee set role_id = ${res.role} where id=${res.employee}`,(err)=>{
                    console.log("Employee's role has been updated!")
                    viewEmployees()
                })
            })
        })
    })
}

function addEmployee() {
    pool.query('SELECT title as name, id as value from role',(err,{ rows }) => {
        pool.query("SELECT CONCAT(first_name,' ',last_name) as name, id as value from employee", (err, { rows:managerRows }) => {
            inquirer.prompt([
                {
                    type:'input',
                    message:"What is the employee's first name?",
                    name:'first_name'
                },
                {
                    type:'input',
                    message:"What is the employee's last name?",
                    name:'last_name'
                },
                {
                    type:'list',
                    message:"What is the employee's role?",
                    name:'role',
                    choices:rows
                },
                {
                    type:'list',
                    message:"What is the employee's manager?",
                    name:'manager',
                    choices:managerRows
                }
            ])
            .then(res=>{
                pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${res.first_name}', '${res.last_name}', ${res.role}, ${res.manager})`,
                    (err) => {
                    console.log("New employee has been added into system!");
                    viewEmployees();
                });
            });
        });
    });
}

function viewEmployees(){
    pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
CONCAT(employee_manager.first_name, ' ', employee_manager.last_name) AS manager 
FROM employee
LEFT JOIN role 
ON role.id = employee.role_id
LEFT JOIN department 
ON department.id = role.department_id
LEFT JOIN employee as employee_manager 
ON employee.manager_id = employee_manager.id ORDER BY employee.id;`,(err,{ rows })=>{
    printTable(rows)
    mainMenu()
    })
}

function viewDepartments(){
    pool.query('SELECT * FROM department', (err, { rows }) => {
        printTable(rows)
        mainMenu()
    })
}

function viewRoles(){
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department
ON department.id = role.department_id;`,(err,{ rows })=>{
    printTable(rows)
    mainMenu()
    })
}