DROP DATABASE IF EXISTS departments_db;
CREATE DATABASE departments_db;

USE departments_db;

CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
);

CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) 
);

CREATE TABLE employee(
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);
