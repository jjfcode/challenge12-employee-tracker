# Employee Management System

## Description

A command-line application for managing a company's employee database, using Node.js, PostgreSQL, and Inquirer.

 --- 

### Table of Contents

-[Introduction](#introduction)

-[Features](#features)

-[Installation](#installation)

-[Usage](#usage)

-[Repo](#repo)

-[Credits](#credits)

-[License](#license)

## Introduction

This application allows users to view and manage the departments, roles, and employees in a company. It provides a simple, interactive interface to perform CRUD operations on the employee database.

## Features


- View all departments, roles, and employees

- Add new departments, roles, and employees

- Update employee roles

- Manage data in a PostgreSQL database

 
## Installation

Clone the repository:

```
git clone https://github.com/jjfcode/challenge12-employee-tracker.git
```
Install the dependencies:
```
npm i
```
Set up your PostgreSQL database and create a .env file with your credentials:

```
USER_NAME=your_db_username
PASSWORD=your_db_password
DB_NAME='employees_db'
````
Run Postgres:

```
cd db
psql -U postgres
\i schema.sql
\i seeds.sql
\i query.sql
```

 --- 

## Usage

To use this application, simply run the following command in your terminal:


```
node index.js
```

## **Repo:**

[Github Repo](https://github.com/jjfcode/challenge12-employee-tracker)

---

## Credits

I used [Professional README Guide](https://coding-boot-camp.github.io/full-stack/github/professional-readme-guide) and [CHAT & ASK AI](https://askaichat.app/) for help on my README.
 
## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🏆 The previous sections are the bare minimum, and your project will ultimately determine the content of this document. You might also want to consider adding the following sections.
