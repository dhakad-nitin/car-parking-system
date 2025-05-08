<p align="center">
  <img src="https://github.com/user-attachments/assets/c6f395b4-22d8-477c-a0de-e2afd6fff8ea" width="120" alt="Car Parking System Logo" />
</p>

<h1 align="center">Car Parking System API</h1>

<p align="center">
  A scalable backend API for managing car parking lots, meticulously crafted with NestJS.
  <br />
  <a href="https://car-parking-system.up.railway.app/" target="_blank"><strong>View Live Demo Landing Page »</strong></a>
  <br />
  <br />
  <a href="https://car-parking-system.up.railway.app/api-docs" target="_blank">View API Documentation</a>
  ·
  <a href="https://github.com/dhakad-nitin/car-parking-system/issues" target="_blank">Report Bug</a>
  ·
  <a href="https://github.com/dhakad-nitin/car-parking-system/issues" target="_blank">Request Feature</a>
</p>

## About The Project

This project provides a comprehensive backend API for managing car parking facilities. It allows for operations such as parking and unparking vehicles, querying vehicle information, and managing parking lot capacity. The system is designed to be scalable and efficient, leveraging the power of the NestJS framework.

**Live Application URL (Landing Page):** [https://car-parking-system.up.railway.app/](https://car-parking-system.up.railway.app/)

The landing page provides a brief overview and links to the API documentation. The core of this project is the backend API itself.

### Key Features:

*   **Create and manage multiple parking lots:** Easily set up and configure new parking areas.
*   **Park and unpark cars:** Track vehicle entry and exit with registration details.
*   **Query cars by color and registration number:** Quickly find vehicles based on specific criteria.
*   **Expand parking lot capacity:** Dynamically adjust the size of parking lots as needed.
*   **Real-time parking lot status monitoring:** Get up-to-date information on parking availability.

### Built With

*   [NestJS](https://nestjs.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Node.js](https://nodejs.org/)
*   [Docker](https://www.docker.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

*   npm
    ```sh
    npm install npm@latest -g
    ```
*   Node.js (v18 or higher recommended, as per Dockerfile)
*   Docker (optional, for containerized deployment)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/dhakad-nitin/car-parking-system.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

## Usage

### Running the application

```bash
# development
npm run start

# watch mode (for development with auto-reloading)
npm run start:dev

# production mode
npm run start:prod
```

The application will be available at `http://localhost:3000`. The API documentation (Swagger UI) can typically be accessed at `http://localhost:3000/api-docs` (or your configured path) when running locally.

### Running Tests

This project uses [Jest](https://jestjs.io/) for unit testing.

```bash
# unit tests
npm run test
```

## API Endpoints

The API allows for various operations related to parking lot management. Detailed API documentation is available at:
[https://car-parking-system.up.railway.app/api-docs](https://car-parking-system.up.railway.app/api-docs)

Key operations include:
*   Creating parking lots
*   Parking a car
*   Unparking a car
*   Getting car information by registration number
*   Getting car information by color
*   Checking parking lot status

### API Endpoint Details

Below is a summary of the available API endpoints:

| Method | Endpoint                               | Description                                            |
|--------|----------------------------------------|--------------------------------------------------------|
| POST   | `/carparking/create`                   | Create a new parking lot                               |
| PATCH  | `/carparking/{id}/expand`              | Expand an existing parking lot                         |
| POST   | `/carparking/{id}/park`                | Park a car in the parking lot                          |
| POST   | `/carparking/{id}/free`                | Free a parking slot                                    |
| GET    | `/carparking/{id}/status`              | Get parking lot status                                 |
| GET    | `/carparking/{id}/regnos`              | Get registration numbers by car color                  |
| GET    | `/carparking/{id}/slots`               | Get parking slots by car color                         |
| GET    | `/carparking/{id}/slot`                | Get parking slot by registration number                |
| GET    | `/carparking/{id}/count_by_color`      | Get count of cars by color for a specific parking lot  |
| DELETE | `/carparking/{id}`                     | Delete a parking lot by ID                             |

*(Note: `{id}` in the endpoints should be replaced with the actual parking lot ID.)*

## Docker

This project includes a `Dockerfile` for easy containerization.

### Build the Docker image:

```bash
docker build -t car-parking-system .
```

### Run the Docker container:

```bash
docker run -p 3000:3000 car-parking-system
```
This will expose the application on port 3000 of your host machine.

## Deployment

This application is deployed on Railway and is accessible at [https://car-parking-system.up.railway.app/](https://car-parking-system.up.railway.app/). The API documentation is available at [https://car-parking-system.up.railway.app/api-docs](https://car-parking-system.up.railway.app/api-docs).

The `Dockerfile` in the repository is configured to build and run the application. Platforms like Railway can use this `Dockerfile` to deploy the application.

## Contact

Nitin Dhakad
*   Portfolio: [https://nitindhakad.vercel.app/](https://nitindhakad.vercel.app/)
*   Email: dnitin762@gmail.com
*   Project Link: [https://github.com/dhakad-nitin/car-parking-system](https://github.com/dhakad-nitin/car-parking-system)

## Acknowledgements

*   [NestJS Documentation](https://docs.nestjs.com)
*   [Railway](https://railway.app/)
*   [Icon8 for the logo](https://icons8.com)
