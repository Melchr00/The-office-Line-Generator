# The-office-Line-Generator
An authenticated Web app that generates a random The-Office line and displays it with a responsive and clean interface.

## Components
- 1. Keycloak server (Docker-container)
- 2. Microservice API (Docker-container) 
- 3. Vite+React built GUI

## Features
- Generate random The-Office line
- Authentication through Keycloak server with role-based Authorization
- Responsive design and accessibility-friendly GUI
- Custom background colors based on Character

## Demo / Code Walkthrough
[https://youtu.be/yBeCqHhJr8A?si=uQbm4iDfCFYW7Aoq]()

## Installation && Usage
- 1. Clone the repo (git clone GitHubLink)
- 2. Start Docker-containers (docker-compose up --build)
- 3. Navigate to frontend-folder (cd the-office-frontend)
- 4. Install dependencies (npm install)
- 5. Build the frontend (npm run build)
- 6. Start the frontend server (npm run dev)
- 7. Navigate to (http://localhost:5173)

## Tech stack
 - Keycloak ( https://www.keycloak.org/ )
 - Docker   ( https://docs.docker.com/get-started/docker-overview/ )
 - Vite     ( https://vite.dev/ )
 - React    ( https://react.dev/)
 - Node && NPM ( https://nodejs.org/en/about &&  https://www.npmjs.com/ )
 
 ## Dependencies used
 Backend: 
 - Express      ( https://www.npmjs.com/package/express )
 - CSV-parser   ( https://www.npmjs.com/package/csv-parser )
 - Cors         ( https://www.npmjs.com/package/cors )
 
 Frontend:
 - React        ( https://www.npmjs.com/package/react )
 - React-dom    ( https://www.npmjs.com/package/react-dom )
 - keycloak-js      ( https://www.npmjs.com/package/keycloak-js )
 - react-oidc-context   ( https://www.npmjs.com/package/react-oidc-context )
 - @react-keycloak/web  ( https://www.npmjs.com/package/@react-keycloak/web )
 - tailwindcss  ( https://www.npmjs.com/package/tailwindcss)
 - @tailwindcss/vite    ( https://www.npmjs.com/package/@tailwindcss/vite )
 - @vitejs/plugin-react ( https://www.npmjs.com/package/@vitejs/plugin-react )
 - framer-motion    ( https://www.npmjs.com/package/framer-motion )


 ## License
 This project is licensed under the MIT License. 






