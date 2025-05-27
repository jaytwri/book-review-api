# Book Review API

## Author
**Name:** Jay Tiwari  
**Email:** jaytiwari99@gmail.com  
**Phone:** +91-7796696693  

---

## Setup Instructions

### 1. Clone the Project
```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a `.env` File
Create a `.env` file in the root directory with the following content:

```
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_here
```

> Do **NOT** commit this file to GitHub. It's excluded via `.gitignore`.

### 4. Run the App
```bash
node server.js
```

The API will be available at:  
`http://localhost:5001`

---

## JWT Usage

The `JWT_SECRET` is used internally by the server to sign and verify tokens.

When logging in at `/api/users/login`, you receive a JWT token.  
Use this token to access protected routes by choosing the **Bearer Token** option in Postman.

---

## API Endpoints & Usage Guide

### User Authentication

#### POST `/api/users/signup` – Register a new user
**Request Body:**
```json
{
  "name": "Sanjay",
  "email": "sanjay@email.com",
  "password": "pass"
}
```

#### POST `/api/users/login` – Log in
**Request Body:**
```json
{
  "email": "sanjay@email.com",
  "password": "pass"
}
```

**Response:**  
Returns a JWT token to be used in the Bearer Token Authorization header.

---

### Books

#### POST `/api/books` – Add a new book (Authenticated)
**Headers:**  
`Authorization: Bearer <your_token>`

**Request Body:**
```json
{
  "title": "Babablacksheep",
  "author": "vijaytiwari",
  "genre": "notorious book"
}
```

#### GET `/api/books/:id` – Get book by ID  
Example:  
`http://localhost:5001/api/books/6835737fe39392ab214aeb71`

#### GET `/api/books` – Get all books  
Example:  
`http://localhost:5001/api/books/`

---

### Reviews (Authenticated)

#### POST `/api/books/:id/reviews` – Add a review
**URL:**  
`http://localhost:5001/api/books/6835737fe39392ab214aeb71/reviews`

**Request Body:**
```json
{
  "comment": "Fantastic read!",
  "rating": 5
}
```

#### PUT `/api/reviews/:id` – Update a review  
Example:  
`http://localhost:5001/api/reviews/REVIEW_ID_HERE`  
> Get the review ID from the book details response.

#### DELETE `/api/reviews/:id` – Delete a review  
Example:  
`http://localhost:5001/api/reviews/68357419e39392ab214aeb76`

---

### Search Functionality

#### GET `/api/books/search?q=NAME_OF_BOOK` – Search by title  
Example:  
`http://localhost:5001/api/books/search?q=black`

#### GET `/api/books/search?q=NAME_OF_AUTHOR` – Search by author  
Example:  
`http://localhost:5001/api/books/search?q=vijay`

> Supports partial and case-insensitive matching.

---

## Postman Usage Tips

1. Use `/api/users/login` to get a JWT token.
2. In Postman, for protected routes:
   - Go to the **Authorization** tab.
   - Select **Bearer Token**.
   - Paste your token.

---

## Database Schema Overview

### User
- `name` – String  
- `email` – String  
- `password` – String (hashed)  

### Book
- `title` – String  
- `author` – String  
- `genre` – String  
- `averageRating` – Number  
- `reviews` – [ObjectId] (ref: Review)  

### Review
- `comment` – String  
- `rating` – Number (1–5)  
- `book` – ObjectId (ref: Book)  
- `user` – ObjectId (ref: User)  

---

## Design Decisions

- One review per user per book is enforced at the controller level.
- Book average rating is recalculated after every review create/update/delete.
- MongoDB Atlas is used for easy deployment and testing.
- Mongoose is used for data modeling.
