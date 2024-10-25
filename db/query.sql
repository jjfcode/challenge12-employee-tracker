\c employees_db;

SELECT * FROM department;

SELECT role.id, role.title, department.name AS department, role.salary
FROM role
JOIN department
ON department.id = role.department_id;