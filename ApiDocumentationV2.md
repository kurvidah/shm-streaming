# SHM Streaming API v1 Documentation

Base URL: `/api/v1`  
All requests and responses use `application/json`.

---

## 📋 Authentication

### `POST /auth/register`
Register a new user.

**Request Body**
```json
{
  "username": "john_doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "gender": "male",
  "birthdate": "1990-01-01",
  "region": "US"
}
```

**Response**
```json
{
  "message": "User registered successfully"
}
```

---

### `POST /auth/login`
Authenticate the user and return a JWT token.

**Request Body**
```json
{
  "identifier": "john_doe",
  "password": "securePassword123"
}
```

**Response**
```json
{
  "user_id": 1234,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "device": {
    "device_id": 5678,
    "device_type": "Desktop",
    "device_name": "Unknown vendor"
  },
  "token": "your_jwt_token"
}
```

---

## 🎬 Movies

### `GET /movies`
Retrieve a list of all movies.

**Query Parameters**
- `search` (optional): Search for movies by title, description, or IMDb ID.
- `genre` (optional): Filter movies by genre.
- `release_year` (optional): Filter movies by release year.
- `is_available` (optional): Filter movies by availability (`true` or `false`).

**Response**
```json
[
  {
    "movie_id": 1,
    "title": "Inception",
    "description": "A mind-bending thriller.",
    "release_year": 2010,
    "duration": 148,
    "is_available": true,
    "genres": ["Sci-Fi", "Thriller"],
    "rating": 4.8,
    "views": 1200
  }
]
```

---

### `GET /movies/:id`
Retrieve a movie by its ID or slug.

**Response**
```json
{
  "movie_id": 1,
  "title": "Inception",
  "description": "A mind-bending thriller.",
  "release_year": 2010,
  "duration": 148,
  "is_available": true,
  "genres": ["Sci-Fi", "Thriller"],
  "rating": 4.8,
  "views": 1200
}
```

---

### `POST /movies`
Create a new movie. (Moderator/Admin only)

**Request Body**
```json
{
  "title": "Inception",
  "description": "A mind-bending thriller.",
  "release_year": 2010,
  "genres": ["Sci-Fi", "Thriller"],
  "duration": 148,
  "is_available": true
}
```

**Response**
```json
{
  "message": "Movie created successfully",
  "movie_id": 1
}
```

---

### `PUT /movies/:id`
Update an existing movie by its ID. (Moderator/Admin only)

**Request Body**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "release_year": 2011,
  "genres": ["Action", "Adventure"],
  "duration": 150,
  "is_available": false
}
```

**Response**
```json
{
  "message": "Movie updated successfully",
  "movie_id": 1
}
```

---

### `DELETE /movies/:id`
Delete a movie by its ID. (Moderator/Admin only)

**Response**
```json
{
  "message": "Movie removed"
}
```

---

### `GET /movies/featured`
Retrieve a list of featured movies based on popularity.

**Response**
```json
[
  {
    "movie_id": 1,
    "title": "Inception",
    "description": "A mind-bending thriller.",
    "release_year": 2010,
    "duration": 148,
    "is_available": true,
    "genres": ["Sci-Fi", "Thriller"],
    "rating": 4.8,
    "views": 1200
  }
]
```

---

## 👤 Users

### `GET /users/me`
Get the current user's profile.

**Response**
```json
{
    "user_id": 1,
    "username": "admin",
    "email": "admin@shm.app",
    "role": "ADMIN",
    "gender": null,
    "birthdate": null,
    "region": null,
    "created_at": "2025-01-01T00:00:00.000Z",
    "active_subscription": null,
    "devices": [
        {
            "device_id": 1,
            "device_type": "Phone",
            "device_name": "iPhone 12"
        }
    ]
}
```

---

### `PUT /users/me`
Update the current user's profile.

**Request Body**
```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "gender": "new_gender",
  "birthdate": "1990-01-01"
}
```

**Response**
```json
{
  "message": "Profile updated successfully"
}
```

---

### `DELETE /users/me`
Delete the current user's account.

**Response**
```json
{
  "message": "User removed"
}
```

---

### `GET /users/:id`
Get a user's profile by ID (Admin/Moderator only).

**Response**
```json
{
  "user_id": 1234,
  "username": "john_doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "gender": "male",
  "birthdate": "1990-01-01",
  "region": "US"
}
```

---

### `PUT /users/:id`
Update a user's profile by ID (Admin only).

**Request Body**
```json
{
  "username": "updated_username",
  "email": "updated_email@example.com"
}
```

**Response**
```json
{
  "message": "User updated successfully"
}
```

---

### `DELETE /users/:id`
Delete a user's account by ID (Admin only).

**Response**
```json
{
  "message": "User removed"
}
```

---

## 📦 Subscription Plans

### `GET /plans`
Get a list of all subscription plans.

**Response**
```json
[
  {
    "plan_id": 1,
    "plan_name": "Basic",
    "price": 9.99,
    "max_devices": 1,
    "hd_available": true,
    "ultra_hd_available": false,
    "duration_days": 30
  }
]
```

---

### `POST /plans`
Create a new subscription plan (Admin only).

**Request Body**
```json
{
  "plan_name": "Premium",
  "price": 15.99,
  "max_devices": 4,
  "hd_available": true,
  "ultra_hd_available": true,
  "duration_days": 30
}
```

**Response**
```json
{
  "message": "Subscription plan created successfully"
}
```

---

### `PUT /plans/:id`
Update a subscription plan by ID (Admin only).

**Request Body**
```json
{
  "plan_name": "Updated Plan",
  "price": 19.99
}
```

**Response**
```json
{
  "message": "Subscription plan updated successfully"
}
```

---

### `DELETE /plans/:id`
Delete a subscription plan by ID (Admin only).

**Response**
```json
{
  "message": "Subscription plan removed"
}
```

---

## 💳 Billing

### `GET /billing/me`
Get billing history for the current user.

**Response**
```json
[
  {
    "billing_id": 1,
    "user_subscription_id": 2,
    "amount": 15.99,
    "payment_status": "COMPLETED",
    "due_date": "2025-05-01"
  }
]
```

---

### `POST /billing/pay`
Pay for a subscription.

**Request Body**
```json
{
  "billing_id": 1,
  "payment_method": "credit_card"
}
```

**Response**
```json
{
  "message": "Bill paid successfully"
}
```