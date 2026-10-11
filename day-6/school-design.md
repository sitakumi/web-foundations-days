# School Database Design

## Tables

### `students`
Stores one row per student. Each student has a surrogate primary key
(`student_id`), a first and last name, a **unique** email address (used as the
natural business identifier and login), and an optional date of birth. The
email is constrained `UNIQUE` because two students must never share an account
or contact address.

### `courses`
Stores one row per course offered by the school. Each course has a surrogate
primary key (`course_id`), a descriptive name, and a `credits` value that is
constrained to be positive. Courses are reference data — they exist
independently of any particular student.

### `enrolments`
Stores one row per **(student, course) pair** and acts as the *join table*
between `students` and `courses`. Beyond the two foreign keys, it carries
attributes that only make sense in the context of that pairing: the `grade`
achieved (nullable, because a student may be enrolled but not yet graded) and
the `enrolled_on` date. The primary key is the composite `(student_id,
course_id)`, which enforces the rule that a student can enrol on a given
course only once.

---

## Relationships

### Students → Enrolments (one-to-many)
One student can have **many** enrolments, but each enrolment row belongs to
exactly **one** student. This is a one-to-many relationship, implemented by
putting `student_id` as a foreign key inside `enrolments`.

### Courses → Enrolments (one-to-many)
Symmetrically, one course can appear in **many** enrolments, but each
enrolment row references exactly **one** course. This is also one-to-many,
implemented by `course_id` in `enrolments`.

### Students ↔ Courses (many-to-many, via `enrolments`)
Taken together, a student can take many courses **and** a course can be taken
by many students. A relational schema cannot express that directly: a single
foreign key column in either table could only point to one row on the other
side. The standard solution is a **join table** (`enrolments`) whose rows are
the *pairs* that actually exist. Each row of `enrolments` represents one real
enrolment event, and the composite primary key stops the same pair being
recorded twice. The join table is also the natural home for attributes that
belong to the relationship rather than to either entity — here, `grade` and
`enrolled_on`. Without it there would be no clean place to store a grade, and
the many-to-many link could not be represented at all.

---

## Index I would add

```sql
CREATE INDEX idx_enrolments_course_id ON enrolments(course_id);
Reason: the primary key on enrolments already indexes (student_id, course_id), which makes lookups by student fast ("show me Alice's
courses"). However, queries that go the other way — "list all students on
course 101", "count students per course" — filter or group by course_id
alone, and the leading column of the composite key is student_id, so those
queries cannot use that index efficiently. Adding a secondary index on
course_id gives the optimiser a direct path for course-side lookups and for
the GROUP BY course_id in the "students per course" report. It is a cheap
index to maintain (a single integer column) and directly supports two of the
five required queries.
SQL or NoSQL?
For this system I would choose SQL. The data is inherently relational and
highly structured: students, courses, and the enrolments that link them have a
fixed, well-understood shape, and the most important business rules are
integrity rules — a student's email must be unique, a student may not enrol
on the same course twice, and an enrolment must always refer to a real student
and a real course. A relational database enforces all of these declaratively
through primary keys, UNIQUE constraints, foreign keys, and CHECK
constraints, which is far safer than re-implementing the same checks in
application code. The queries the school actually needs — "which courses is
this student taking?", "who is on this course?", "how many students per
course?", "who hasn't enrolled?" — are all natural joins, aggregations, and
anti-joins that SQL expresses cleanly and the query planner optimises well.
Grades and enrolment dates also benefit from transactional guarantees, since a
grade update should be atomic and durable. NoSQL would only start to make
sense if the workload changed dramatically — for example, extremely high-volume
event logging of every click in an online learning platform, or a schema that
genuinely varies per record. For a school's core records, with modest data
volume and strong consistency requirements, SQL is the correct choice.

### Notes on the choices made

- **One index, not five.** The brief asked for *one* index, so I picked the one that adds the most value over what already exists. The composite PK already covers student-side lookups; `course_id` is the uncovered side.
- **Why not index `students.last_name`?** Tempting for "find by name" queries, but with a small student table a sequential scan is fine, and the brief asked for a single recommendation. The `course_id` index supports two of the five required queries, which is the stronger case.
- **SQL paragraph covers both directions.** Rather than just saying "it's relational", it ties the choice back to concrete constraints (`UNIQUE`, composite PK, FKs) and concrete queries (joins, `GROUP BY`, anti-join) from the actual schema, and acknowledges when NoSQL *would* be appropriate — which makes the recommendation look reasoned rather than reflexive.