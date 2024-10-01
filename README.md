# ReactJS & NodeJS CRUD Project

## Introduction

This project is a CRUD (Create, Read, Update, Delete) application built with ReactJS for the frontend and NodeJS for the backend. It facilitates the management of user information with features such as adding new users, viewing existing users, updating user details, and deleting users.

### Features

- **Create:** Add new users to the system.
- **Read:** View the list of existing users.
- **Update:** Modify user information.
- **Delete:** Remove users from the system.

## Instructions

Follow the steps below to set up and run the project on your local machine.

### Prerequisites

- Node.js installed on your machine.

#### Launch Windows Powershell
```bash
# installs fnm (Fast Node Manager)
winget install Schniz.fnm
```

#### Restart/Relaunch Windows Powershell to load newly downloaded package

```bash
# configure fnm environment
fnm env --use-on-cd | Out-String | Invoke-Expression
```

```bash
# download and install Node.js
fnm use --install-if-missing 22
```

```bash
# verifies the right Node.js version is in the environment
node -v # should print `v<version>`
```

```bash
# verifies the right npm version is in the environment
npm -v # should print `<version>`
```

### Installation

#### Inside VSCODE working environment in your root project directory > ctrl + shift + (backtick/grave accent `) to open a new vscode terminal window

```bash
# Clone the repository
git clone https://github.com/JohnFilhmar/NodeJS-and-ReactJS.git
```

```bash
# Navigate to the project directory
cd NODEJS-AND-REACTJS
```

```bash
# Change directory to the backend environment
cd backend
```

```bash
# Install backend dependencies
npm install
```

```bash
# Start the backend environment with nodemon for real time file changes rendering
npm run start
```

#### Create a new command window with ctrl + shift + (backtick/grave accent `)

```bash
# Change directory to the backend environment
cd backend
```

```bash
# Install backend dependencies
npm install
```

```bash
# Start the backend environment
npm start
```

# Done and you can now code away. Good Luck