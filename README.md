# TechnicalTest

A full-stack stock management application built as a technical test.

The application consists of:

* **Backend** — NestJS, TypeScript, PostgreSQL
* **Frontend** — Next.js, React, TypeScript
* **Database** — PostgreSQL

The frontend and backend are separate applications and must be run independently during local development.

---

## Project Structure

```text
TechnicalTest/
├── backend/
├── frontend/
├── TechnicalTestERD.drawio
├── package.json
└── README.md
```

---

## Prerequisites

Install the following before running the application:

* [Node.js](https://nodejs.org/)
* npm
* PostgreSQL
* Git
* pgAdmin (optional, makes installing the database much easier)

Check your Node.js and npm versions:

```bash
node --version
npm --version
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/peteredric/TechnicalTest.git
```

Navigate into the project:

```bash
cd TechnicalTest
```

The backend and frontend have separate dependencies, so install them independently.

---

# Database Setup

This application uses PostgreSQL as its database.

Before starting the backend, make sure PostgreSQL is installed and running.

## 1. Create the Database

Using **pgAdmin**:

1. Open pgAdmin and connect to your PostgreSQL server.
2. Right-click **Databases**.
3. Select **Create → Database**.
4. Enter the database name:

```text
stock_management
```

5. Click **Save**.

The application expects PostgreSQL to be running locally with the following default configuration:

```text
Host:     localhost
Port:     5432
Database: stock_management
```

If you use different database credentials or connection settings, update the backend environment variables accordingly.

---

## 2. Configure the Backend

Create a `.env` file inside the `backend` directory. An `.env.example` file is included as a template. Copy that `.env.example` file to create your own `.env` file in the `backend` directory.

Configure the environment variables according to your local PostgreSQL setup.

For example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=stock_management
```

Use the credentials configured during your PostgreSQL installation.

The values should correspond to:

| Variable      | Description                      |
| ------------- | -------------------------------- |
| `DB_HOST`     | PostgreSQL server host           |
| `DB_PORT`     | PostgreSQL server port           |
| `DB_USERNAME` | PostgreSQL database user         |
| `DB_PASSWORD` | Password for the database user   |
| `DB_DATABASE` | Name of the application database |

---

## 3. Database Schema

The application uses the database schema defined by the backend entities and configuration.

As this database is intended for development and technical evaluation purposes, TypeORM's `synchronize` option is set to `true`. This allows the database schema to be automatically synchronized with the backend entities when the application starts.

> **Note:** `synchronize: true` is intended for development purposes and should generally not be used in production environments, as automatic schema synchronization can potentially result in data loss.

The Entity Relationship Diagram for the application is available at:

```text
TechnicalTestERD.drawio
```

Go to [https://app.diagrams.net/](https://app.diagrams.net/) and drag the file to view the database structure.

---

## 4. Start PostgreSQL

PostgreSQL must be running before starting the backend.

The default local configuration is:

```text
Host:     localhost
Port:     5432
Database: stock_management
```

Once PostgreSQL is running and the database has been created, start the backend.

---

# Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend in development mode:

```bash
npm run start:dev
```

The backend will start on the port configured by the application. Normally, the port used will be port `3000`. If the database connection details are correct, the backend should be able to connect to PostgreSQL during startup.

---

# Frontend Setup

Open a second terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file inside the `frontend` directory. Similar to the `backend` directory, an `.env.example` file is included as a template for easier installation. Use that file as a template to create your own `.env.local` file in the `frontent` directory.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace the port with the actual port used by the backend.

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3001
```

If port `3001` is already in use, Next.js may start on another port, such as:

```text
http://localhost:3002
```

Open the URL displayed in the terminal.

---

# Running the Application Locally

Both the backend and frontend need to be running simultaneously.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run start:dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend communicates with the backend using:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

# Features

## Master Stock

The application displays a table containing the current master stock data.

The table can be refreshed to retrieve the latest stock information from the backend.

<img width="1262" height="947" alt="image" src="https://github.com/user-attachments/assets/c33ac22e-7344-47ca-a0df-abad6b0a5421" />

---

## Create Stock

Create a new master stock item with information such as:

* Nama Barang
* SKU
* Satuan Pembelian
* Satuan Penjualan
* Konversi

<img width="1916" height="948" alt="image" src="https://github.com/user-attachments/assets/a02bc515-e42a-4692-9f33-a5fd6933322f" />

---

## Add Stock Transaction

Add stock through a transaction.

The transaction includes:

* Nomor Transaksi
* Tanggal Transaksi
* Item
* Quantity
* Keterangan

The transaction number can be automatically generated when the field is left empty.
The Item field is a dropdown which includes all the currently listed stock.

After a successful transaction:

1. The backend processes the transaction.
2. The stock quantity is updated.
3. The frontend refreshes the stock table.
4. The form is cleared.
5. A success notification is displayed.

<img width="1917" height="944" alt="image" src="https://github.com/user-attachments/assets/13820257-5c92-4d88-b43a-07779617702e" />

---

## Cancel Transaction

Cancel an existing stock transaction. Input the `Nomor Transaksi` field to cancel that transaction.

The stock quantity will be adjusted according to the cancelled transaction.

<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/dd42b522-811a-4b42-b71a-a35112edfc50" />

---

# Environment Variables

Environment files are intentionally excluded from version control.

Create the required environment files locally using `.example` files provided in the repository:

```text
backend/.env
frontend/.env.local
```

Do not commit sensitive credentials such as database passwords to GitHub.

---

# Troubleshooting

## Backend Cannot Connect to PostgreSQL

Check that:

* PostgreSQL is running.
* The database exists.
* The database credentials are correct.
* The database host and port are correct.
* The backend `.env` file exists.

---

## Frontend Cannot Connect to Backend

Check that:

1. The backend is running.
2. `NEXT_PUBLIC_API_URL` points to the correct backend URL.
3. The backend port is correct.
4. The frontend was restarted after changing `.env.local`.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Port 3000 Is Already in Use

You can run the frontend on another port:

```bash
npm run dev -- -p 3001
```

Then open:

```text
http://localhost:3001
```

Make sure the frontend's API URL still points to the backend's port, not the frontend's port.

For example:

```text
Frontend: http://localhost:3001
Backend:  http://localhost:3000
```

The frontend environment variable should be:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

# Database Design

The database design is available in:

```text
TechnicalTestERD.drawio
```

This file contains the Entity Relationship Diagram used for the application.
Go to [https://app.diagrams.net/](https://app.diagrams.net/) and drag the file to view the database structure.

---

# Repository

GitHub repository:

https://github.com/peteredric/TechnicalTest

---

# License

This project is licensed under the MIT License.
