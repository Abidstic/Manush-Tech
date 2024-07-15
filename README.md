# Project Setup Guide

This project consists of separate backend and frontend components. Follow the instructions below to set up and run each part.

## Backend Setup

1. Navigate to the server folder in your terminal:
`cd path/to/server`
2. Install dependencies:
npm I
3. Create a `.env` file in the server folder with the following variables:
- `JWT_SECRET`
- `PORT`
- `DATABASE_URL`

Note: The database is pre-created for this project.

4. Start the server:
`npm start`
5. (Optional) To populate the database with dummy data:
`node prisma/seed.js`
## Frontend Setup

1. Navigate to the frontend folder in your terminal:
`cd path/to/frontend`
2. Install dependencies:
`npm run dev`


## Project Description

### Authentication
1. **Sign-In Page:** Users will use `email` and `password` as credentials.
2. **JWT-based Authentication:** Implementing `JSON Web Tokens` for secure authentication.
3. **Banned Users Handling:** Banned users cannot log in and will see a prompt indicating they are banned.

### User Management (Admin)
1. **Add Users:** Admins can add new users.
2. **Data Table with Filters:** Includes `search` and `pagination` for the data table.
3. **Roles:** Supports `Admin` and `General Users` roles.
4. **Admin Controls:** Admins can `update` and `ban` users.
5. **Banned User Restriction:** Banned users are prevented from logging in.

### Item Management Page (Admins Only)
1. **Manage Items:** `Add` and `delete` items including:
- `Chicken Curry` (Protein)
- `Rice` (Starch)
- `Fish Curry` (Protein)
- `Egg Curry` (Protein)
- `Egg Bhorta`
- `Potato Bhorta` (Veg)
- `Daal`
- `Begun Bhaji` (Veg)

### Meal Order Page (General Users)
1. **Weekly Meal Schedules:** View and select meals for each day.
2. **Meal Selection:** `Update` meal choices for each day.
3. **Modification Restrictions:** Cannot change meals for past days.
4. **Monthly Meal Scheduling:** Schedule meals for an entire month.
5. **No Meal Option:** Option to select `"No Meal"` for any day.

### Meal Schedule Page (Admins Only)
1. **User Meal Choices:** View meal choices for every user.
2. **Access Control:** General users cannot access this page.
