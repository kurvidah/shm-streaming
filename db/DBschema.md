erDiagram
  users {
    integer user_id PK
    varchar username
    varchar email
    varchar password
    varchar gender
    integer age
    varchar region 
    integer role_id
    timestamp created_at
  }

  roles {
    integer role_id PK
    varchar role_name
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

  watch_history {
    integer user_id FK
    integer media_id FK
    timestamp timestamp
    integer watch_duration
  }

  reviews {
    integer review_id PK
    integer user_id FK
    integer movie_id FK
    integer rating
    varchar review_text
    timestamp review_date
  }

  device {
    integer device_id PK
    integer user_id FK
    varchar device_type
    varchar device_name
    timestamp registered_at
  }

  movies {
    integer movie_id PK
    varchar title
    varchar description
    integer release_year
    varchar genre
    integer duration
    boolean is_available
    varchar imdb_id
  }

  media {
    integer media_id PK
    integer movie_id FK
    integer episode
    varchar description
  }

  users ||--o{ user_subscription : subscribes
  users }o--o{ roles : has_role
  user_subscription }|--|| subscription_plan : chooses
  user_subscription ||--o{ billing : has
  users ||--o{ watch_history : watches
  users ||--o{ reviews : writes
  users ||--o{ device : registers
  movies ||--o{ watch_history : watched_in
  movies ||--o{ reviews : reviewed_by
  movies ||--o{ media : contains