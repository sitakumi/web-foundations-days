# Library API — Books Resource

A REST API design for managing a library's `books` collection.

**Base URL:** `https://api.plp-library.com/v1`

**Content type:** `application/json`


## Endpoints

### 1. List all books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns a paginated list of every book in the library.
- **Request body:** none
- **Success status:** `200 OK`

```http
GET /v1/books
```

### 2. Get a single book

- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Returns the details of one book identified by its unique ID.
- **Request body:** none
- **Success status:** `200 OK`

```http
GET /v1/books/42
```

### 3. Create a new book

- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book to the library and returns the created resource.
- **Request body:**

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "isbn": "978-0201616224",
  "publishedYear": 1999,
  "copiesAvailable": 3
}
```

- **Success status:** `201 Created`

```http
POST /v1/books
```

### 4. Update an existing book

- **Method:** `PUT`
- **Path:** `/books/{id}`
- **Description:** Replaces all fields of the book with the given ID.
- **Request body:**

```json
{
  "title": "The Pragmatic Programmer, 20th Anniversary Edition",
  "author": "Andrew Hunt",
  "isbn": "978-0135957059",
  "publishedYear": 2019,
  "copiesAvailable": 5
}
```

- **Success status:** `200 OK`

```http
PUT /v1/books/42
```

### 5. Delete a book

- **Method:** `DELETE`
- **Path:** `/books/{id}`
- **Description:** Removes the book with the given ID from the library.
- **Request body:** none
- **Success status:** `204 No Content`

```http
DELETE /v1/books/42
```

### 6. List books by author

- **Method:** `GET`
- **Path:** `/books?author={authorName}`
- **Description:** Returns every book written by the author passed in the `author` query parameter.
- **Request body:** none
- **Success status:** `200 OK`

```http
GET /v1/books?author=Andrew%20Hunt
```


## Error codes

### 400 Bad Request

Returned when the client sends malformed or invalid data — for example, a `POST /books` request that is missing the required `title` field, or a query parameter with an invalid type.

**Example scenario:** Creating a book without a title.

```http
POST /v1/books
```

Request body:

```json
{
  "title": "",
  "author": "Andrew Hunt"
}
```

Response:

```json
{
  "error": "Bad Request",
  "message": "Field 'title' is required and must be a non-empty string."
}
```

### 404 Not Found

Returned when the client asks for a resource that does not exist — for example, requesting a book ID that has never been created or has already been deleted.

**Example scenario:** Fetching a book with an unknown ID.

```http
GET /v1/books/9999
```

Response:

```json
{
  "error": "Not Found",
  "message": "No book exists with id 9999."
}
```