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

-- CREATE TABLE IF NOT EXISTS Societies (
    -- id SERIAL PRIMARY KEY
-- )

CREATE TABLE IF NOT EXISTS Enrolments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER,
    student_id INTEGER,
    FOREIGN KEY(class_id) REFERENCES Classes(id),
    FOREIGN KEY(student_id) REFERENCES Students(id)
);