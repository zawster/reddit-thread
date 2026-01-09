# Full-Stack Reddit Clone

A modern, high-performance Reddit clone built with **FastAPI** (Backend) and **Next.js** (Frontend). This project features real-time notifications, recursive nested comments, voting mechanisms, global search, and community-based discussions.

![Application Snapshot](./screenshots/home_page.png)

## 🚀 Features

### Core Reddit Experience
- **Community Management**: Create and browse subreddits (`r/technology`, `r/silent`, etc).
- **Content Creation**: Post text-based content to any community.
- **Recursive Nested Comments**: Infinite-level deep comment threads using PostgreSQL recursive logic.
- **Idempotent Voting**: Standard Reddit-style upvote/downvote system with score calculation.
- **Subreddit Icons**: Automated Identicon generation for all communities.

### Advanced Capabilities
- **Real-time Notifications**: Instant WebSocket alerts when someone comments on your post.
- **Global Search**: Search for posts and communities from the navigation bar.
- **User Profiles**: Track post history and user statistics.
- **Modern Sidebar**: Discover "Popular Communities" with real-time member counts.

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Cache/WS**: Redis
- **Security**: JWT-based OAuth2 authentication

### Frontend
- **Framework**: Next.js 14 (App Router & Turbopack)
- **Styling**: Tailwind CSS
- **State Management**: React Context (Auth)
- **Icons**: React Icons (Fa, Hi)

### Infrastructure
- **Containerization**: Docker & Docker Compose

## 📦 Setup & Installation

### Prerequisites
- Docker & Docker Compose installed on your system.

### Running the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zawster/reddit-thread.git
   cd reddit-thread
   ```

2. **Start the services**:
   ```bash
   docker compose up -d --build
   ```

3. **Seed initial data** (Admin user and default subreddits):
   ```bash
   docker compose exec backend python seed.py
   ```

4. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **API Documentation**: [http://localhost:8001/docs](http://localhost:8001/docs)

## 📸 Screenshots

### Home Feed
![Home Feed](screenshots/home_page.png)

### Create Post
![Create Post](screenshots/create_post.png)

### User Profile
![User Profile](screenshots/profile.png)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button at the top right of this repository.

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/reddit-thread.git
   cd reddit-thread
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Use a descriptive branch name (e.g., `feature/add-dark-mode`, `fix/comment-bug`).

4. **Make your changes**
   - Write clean, readable code.
   - Follow existing code style and conventions.
   - Test your changes locally.

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```
   Use clear commit messages (e.g., `Add: user avatar upload`, `Fix: nested comment rendering`).

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository and click "New Pull Request".
   - Select your branch and provide a clear description of your changes.
   - Link any related issues if applicable.

### Guidelines

- Ensure your code follows the project's coding standards.
- Update documentation if you're adding new features.
- Make sure all existing tests pass before submitting.
- Keep pull requests focused on a single feature or fix.

### Reporting Issues

If you find a bug or have a feature request, please open an issue with:
- A clear title and description.
- Steps to reproduce (for bugs).
- Expected vs actual behavior.

---
