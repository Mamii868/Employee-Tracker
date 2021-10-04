

INSERT INTO department (id, name)
VALUES (1, "Hwad");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Boss", 250000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Marc", "Moten", 1, NULL),
(2, "Michael", "Moten", 1, 1);