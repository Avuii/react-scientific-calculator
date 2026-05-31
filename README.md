# 🧮 React Scientific Calculator

<p align="center">
  <strong>Modern scientific calculator web app with interactive graphing, memory operations and unit conversion.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=111827" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-Core-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111827" />
  <img src="https://img.shields.io/badge/Canvas-Graphs-9F7AEA?style=for-the-badge" />
  <img src="https://img.shields.io/badge/CSS-Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Pages-Deployed-222222?style=for-the-badge&logo=githubpages&logoColor=white" />
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
- [Unit Converter](#unit-converter)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

<a id="overview"></a>

## 📌 Overview

**React Scientific Calculator** is a modern web application for performing basic, scientific and graph-based calculations.

The project includes a glassmorphism-inspired responsive interface, dark and light mode, calculation history, memory operations, keyboard support, unit conversion and an interactive graphing mode for visualizing mathematical functions.

The application was created to practice building a structured React project with **Vite**, **JavaScript**, **CSS**, **React Hooks**, **localStorage** and the **HTML Canvas API**.

---

<a id="features"></a>

## ✨ Features

### 🧮 Basic Calculator

- addition, subtraction, multiplication and division
- percentage calculations
- decimal numbers
- delete and clear actions
- result formatting
- keyboard input support
- calculation history saved in localStorage

### 🧠 Memory Operations

- MC — clear memory
- MR — recall memory
- M+ — add current result to memory
- M- — subtract current result from memory
- memory value saved in localStorage

### 🔬 Scientific Functions

- trigonometric functions: sin, cos, tan
- additional trigonometric functions: sec, csc, cot
- inverse trigonometric functions: asin, acos, atan
- hyperbolic functions: sinh, cosh, tanh
- logarithmic functions: log, ln
- constants: π and e
- powers and roots
- factorial
- absolute value
- exponential function
- floor, ceil and round
- random number function
- modulo operation
- previous result usage with ANS

### 📊 Graphing Mode

- draw function graphs directly in the browser
- support for multiple functions at the same time
- add and remove function rows
- edit each function expression separately
- choose graph color per function
- change line thickness per function
- use function presets
- zoom in and zoom out with buttons
- zoom with mouse wheel
- pan the graph by dragging
- display cursor coordinates
- reset graph view
- manually set X/Y axis range
- responsive canvas rendering
- separate graph colors for dark and light theme

### 🔁 Unit Converter

- convert length units
- convert mass units
- convert temperature units
- convert time units
- convert data units
- convert speed units
- swap source and target units
- custom styled dropdowns
- responsive converter layout

### 🎨 Interface

- modern glassmorphism UI
- dark and light theme
- animated background
- responsive layout
- custom dropdown menus
- clean scientific calculator layout
- premium-style buttons and cards

---

<a id="graphing-mode"></a>

## 📈 Graphing Mode

The graphing mode allows the user to create and compare multiple function graphs.

Each function row includes:

- function label, such as f1(x), f2(x), f3(x)
- editable expression input
- preset selector
- color picker
- line thickness control
- add or delete function controls

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

The graph is rendered with the **HTML Canvas API**.  
The canvas updates when the function list, axis range, zoom level, theme or cursor position changes.

Interactive graph controls:

```txt
Drag mouse      -> pan graph
Mouse wheel     -> zoom graph
Reset button    -> reset graph view
X/Y range input -> manually set graph window
Cursor move     -> show graph coordinates
```

---

<a id="unit-converter"></a>

## 🔁 Unit Converter

The application includes a separate converter mode for common unit conversions.

Supported categories:

```txt
Length
Mass
Temperature
Time
Data
Speed
```

The converter allows selecting source and target units, entering a numeric value and swapping units with one button.

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | JavaScript |
| Styling | CSS |
| Graph Rendering | HTML Canvas API |
| State Management | React Hooks |
| Storage | localStorage |
| Deployment | GitHub Pages |
| Platform | Web Browser |

---

<a id="requirements"></a>

## ⚙️ Requirements

To run the project locally, you need:

- Node.js
- npm
- modern web browser

---

<a id="getting-started"></a>

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/Avuii/react-scientific-calculator.git
cd react-scientific-calculator
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Build the project

```bash
npm run build
```

5. Preview the production build locally

```bash
npm run preview
```

---

<a id="project-structure"></a>

## 📁 Project Structure

```txt
react-scientific-calculator/
├── public/
├── src/
│   ├── components/
│   │   ├── CalcButton.jsx
│   │   ├── Calculator.jsx
│   │   ├── ConverterPanel.jsx
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

- add better error messages for invalid expressions
- add support for saving graph presets
- add graph export as image
- add more calculator themes
- add unit tests for calculator logic
- improve accessibility for keyboard and screen reader users

---

<a id="author"></a>

## 👩‍💻 Author

Created by Katarzyna Stańczyk.
