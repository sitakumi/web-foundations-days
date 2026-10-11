-- ============================================================
-- school.sql
-- Schema, sample data, and queries for a small school database
-- ============================================================

-- Drop tables in reverse dependency order (safe re-run)
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- ============================================================
-- TABLE: students
-- ============================================================
CREATE TABLE students (
    student_id   INTEGER      PRIMARY KEY,
    first_name   VARCHAR(50)  NOT NULL,
    last_name    VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    date_of_birth DATE
);

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE courses (
    course_id   INTEGER      PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits     INTEGER      NOT NULL CHECK (credits > 0)
);

-- ============================================================
-- TABLE: enrolments
-- Composite PK prevents duplicate enrolment on same course.
-- FKs enforce referential integrity.
-- ============================================================
CREATE TABLE enrolments (
    student_id  INTEGER     NOT NULL,
    course_id   INTEGER     NOT NULL,
    grade       CHAR(2),                -- NULL until graded
    enrolled_on DATE        NOT NULL,
    PRIMARY KEY (student_id, course_id),  -- no duplicate enrolment
    FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(course_id)
        ON DELETE CASCADE
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Students (3)
INSERT INTO students (student_id, first_name, last_name, email, date_of_birth) VALUES
    (1, 'Alice',   'Nguyen',  'alice.nguyen@example.com',  '2002-04-11'),
    (2, 'Bilal',   'Ahmed',   'bilal.ahmed@example.com',   '2001-09-23'),
    (3, 'Chloe',   'Martins', 'chloe.martins@example.com', '2003-01-07');

-- Courses (3)
INSERT INTO courses (course_id, course_name, credits) VALUES
    (101, 'Introduction to Databases', 15),
    (102, 'Web Development',           20),
    (103, 'Data Structures',           15);

-- Enrolments (5)
INSERT INTO enrolments (student_id, course_id, grade, enrolled_on) VALUES
    (1, 101, 'A',  '2024-09-01'),
    (1, 102, 'B+', '2024-09-01'),
    (2, 101, 'B',  '2024-09-02'),
    (2, 103, NULL, '2024-09-02'),
    (3, 102, 'A-', '2024-09-03');

-- ============================================================
-- QUERIES
-- ============================================================

-- 1. All courses for one student (by name)
SELECT c.course_id, c.course_name, c.credits, e.grade
FROM   enrolments e
JOIN   courses    c ON c.course_id = e.course_id
JOIN   students   s ON s.student_id = e.student_id
WHERE  s.first_name = 'Alice'
  AND  s.last_name  = 'Nguyen'
ORDER BY c.course_name;

-- 2. All students on one course
SELECT s.student_id, s.first_name, s.last_name, s.email, e.grade
FROM   enrolments e
JOIN   students   s ON s.student_id = e.student_id
JOIN   courses    c ON c.course_id = e.course_id
WHERE  c.course_name = 'Introduction to Databases'
ORDER BY s.last_name, s.first_name;

-- 3. Number of students per course
SELECT c.course_id,
       c.course_name,
       COUNT(e.student_id) AS student_count
FROM   courses    c
LEFT JOIN enrolments e ON e.course_id = c.course_id
GROUP BY c.course_id, c.course_name
ORDER BY student_count DESC, c.course_name;

-- 4. Students with no enrolments
SELECT s.student_id, s.first_name, s.last_name, s.email
FROM   students   s
LEFT JOIN enrolments e ON e.student_id = s.student_id
WHERE  e.student_id IS NULL
ORDER BY s.last_name, s.first_name;

-- 5. Update one enrolment's grade
--    (Bilal Ahmed on course 103 from NULL -> 'A')
UPDATE enrolments
SET    grade = 'A'
WHERE  student_id = 2
  AND  course_id  = 103;

-- Verify the update
SELECT * FROM enrolments WHERE student_id = 2 AND course_id = 103;