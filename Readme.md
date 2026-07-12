# Amigo Web Application 🤖

Amigo is a modern, high-fidelity administrative dashboard and backend system designed to manage and track an autonomous fleet of hospital delivery robots. It allows hospital staff to monitor active robots, view patient room assignments, and schedule real-time medication deliveries.

## 🚀 Tech Stack

This project is built using a highly scalable, decoupled architecture:

### Frontend (User Interface)
*   **Next.js 16 (React 19)**: Framework for the interactive UI.
*   **Glassmorphism UI**: Custom vanilla CSS paired with Tailwind CSS for a premium, dark-mode aesthetic.
*   **Next.js Proxy**: Configured as a secure reverse-proxy to protect backend API calls.

### Backend (API & Logic)
*   **.NET 9 (ASP.NET Core)**: High-performance RESTful API backend.
*   **Entity Framework Core**: ORM for robust database querying and migrations.

### Database & Infrastructure
*   **PostgreSQL (Supabase)**: Cloud-hosted relational database managing Wards, Patients, Robots, and Deliveries.
*   **Docker & Docker Compose**: Fully containerized using optimized, multi-stage builds for both Next.js and .NET.

---

## ⚙️ How It Works

1.  **Facility Mapping:** The dashboard dynamically maps hospital Wards to specific Patient Rooms by querying the `.NET` database. 
2.  **Robot Telemetry:** Live robot data (battery life, current location, active status) is displayed on an interactive grid, showing exactly which room the robot is serving.
3.  **Dispense Scheduling:** Nurses can use the "Schedule Dispense" feature to assign a specific robot to deliver medication to a specific patient at a scheduled time.
4.  **Secure Architecture:** The internet (or ngrok) only communicates with the `Next.js` frontend. Next.js securely routes data requests internally to the `.NET` backend, completely shielding the database from the public web.

## 🛠️ How to Run Locally

You do not need to install Node.js or .NET locally to run this project. It is fully containerized.

1. Ensure **Docker Desktop** is installed and running.
2. Clone this repository.
3. Create an `.env` file in `amigo-backend/Amigo.Api/` containing your Supabase PostgreSQL connection string.
4. Run the following command in the root directory:

```bash
docker compose up --build -d
```

5. Open your browser and navigate to `http://localhost:3000`.
