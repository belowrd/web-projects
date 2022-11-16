CREATE TABLE supporterList (
    id SERIAL primary key,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    signature VARCHAR
);

CREATE TABLE users (
    id SERIAL primary key,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255),
    email VARCHAR(255),
    hashedPassword VARCHAR(255)
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age VARCHAR(255),
    city VARCHAR(255),
    url VARCHAR(255),
    user_id INT,
    CONSTRAINT user_id 
        FOREIGN KEY (id)
        REFERENCES users(id)
);


DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users_profiles;
DROP TABLE IF EXISTS users;