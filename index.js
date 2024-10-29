const inquirer = require('inquirer')
const { printTable } = require('console-table-printer');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    {
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      host: 'localhost',
      database: process.env.DBNAME
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
    })
}

function viewDepartments(){

}