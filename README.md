# SHM Streaming

SHM Streaming is a full-stack streaming platform that allows users to browse, watch, and manage their subscriptions for movies and TV shows. The platform includes user and admin functionalities, such as content management, subscription management, and billing.

## Features

### Frontend

- **User Features**:

  - Browse movies and TV shows.
  - Watch content with a built-in video player.
  - Manage subscriptions, watch history, and registered devices.
  - User authentication (login, registration, and profile management).

- **Admin Features**:
  - Manage users, movies, and subscriptions.
  - View and process billing information.
  - Moderate user reviews and manage content availability.

### Backend

- **API**:

  - RESTful API for user and admin operations.
  - Secure endpoints for authentication and authorization.
  - Handles subscription plans, billing, and user data.

- **Database**:
  - Relational database schema for users, subscriptions, movies, and billing.
  - Pre-seeded data for testing and development.

## Tech Stack

### Frontend

- **Framework**: React with TypeScript
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Video Playback**: HLS.js and React Player

### Backend

- **Framework**: Django with Django REST Framework
- **Database**: MySQL
- **Authentication**: Token-based authentication

### DevOps

- **Containerization**: Docker and Docker Compose
- **Environment Management**: `.env` files for configuration
- **Build Tools**: Vite for frontend

## Installation

### Prerequisites

- Docker and Docker Compose installed.
- Node.js and bun installed (for local frontend development).

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/kurvidah/shm-streaming.git
   cd shm-streaming
   ```

2. Create a `.env` file in the root directory based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. Run the setup script:

- For MacOS/Linux
  ```bash
  ./setup.sh
  ```
- For Windows
  ```bash
  ./setup.bat
  ```

4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)

## Usage

### Frontend

- Start the development server:
  ```bash
  cd frontend
  bun install
  bun run dev
  ```

### Backend

- Run the Express development server:
  ```bash
  cd backend
  bun install
  bun index.ts
  ```

### Database

- MariaDB is used as the database. The schema and seed data are located in the `db` directory:
  - `schema.sql`: Defines the database structure.
  - `seed.sql`: Inserts sample data for testing.

## Project Structure

```
shm-streaming/
├── backend/                # Django backend
├── db/                     # Database schema and seed files
├── frontend/               # React frontend
├── .env                    # Environment variables
├── docker-compose.yml      # Docker Compose configuration
├── setup.sh                # Setup script
└── README.md               # Project documentation
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Submit a pull request.
