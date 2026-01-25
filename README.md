# Street Cats 🐾

## 📌 Overview

**Street Cats** is a Single Page Application (SPA) designed to share sightings of street cats. 

Developed as an individual project for the *Web Technologies* course at the University of Naples Federico II (6 ECTS).

Users can create posts with images, geolocate sightings on a map, and interact with posts through likes and comments. Guests can browse and search posts without registration, while authenticated users can contribute content and interact with other users.

---

## 📌 Key features

* Map-based search and visualization of posts
* Post creation with images, geolocation, and Markdown-formatted descriptions
* Authentication and authorization using JWT stored in HTTP-only cookies
* Like and comment system
* Guest vs authenticated user experience
* Robust input validation and permission handling

---

## 📌 Architecture

* **Front-end:** Vue SPA, Pinia state management
* **Back-end:** Django REST API with JWT auth
* **Database:** PostgreSQL + PostGIS
* **Deployment:** Dockerized (frontend, backend, DB, tests)
* Originally two separate repos; merged for demonstration


---

## 📌 Front-end

**Tech Stack**:

* Vue.js (SPA framework)
* Vue Router (client-side routing)
* Pinia (state management)
* Zod (form validation)
* Fetch API (HTTP requests)
* Markdown-it (Markdown rendering)
* Leaflet.js (interactive maps)
* Tailwind CSS (styling)
* Vite (development environment)
* Playwright (end-to-end testing)

**Highlights:**

* Fully reactive and modular SPA
* Feature-based modular architecture
* Markdown editor with live preview (limited subset, Reddit-style)
* Map search with suggestions (Nominatim) & interactive markers
* Robust guest/auth user handling
* E2E tests using Playwright to validate critical flows

---

## 📌 Back-end

**Tech Stack**:

* Python with Django framework
* PostgreSQL with PostGIS extension for geospatial data


**Authentication & Security**:

* JWT stored in cookies (HTTP-only, secure: false, SameSite: Lax)
* Access control enforced server-side
* Endpoints validate user permissions and input data

**Deployment / Development**:

* All services run locally in Docker containers


---

## 📌 User experience

**Home Page**:

* Full-page interactive map with markers representing posts
* Floating header with search bar, authentication menu, and create post button
* Map search can be performed via typing (with suggestions) or "Search Here" button
* Results are visible on the map or as a sidebar list

**Post Page**:

* Shows user profile, nationality, time since posting, post title, Markdown-formatted content
* Image gallery with navigation
* Mini-map indicating sighting location
* Likes and comments (restricted to authenticated users)

**Create Post Page**:

* Requires login
* Supports image upload (file browser or drag-and-drop)
* Interactive map to select geolocation (zoom-enforced for precision)
* Markdown description with live preview

**Authentication Modal**:

* Sign up with username, email, password, date of birth, country, optional profile picture
* Login with username/email + password
* Remember me functionality (persistent JWT token)
* All form inputs validated client-side and server-side

---

## 📌 Demo
### Signing up
<p align="center">
  <img src="https://github.com/user-attachments/assets/5cfd773d-4666-45d8-bc27-7faa65eef9de" width="90%">
</p>

### Viewing a post
<p align="center">
  <img src="https://github.com/user-attachments/assets/293c9def-0b25-4f17-bdce-5d4e7c5c3acb" width="90%">
</p>

### Creating a post
<p align="center">
  <img src="https://github.com/user-attachments/assets/9680f5ff-8a65-4812-b718-8513a878a0db" width="90%">
</p>

