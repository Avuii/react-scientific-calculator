# 🧮 React Scientific Calculator

<p align="center">
  <strong>Modern scientific calculator web app with interactive graphing mode.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-Core-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" />
  <img src="https://img.shields.io/badge/Canvas-Graphs-9F7AEA?style=for-the-badge" />
  <img src="https://img.shields.io/badge/CSS-Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Web-App-111827?style=for-the-badge&logo=googlechrome&logoColor=white" />
</p>

<p align="center">
  <a href="https://avuii.github.io/react-scientific-calculator/">
    <strong>Live Demo</strong>
  </a>
</p>

---

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Graphing Mode](#graphing-mode)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [What I Learned](#what-i-learned)
- [Future Improvements](#future-improvements)

---

<a id="overview"></a>
## 📌 Overview

**React Scientific Calculator** is a modern web application for performing basic and scientific calculations.

The project includes a clean glassmorphism-inspired interface, dark and light mode, calculation history, keyboard support and an interactive graphing mode for visualizing mathematical functions.

The application was created to practice building a responsive web interface with **React**, **Vite**, **JavaScript**, **CSS** and the **Canvas API**.

---

<a id="features"></a>
## ✨ Features

### 🧮 Basic Calculator
- addition, subtraction, multiplication and division
- percentage calculations
- decimal numbers
- delete and clear actions
- result formatting

### 🔬 Scientific Functions
- trigonometric functions: sin, cos, tan
- logarithmic functions: log, ln
- constants: π and e
- powers and roots
- absolute value
- exponential function
- modulo operation
- previous result usage with ANS

### 📊 Graphing Mode
- draw function graphs directly in the browser
- support for functions such as sin(x), cos(x), x^2 and log(x)
- zoom in, zoom out and reset view
- responsive canvas rendering
- separate colors for dark and light theme

### 🎨 Interface
- modern glassmorphism UI
- dark and light theme
- animated background
- responsive layout
- custom dropdown menus for scientific functions
- calculation history saved in localStorage
- keyboard input support

---

<a id="graphing-mode"></a>
## 📈 Graphing Mode

The application includes a graphing view where the user can enter a mathematical expression and draw its graph.

Example expressions:

```txt
sin(x)
cos(x)
tan(x)
x^2
x^3 - 3*x
sqrt(x)
log(x)
exp(x/4)
```

Graphing is implemented with the HTML Canvas API.  
The canvas is redrawn when the expression, zoom level or theme changes.  

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack
Area	Technology
Frontend	React
Build Tool	Vite
Language	JavaScript
Styling	CSS
Graph Rendering	HTML Canvas API
State Management	React Hooks
Storage	localStorage
Deployment	GitHub Pages
Platform	Web Browser

---

<a id="requirements"></a>

## ⚙️ Requirements

To run the project locally, you need:

Node.js
npm
modern web browser

---

<a id="getting-started"></a>

## 🚀 Getting Started
Clone the repository  
```
git clone https://github.com/Avuii/react-scientific-calculator.git
cd react-scientific-calculator
```
Install dependencies   
```
npm install
```
Run the development server
```
npm run dev
```
Build the project
```
npm run build
```
Preview the production build locally
```
npm run preview
```

---

<a id="project-structure"></a>

## 📁 Project Structure
```
react-scientific-calculator/
├── public/
├── src/
│   ├── components/
│   │   ├── CalcButton.jsx
│   │   ├── Calculator.jsx
│   │   ├── Display.jsx
│   │   ├── GraphPanel.jsx
│   │   ├── HistoryPanel.jsx
│   │   ├── ScienceToolbar.jsx
│   │   └── ThemeToggle.jsx
│   ├── hooks/
│   │   ├── useCalculator.js
│   │   ├── useKeyboard.js
│   │   └── useLocalStorage.js
│   ├── logic/
│   │   ├── calculator.js
│   │   └── constants.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

---

<a id="future-improvements"></a>

## 🚧 Future Improvements
add more scientific functions
add support for multiple graph lines
add graph panning with mouse drag
improve expression parser
add memory buttons
add more calculator themes
add unit conversion mode
add tests for calculator logic

---

## 👩‍💻 Author

Created by Katarzyna Stańczyk.
