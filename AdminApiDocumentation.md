# API Documentation V2

## Generic CRUD Controller

The generic CRUD controller is implemented in `controllers/crudController.ts`. It provides reusable functions for handling CRUD operations by accepting parameters like table name, ID column, allowed fields, and excluded columns.

| Method | Path              | Action       | Controller Function |
|--------|-------------------|--------------|---------------------|
| GET    | /resource         | List all     | `getAll(...)`       |
| GET    | /resource/:id     | Get by ID    | `getById(...)`      |
| POST   | /resource         | Create       | `createOne(...)`    |
| PUT    | /resource/:id     | Update       | `updateOne(...)`    |
| DELETE | /resource/:id     | Delete       | `deleteOne(...)`    |

---

## Defined Routes

The `adminRoutes` file includes routes that support:

- **Filtering**: Use query parameters (e.g., `GET /resource?field=value`).
- **Pagination**: Use `limit` and `page` query parameters.
- **Creation and Update**: Send data in the request body (`POST`, `PUT`).

All routes require admin access, enforced by the `admin` middleware.

### Query Parameters

| Parameter   | Applies To         | Description                              |
|-------------|--------------------|------------------------------------------|
| Any column  | All `GET /resource`| Filter results by matching values        |
| `limit`     | All `GET /resource`| Maximum number of records to return (default: 100) |
| `page`      | All `GET /resource`| Page number for pagination (default: 1)  |

Query parameters support comparison operators for filtering results. You can use `key>value` or `key<value` to filter records based on greater-than or less-than conditions.

#### Examples:
- **GET** `/movies?rating>3` - Fetch movies with a rating greater than 3.
- **GET** `/media?season<5` - Fetch media items from seasons less than 5.

This feature allows for more dynamic and precise filtering of data.

---

### Routes and Examples

#### Billing
- **GET** `/billings?payment_status=paid&limit=5&page=2`
- **POST/PUT Body**:
  ```json
  {
    "user_id": 1,
    "subscription_id": 2,
    "due_date": "2025-06-01",
    "payment_date": "2025-06-02",
    "payment_status": "paid",
    "payment_method": "credit_card",
    "amount": 19.99
  }
  ```

#### Devices
- **GET** `/devices?user_id=1&device_type=tv`
- **POST/PUT Body**:
  ```json
  {
    "device_type": "tv",
    "device_name": "Living Room TV",
    "user_id": 1
  }
  ```

#### Media
- **GET** `/media?season=2&status=available`
- **POST/PUT Body**:
  ```json
  {
    "episode": 3,
    "season": 2,
    "description": "The return of the hero.",
    "file_path": "/media/season2/ep3.mp4",
    "status": "available"
  }
  ```

#### Movies
- **GET** `/movies?rating>3`
- **POST/PUT Body**:
  ```json
  {
    "title": "Inception",
    "description": "A dream within a dream.",
    "release_date": "2010-07-16",
    "duration": 148,
    "rating": 4.8,
    "imdb_id": "tt1375666"
  }
  ```

#### Subscription Plans
- **GET** `/plans?hd_available=true`
- **POST/PUT Body**:
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

#### Reviews
- **GET** `/reviews?movie_id=5&rating=5`
- **POST/PUT Body**:
  ```json
  {
    "user_id": 1,
    "movie_id": 5,
    "media_id": null,
    "rating": 5,
    "review_text": "Amazing!"
  }
  ```

#### User Subscriptions
- **GET** `/subscriptions?user_id=1`
- **POST/PUT Body**:
  ```json
  {
    "plan_id": 2,
    "user_id": 1,
    "start_date": "2025-05-01",
    "end_date": "2025-06-01"
  }
  ```

#### Users
- **GET** `/users?role=admin&region=NA`
- **POST/PUT Body**:
  ```json
  {
    "username": "johnsmith",
    "email": "john@example.com",
    "role": "admin",
    "gender": "male",
    "birthdate": "1990-01-01",
    "region": "NA"
  }
  ```
> **Note**: `GET /users/:id` excludes the `password` field by default.
