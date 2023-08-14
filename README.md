# ft_transcendence

## Introduction

ft_transcendence is a Pong contest website that offers real-time multiplayer online games, chat, and user account functionalities. Developed using NestJS for the backend, a TypeScript framework for the frontend, and PostgreSQL for the database.

## Developers

- 🧓 @Obaid Al Tenaiji
- 👨‍💻 @Bassam Naji
- @Motasem Algunaid
- @Abrar
- @Emad Saad

## Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Features](#features)
  - [User Account](#user-account)
  - [Chat](#chat)
  - [Game](#game)
- [Security](#security)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Setup and Installation

1. **Prerequisites**: List any software or tools that need to be installed beforehand (e.g., Docker, Node.js).
2. **Clone the Repository**: 
   ```
   git clone https://github.com/i99dev/ft_transcendence.git
   ```
3. **Setup**: Instructions to set up the project, including any environment variables, database setup, etc.
4. **Running the Project**: 
   ```
   docker-compose up --build
   ```

## Features

### User Account

- OAuth system of 42 intranet for login.
- Unique display name selection.
- Avatar upload with a default option.
- Two-factor authentication.
- Friend system with status display.
- User stats and match history.

### Chat

- Channel creation with public, private, or password protection.
- Direct messaging.
- User blocking.
- Channel ownership and administration.
- Pong game invitations via chat.

### Game

- Real-time Pong game against other players.
- Matchmaking system.
- Customization options with a default game mode.

## Security

- Hashed passwords.
- Protection against SQL injections.
- Server-side validation.
- Local storage of credentials in a .env file.

## Contribution Guidelines

- Instructions for developers who want to contribute to the project.
- Coding standards and best practices to follow.
- Process for submitting pull requests.

## License

- Information about the licensing of the project. If you're using an open-source license, specify which one and include its text or a link to it.

---
