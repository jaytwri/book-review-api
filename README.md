Author - Jay Tiwari
Email - jaytiwari99@gmail.com
Phone - +91-7796696693

**********Book Review API************
--------------------------------------Setup Instructions---------------------
1. Clone the project

2. Install Dependencies
npm install

3. Create a .env File like the one below:
-------------------------------------------------------------
PORT=5001

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_jwt_secret_here

-------------------------------------------------------------
Do NOT commit this file to GitHub.
It's excluded via .gitignore.
The JWT secret can be what I have pasted abvoe as well.

4. Run the App

node server.js

Your API will be available at:
http://localhost:5001

------JWT USAGE------
The JWT_SECRET is used internally by the server to sign/verify tokens.

When logging in (/api/users/login), you receive a JWT token.

Use this token to access protected routes by choosing the **** Bearer Token******
 option in Postman.
 
--------------------------------------------------------------------------------
API Endpoints & Usage Guide

POST /signup – Register a new user

URL: http://localhost:5001/api/users/signup

Body:
{
  "name": "Sanjay",
  "email": "sanjay@email.com",
  "password": "pass"
}

POST /login – Log in as an existing user

URL: http://localhost:5001/api/users/login

Body:
{
  "email": "sanjay@email.com",
  "password": "pass"
}
Response: Returns a JWT token. Use this token for authenticated routes by setting it as a Bearer Token in Postman.

POST /books – Add a new book

URL: http://localhost:5001/api/books

Headers: Authorization: Bearer <your_token>

Body:
{
  "title": "Babablacksheep",
  "author": "vijaytiwari",
  "genre": "notorious book"
}

GET /books/:id – Get book by ID

URL: http://localhost:5001/api/books/6835737fe39392ab214aeb71


GET /books – Get all books

URL: http://localhost:5001/api/books/

Reviews (Authenticated)

POST /books/:id/reviews – Add a review to a book

URL:http://localhost:5001/api/books/6835737fe39392ab214aeb71/reviews

Body:
{
  "comment": "Fantastic read!",
  "rating": 5
}

PUT /reviews/:id – Update a review

URL: http://localhost:5001/api/reviews/68357419e39392ab214aeb76

Get the review ID from the book details API response.

DELETE /reviews/:id – Delete a review

URL: http://localhost:5001/api/reviews/68357419e39392ab214aeb76

Search Functionality

GET /books/search?q=NAME_OF_BOOK – Search by book title

Example: http://localhost:5001/api/books/search?q=black

Supports partial and case-insensitive matching.

GET /books/search?q=NAME_OF_AUTHOR – Search by author name

Example:http://localhost:5001/api/books/search?q=vijay

------------------------------------------------------------------
Postman Usage Tips

For protected routes, use the Bearer Token method in Postman:

Login to receive your JWT token.
In any protected request, go to the Authorization tab.
Select Bearer Token and paste your token.

-------------------------------------------------------------------
Database Schema Overview


User

Field	Type

name	String

email	String

password	String (hashed)


Book

Field	Type

title	String

author	String

genre	String

averageRating	Number

reviews	[ObjectId] – Ref to Review


Review

Field	Type

comment	String

rating	Number (1–5)

book	ObjectId (ref: Book)

user	ObjectId (ref: User)


-------------------------------------------------------------------

==========>Design Decisions<===============
One review per user per book is enforced at controller level.
Book average rating is recalculated after every review create/update/delete.
MongoDB Atlas used for easy deployment and testing.
Mongoose is also used for data modeling since I chose to MongoDB.
