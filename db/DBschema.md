erDiagram
  users {
    integer user_id PK
    varchar username
    varchar email
    varchar password "bcrypt hashed"
    varchar gender
    integer age
    char region "ISO 3166-1 alpha-2"
    enum role "user, admin"
    timestamp created_at
  }

  subscription_plan {
    integer plan_id PK
    varchar plan_name
    float price
    integer max_devices
    boolean hd_available
    boolean ultra_hd_available
    integer duration_days
  }

  user_subscription {
    integer user_subscription_id PK
    integer user_id FK
    integer plan_id FK
    timestamp start_date
    timestamp end_date
  }

  billing {
    integer billing_id PK
    integer user_subscription_id FK
    float amount
    varchar payment_method
    timestamp payment_date
    timestamp due_date
    varchar payment_status
  }

  sessions {
    integer session_id PK
    integer user_id FK
    varchar token
    timestamp created_at
    timestamp expires_at
  }

  watch_history {
    integer user_id FK
    integer movie_id FK
    timestamp watch_time
    integer watch_duration
  }

  reviews {
    integer review_id PK
    integer user_id FK
    integer movie_id FK
    integer rating "1-5"
    varchar review_text
    timestamp review_date
  }

  device {
    integer device_id PK
    integer user_id FK
    varchar device_type
    varchar device_name
    timestamp registered_at
    boolean is_active
    timestamp last_activity
  }

  movies {
    integer movie_id PK
    varchar title
    varchar description
    integer release_year
    integer duration
    boolean is_available
    varchar imdb_id
    varchar poster
  }

  genres {
    integer genre_id PK
    varchar genre_name
  }

  movie_genre {
    integer movie_id FK
    integer genre_id FK
  }

  media {
    integer media_id PK
    integer movie_id FK
    integer episode
    varchar description
    varchar file_path
  }

  movie_uploads {
    integer upload_id PK
    integer movie_id FK
    integer uploaded_by FK
    timestamp upload_date
    enum status "pending, approved, rejected"
  }

  users ||--o{ user_subscription : subscribes
  user_subscription }|--|| subscription_plan : chooses
  user_subscription ||--o{ billing : has
  users ||--o{ sessions : has
  users ||--o{ watch_history : watches
  users ||--o{ reviews : writes
  users ||--o{ device : registers
  movies ||--o{ watch_history : watched_in
  movies ||--o{ reviews : reviewed_by
  movies ||--o{ media : contains
  movies ||--o{ movie_genre : has_genre
  genres ||--o{ movie_genre : categorizes
  movies ||--o{ movie_uploads : uploaded_as
  users ||--o{ movie_uploads : uploads