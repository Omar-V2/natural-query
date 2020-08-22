CREATE TABLE Students (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(30),
    lname VARCHAR(30),
    age INTEGER,
    email VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS Staff (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(30),
    lname VARCHAR(30),
    age INTEGER,
    email VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS Classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    code VARCHAR(30),
    location VARCHAR(50),
    level VARCHAR(30),
    staff_id INTEGER,
    FOREIGN KEY(staff_id) REFERENCES Staff(id)
);

CREATE TABLE IF NOT EXISTS Societies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    student_id INTEGER,
    FOREIGN KEY(student_id) REFERENCES Students(id)
);

CREATE TABLE IF NOT EXISTS Enrolments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER,
    student_id INTEGER,
    FOREIGN KEY(class_id) REFERENCES Classes(id),
    FOREIGN KEY(student_id) REFERENCES Students(id)
);

INSERT INTO Students (fname, lname, age, email) VALUES('Omar', 'D', 23, 'omar@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Aziz', 'D', 25, 'aziz@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Sam', 'S', 19, 'sam@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Harry', 'G', 23, 'harry@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Tom', 'F', 23, 'tom@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('James', 'E', 23, 'james@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Nabil', 'S', 23, 'nabil@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Yasir', 'H', 23, 'yasir@gmail.com');
INSERT INTO Students (fname, lname, age, email) VALUES('Alan', 'S', 23, 'alan@gmail.com');