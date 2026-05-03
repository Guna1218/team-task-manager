# TTM-Team Task Manager

A collaborative project and task management platform designed to help teams organize work, assign responsibilities, and track progress efficiently. Team Task Manager provides a modern full-stack workflow with secure authentication, role-based access, and an intuitive dashboard for day-to-day productivity.
---
## Overview
Team Task Manager allows teams to create projects, manage members, assign tasks, and monitor completion status in one centralized system. It is built with a React frontend and a Node.js backend, using PostgreSQL for reliable data storage and Prisma for database access.
The application is suitable for startups, student teams, internal business operations, or any group that needs a lightweight project coordination tool.
---
## Core Features

## User Authentication
* New user registration
* Secure sign-in with encrypted passwords
* JWT-based session authentication
* Protected routes for authorized users only
* Retrieve active user profile information
  
## Project Administration
* Create new projects
* Browse all accessible projects
* Edit project details
* Remove archived or unused projects
* Add or remove project members
* Control access based on user role

## Task Operations
* Create tasks within projects
* Assign tasks to specific users
* Update task status (Pending, In Progress, Completed)
* Set priority levels (Low, Medium, High)
* Add due dates and deadlines
* Modify or delete tasks when needed

## Team Roles

### Admin
* Full control over projects and members
* Manage tasks across the workspace
* Edit project settings

### Member
* View assigned projects
* Update own tasks
* Collaborate within shared workspaces

## Dashboard
* Project summary metrics
* Task completion insights
* Pending vs completed task tracking
* Team activity overview
* Workflow visibility across projects
---
## Technology Stack

## Frontend
* React
* Vite
* React Router
* Context API
* Tailwind CSS or custom CSS

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JSON Web Token (JWT)
* bcryptjs

---
## Suggested Folder Structure
```bash
team-task-manager/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── services/
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── utils/
│       └── config/
```

---

## Example Use Cases

* Manage software development sprints
* Coordinate internal business teams
* Track academic group projects
* Organize freelance client work
* Supervise operations tasks across departments

---

## Security Practices

* Password hashing with bcryptjs
* Token-based authentication using JWT
* Protected API endpoints
* Role-based permission checks
* Input validation and error handling

---

## Future Improvements

* Real-time notifications
* File attachments on tasks
* Comments and discussions
* Email reminders
* Calendar integration
* Activity logs
* Advanced analytics
* Dark mode interface

---

## Getting Started

### Prerequisites

* Node.js installed
* PostgreSQL installed
* npm or yarn package manager

### Installation

```bash
# Clone repository
git clone <repo-url>

# Move into project
cd team-task-manager

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the server directory:

```env
DATABASE_URL=****
JWT_SECRET=****
PORT=1234
```

### Run Development Servers

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```
---
## Why This Project
Team Task Manager was created to simplify how teams coordinate responsibilities, deadlines, and project execution. Instead of relying on multiple disconnected tools, users can manage their workflow from a single application.
---
## License
This project is available for personal, educational, and portfolio use. Update the license section as needed for production deployment.
