-- 2409 Academy: users table
-- Run this inside the 2409_academy database (pgAdmin: right-click 2409_academy -> Query Tool).
-- Do NOT put CREATE DATABASE in this script: pgAdmin runs scripts in a transaction,
-- and PostgreSQL does not allow CREATE DATABASE inside one.
-- To create the database once, run this by itself while connected to the "postgres" database:
--     CREATE DATABASE "2409_academy";

CREATE TABLE IF NOT EXISTS users (
    user_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'STUDENT',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_role CHECK (role IN ('STUDENT', 'ADMIN'))
);

SELECT * FROM users;

-- To make an account an admin (run once, with your own email):
-- UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
