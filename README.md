# Backend (Express.js + MongoDB)

## Overview
- RESTful API for Rooms and Bookings
- MongoDB via Mongoose
- Routes, Controllers, Models separation

## Prerequisites
- Node.js 18+
- MongoDB running locally or a cloud URI

## Setup
- Copy `.env` (if needed) and set:
- `MONGO_URI=mongodb://localhost:27017/booking_app`
- `PORT=4000`
- Install deps:
- `npm install`

## Run
- `node server.js`
- Server listens on `http://localhost:4000`
- API base path: `/api`

## Project Structure
- `server.js` — app bootstrap, Mongo connection, route mounting
- `routes/` — route definitions
- `controllers/` — business logic and error handling
- `models/` — Mongoose schemas

## Data Models
- Room
  - `name` (String, required)
  - `type` (String, required)
  - `pricePerNight` (Number, required)
  - `capacity` (Number, required)
  - `description` (String)
  - `bedSize` (String)
  - `amenities` (String[])
  - `status` (available | cleaning | taken, default: available)
- Booking
  - `customerName` (String, required)
  - `customerPhone` (String)
  - `room` (ObjectId -> Room, required)
  - `startDate` (Date, required)
  - `endDate` (Date, required)
  - `status` (confirmed | pending | cancelled, default: confirmed)

## Endpoints
- Rooms
  - `GET /api/rooms` — list rooms
  - `PUT /api/rooms/:id` — update room fields (e.g., status)
- Bookings
  - `GET /api/bookings` — list bookings (populated room)
  - `POST /api/bookings` — create booking
  - `PUT /api/bookings/:id` — update booking
  - `DELETE /api/bookings/:id` — delete booking

## Validation & Errors
- Create Booking verifies required fields
- Overlap check prevents double-booking
- Controllers return JSON with appropriate status codes

