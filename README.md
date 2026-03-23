
# Full Stack Development Preliminary Exercise Using Node.js, Docker, React, and GitHub


This repository contains a simple Hangman game implemented using React and the Vite build tool. The project demonstrates basic frontend development concepts while introducing containerization with Docker and version control using GitHub.

The application renders a graphical Hangman interface, allows the user to guess letters through a text input, and dynamically updates the UI depending on whether guesses are correct or incorrect.

---

## Underlying Concepts & Supporting Technologies/APIs

Programmers attempting to replicate or deploy this project should be familiar with the following:

1. GitHub for code versioning and repository management  
2. React for frontend development and component-based UI design  
3. Docker for containerizing and distributing applications  
4. CLI (Command Line Interface) tools for navigating directories and running development commands  
5. Node.js and npm for dependency management and running JavaScript applications outside the browser  

Before running the project, please perform the following setup tasks.

---

## Environment Setup

### Install Node Version Manager (nvm)

Node Version Manager allows developers to install and manage multiple versions of Node.js.

Verify installation with:

node --version
npm --version

npm (Node Package Manager) installs all required project dependencies.

---

### Create a GitHub Account and Add an SSH Key

Follow the directions at:

https://docs.github.com/en/authentication/connecting-to-github-with-ssh

This allows secure authentication for pushing and pulling code from GitHub repositories.

---

### Install Docker Desktop (Optional)

Docker allows applications to run inside containerized environments.

Mac installation guide:  
https://docs.docker.com/desktop/setup/install/mac-install/

Windows installation guide:  
https://docs.docker.com/desktop/setup/install/windows-install/

Docker is optional but recommended for distributing applications without requiring users to configure their own development environments.

---

## Core Dependencies

### JavaScript (ES6+)

This project uses modern JavaScript features standardized in ES6 and later revisions. These include:

- Arrow functions  
- Modules  
- Destructuring  
- Template literals  
- React function components  

Modern JavaScript ensures compatibility with current browser environments and modern frontend frameworks.

---

### React

React is a JavaScript library used to build component-based user interfaces. The application is composed of several reusable React components, including:

- Header  
- Hangman display  
- Word display  
- Keyboard display  
- Guess input  
- New game button  

React manages application state and updates the DOM automatically when the user submits guesses.

---

### React DOM

The react-dom package connects React components to the browser's Document Object Model (DOM). It is responsible for rendering the application into the root element defined in the HTML file.

---

### Vite

Vite is used as the development server and build tool for this project. It provides fast startup times and efficient module bundling for modern frontend development.

---

## Project Structure

hangman-game/

public/
assets/
hangman/
letters/
keys/
Line.drawio.png

src/
components/
GuessInput.jsx
HangmanImage.jsx
Header.jsx
KeyboardDisplay.jsx
NewGameButton.jsx
WordDisplay.jsx

App.jsx
App.css
assets.js
game.js
words.js
index.css
main.jsx

package.json
vite.config.js
index.html

---

## Game Features

The Hangman game includes the following features:

- Random word selection from a predefined list  
- Graphical hangman updates after incorrect guesses  
- Keyboard display showing letters that have already been used  
- Letter images rendered above lines when correctly guessed  
- Case-insensitive letter input  
- Input validation that prevents non-alphabetical characters  
- Notification if a letter has already been used  
- Game completion messages indicating whether the player won or lost  
- Full word reveal at the end of each round  
- "New Game" button to restart gameplay  

---

## Getting Started

1. Clone this repository:

git clone https://github.com/YOUR_USERNAME/hangman-game.git

2. Navigate to the project directory:

cd hangman-game

3. Install dependencies:

npm install

4. Start the development server:

npm run dev

5. Open your browser and navigate to:

http://localhost:5173

---

## Building the Project

To create a production build of the application:

npm run build

To preview the built application locally:

npm run preview

---

## Running with Docker (Optional)

Build the Docker image:

docker build -t hangman-game .

Run the container:

docker run -p 5173:5173 hangman-game

The application will then be available at:

http://localhost:5173

---

## Summary

This project demonstrates the integration of several important modern development tools and practices:

- Component-based frontend development with React  
- Rapid development workflows using Vite  
- Version control with GitHub  
- Containerized deployment using Docker  

Together, these technologies represent a common workflow used in contemporary full-stack web development.