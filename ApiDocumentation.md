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
  "email": "john@example.com",
  "password": "secure123",
  "gender": "male",
  "age": 25,
  "region": "US"
}
```

**Response**

```json
{ "message": "User registered successfully" }
```

---

### `POST /auth/login`

Authenticate user and return JWT token.

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response**

```json
{
  "user_id": 1234,
  "username": "john_smith",
  "email": "john@example.com",
  "role_id": 1234,
  "token": "your_jwt_token"
}
```

---

## 👤 Users

### `GET /users/me`

Get current user profile (requires JWT)

**Response**

```json
{
  "user_id": "your_user_id",
  "username": "your_user_name",
  "email": "your_email@example.com",
  "gender": "your_gender",
  "birthdate": "1995-01-01T23:59:59.000Z"
}
```

---

### `PUT /users/me`

Update current user profile

**Request Body**

```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "gender": "new_gender",
  "birthdate": "1990-01-01T00:00:00.000Z"
}
```

**Response**

```json
{
  "user_id": "your_user_id",
  "username": "new_username",
  "email": "new_email@example.com",
  "gender": "new_gender",
  "birthdate": "1990-01-01T00:00:00.000Z"
}
```

---

### `DELETE /users/me`

Delete current user

**Response**

```json
{ "message": "User removed" }
```

---

### `GET /users/:id`

Admin: Get user info by ID.

**Response**

```json
{
  "user_id": "user_id",
  "username": "user_name",
  "email": "email@example.com",
  "gender": "gender",
  "birthdate": "1995-01-01T23:59:59.000Z"
}
```

---

### `GET /users/`

Moderator: Get user list

**Response**

```json
[
    {
        "user_id": "user_id_1",
        "username": "user_name_1",
        "email": "email1@example.com",
        "gender": "gender_1",
        "birthdate": "1990-01-01T00:00:00.000Z"
    },
    {
        "user_id": "user_id_2",
        "username": "user_name_2",
        "email": "email2@example.com",
        "gender": "gender_2",
        "birthdate": "1992-02-02T00:00:00.000Z"
    },
    ...
]
```

---

### `PUT /users/:id`

Admin: Update user profile with matching id

**Request Body**

```json
{
  "username": "new_username",
  "email": "new_email@example.com",
  "gender": "new_gender",
  "birthdate": "1990-01-01T00:00:00.000Z"
}
```

**Response**

```json
{
  "user_id": "your_user_id",
  "username": "new_username",
  "email": "new_email@example.com",
  "gender": "new_gender",
  "birthdate": "1990-01-01T00:00:00.000Z"
}
```

---

### `DELETE /users/:id`

Admin: Delete user with matching id

**Response**

```json
{ "message": "User removed" }
```

---

## 🛡 Roles

### `GET /roles`

List all roles.

---

### `POST /roles`

Admin: Create new role.

**Request Body**

```json
{
  "role_name": "admin"
}
```

---

## 📦 Subscription Plans

### `GET /plans`

List all available plans.

---

### `GET /plans/:id`

Get details of a subscription plan.

---

### `POST /plans`

Admin: Create a new plan.

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

---

## 🔐 User Subscriptions

### `POST /subscriptions`

Subscribe to a plan.

**Request Body**

```json
{
  "plan_id": 2
}
```

---

### `GET /subscriptions/me`

Get current user's active subscriptions.

---

### `GET /subscriptions/:id`

Admin: Get subscription info.

---

## 💳 Billing

### `GET /billing/me`

Get billing history for current user.

---

### `POST /billing/pay`

Pay for a subscription.

**Request Body**

```json
{
  "user_subscription_id": 3,
  "amount": 12.99,
  "payment_method": "credit_card"
}
```

---

## 🎬 Movies

### `GET /movies`

Retrieve a list of movies with optional filters.

**Query Parameters**

- `search` (string): Search by title or description.
- `genre` (string): Filter by genre.
- `release_year` (number): Filter by release year.
- `is_available` (boolean): Filter by availability.

**Response**

```json
[
    {
        "movie_id": 1,
        "title": "Inception",
        "poster": "https://example.com/inception.jpg",
        "description": "A mind-bending thriller.",
        "release_year": 2010,
        "genre": "Sci-Fi",
        "duration": 148,
        "is_available": true,
        "imdb_id": "tt1375666",
        "slug": "inception"
    },
    ...
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
  "poster": "https://example.com/inception.jpg",
  "description": "A mind-bending thriller.",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148,
  "is_available": true,
  "imdb_id": "tt1375666",
  "slug": "inception",
  "media": [
    {
      "media_id": 1,
      "movie_id": 1,
      "episode": 1,
      "description": "Pilot episode"
    }
  ]
}
```

---

### `POST /movies`

Admin: Create a new movie.

**Request Body**

```json
{
  "title": "Inception",
  "poster": "https://example.com/inception.jpg",
  "description": "A mind-bending thriller.",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148,
  "is_available": true,
  "imdb_id": "tt1375666"
}
```

**Response**

```json
{
  "movie_id": 1,
  "title": "Inception",
  "poster": "https://example.com/inception.jpg",
  "description": "A mind-bending thriller.",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148,
  "is_available": true,
  "imdb_id": "tt1375666",
  "slug": "inception"
}
```

---

### `PUT /movies/:id`

Admin: Update an existing movie.

**Request Body**

```json
{
  "title": "Inception Updated",
  "poster": "https://example.com/inception_updated.jpg",
  "description": "An updated description.",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148,
  "is_available": false,
  "imdb_id": "tt1375666"
}
```

**Response**

```json
{
  "movie_id": 1,
  "title": "Inception Updated",
  "poster": "https://example.com/inception_updated.jpg",
  "description": "An updated description.",
  "release_year": 2010,
  "genre": "Sci-Fi",
  "duration": 148,
  "is_available": false,
  "imdb_id": "tt1375666",
  "slug": "inception-updated"
}
```

---

### `DELETE /movies/:id`

Admin: Delete a movie by its ID.

**Response**

```json
{ "message": "Movie removed" }
```

---

## 📺 Media (Episodes)

### `GET /movies/:id/media`

Get media/episodes for a movie.

---

### `POST /movies/:id/media`

Admin: Add an episode to a movie.

**Request Body**

```json
{
  "episode": 1,
  "description": "Pilot episode"
}
```

---

## 📼 Watch History

### `POST /watch-history`

Track movie watch time.

**Request Body**

```json
{
  "movie_id": 5,
  "watch_duration": 1200
}
```

---

### `GET /watch-history`

Get current user's watch history.

---

## ⭐ Reviews

### `POST /reviews`

Add a movie review.

**Request Body**

```json
{
  "movie_id": 1,
  "rating": 4,
  "review_text": "Amazing movie!"
}
```

---

### `GET /reviews/movie/:movie_id`

Get all reviews for a movie.

---

## 📱 Devices

### `GET /devices`

Get all registered devices for the current user.

---

### `POST /devices`

Register a new device.

**Request Body**

```json
{
  "device_type": "mobile",
  "device_name": "iPhone 13"
}
```

---

## 🛠 Admin Routes

**All admin routes require admin privileges**

- `GET /admin/users`
- `PATCH /admin/users/:id`
- `DELETE /admin/users/:id`
- `GET /admin/billing`
- `GET /admin/watch-history/all`
- `GET /admin/movies`

---

## 🔒 Security

- **Authentication**: All protected routes require JWT in `Authorization: Bearer <token>`.
- **Role Enforcement**: Some routes restricted to `admin`.

---

## 📌 Future Endpoints (Optional Ideas)

- `GET /movies/recommendations`
- `GET /movies/top-rated`
- `POST /auth/forgot-password`
- `PATCH /users/update-password`

---
