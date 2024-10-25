\c employees_db

INSERT INTO department(name)
VALUE('Sales'),
     ('Engineering');

INSERT INTO role(title,salary,department_id)
VALUE ('Sales Lead',100000,1),
      ('Sales Person',80000,1),
      ('Lead Engineer',150000,2);

INSERT INTO employee(first_name, last_name, role_id)
VALUE ('John','Doe',1),
      ('Mike','Chan',2),
      ('Ashley','Rodriguez',3);

UPDATE employee SET manager_id = 1 WHERE id = 2;