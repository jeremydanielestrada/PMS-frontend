# Project Management System

A comprehensive project management solution built with Vue 3 and Vuetify, featuring task management, team collaboration, and real-time updates.

## Features

### User Management

- **Role-based Access Control**
  - Admin: Full system access
  - Leader: Project and team management
  - Member: Task execution and updates
- **User Authentication**
  - Secure login/logout
  - Password reset functionality
  - Profile management

### Project Management

- **Project Overview**
  - Create and manage projects
  - Assign team members
  - Track project progress
  - Set project deadlines
- **Team Management**
  - Add/remove team members
  - Assign roles (leader/member)
  - View team member contributions

### Task Management

- **Kanban Board**
  - Drag-and-drop task organization
  - Status tracking (Todo, In Progress, Completed)
  - Visual progress indicators
- **Task Features**
  - Create and assign tasks
  - Set priorities (Low, Medium, High)
  - Add descriptions and due dates
  - Create subtasks
  - Track completion status

### Dashboard

- **Analytics Overview**
  - Total projects count
  - Task completion rates
  - Project progress tracking
- **Status Breakdown**
  - Tasks by status
  - Project completion metrics
  - Team performance indicators

## Technical Stack

- **Frontend**
  - Vue 3 (Composition API)
  - Vuetify 3
  - Pinia for state management
  - Vue Router for navigation

- **Key Dependencies**
  - `vue-draggable`: For Kanban board functionality
  - `axios`: For API communication
  - `moment.js`: For date handling
  - `vuetify`: For UI components

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Project-Management-System-FrontEnd.git
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL.

4. Start development server:

```bash
npm run dev
```

## Usage

### Authentication

1. Register a new account or login with existing credentials
2. Admin accounts can manage users and assign roles
3. Project leaders can create and manage projects

### Project Creation

1. Navigate to Projects section
2. Click "Create Project"
3. Fill in project details:
   - Name
   - Description
   - Due date
   - Team members

### Task Management

1. Open a project
2. Use the Kanban board to:
   - Create new tasks
   - Drag tasks between status columns
   - Add subtasks
   - Update task status

### Team Collaboration

1. Assign team members to projects
2. Set member roles (leader/member)
3. Track member contributions
4. Manage task assignments

## Development

### Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint code
npm run lint
```

### File Structure

```
src/
├── components/         # Reusable Vue components
├── views/             # Page components
├── stores/            # Pinia state management
├── router/            # Vue Router configuration
├── assets/            # Static assets
└── utils/             # Helper functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT License](LICENSE.md)

## Support

For support, email [your-email@example.com](mailto:your-email@example.com)
