# ticketing-system

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# How to Run App
App is seperated into Server and Client folder each has its own package.json
Make sure to run npm i in both folders.

## Dotenv
- run: npm i dotenv in server folder
    - add a .env in the root and add:

        - DB_PASSWORD="Database Password" 
        - PORT="Database Port"
        - DB_USER="sa"
        - DB_HOST="localhost"
        - DB_NAME="Master"

## Client
- run: npm run dev

## Server 
- install nodemon
- run: nodemon server.js

### Create DB and run Script to Create DB and Seed Data
Run Docker Command:
- docker run -d --name SQL_Server_Ticketing_System -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=Your Strong Password' -p 1402:1433 mcr.microsoft.com/mssql/server:2022-latest

- run db script to create and seed database
    - run: node init-db.js

## 📡 Ticketing System API Routes

**Base URL**
http://localhost:3000/api
---
## 👤 Users

### Get all users
GET /users

---

## 🎫 Tickets

### Get all tickets
GET /tickets

### Get ticket by ID
GET /tickets/:id

### Create a new ticket
POST /tickets

**Request Body**
```json
{
  "title": "Printer not working",
  "description": "Printer shows paper jam error",
  "createdBy": 1,
  "priorityId": 2,
  "categoryId": 1
}
```
### Update ticket

```json
{
  "statusId": 2,
  "assignedTo": 3,
  "priorityId": 4
}
```

### Delete Ticket
DELETE /tickets/:id

## Ticket Comments

### Get comments for a ticket
GET /tickets/:id/comments

### Create comment for a ticket
POST /tickets/:id/comments
```json
{
  "userId": 2,
  "comment": "Looking into this now."
}
```

### Update comment
PUT /tickets/comments/:commentId

### Delete comment
DELETE /tickets/comments/:commentId