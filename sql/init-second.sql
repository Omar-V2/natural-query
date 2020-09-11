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