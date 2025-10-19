# 🌳 AVL Tree Visualizer

An interactive **AVL Tree visualizer** built using **HTML, CSS, JavaScript, and D3.js**.  
It demonstrates how AVL Trees (self-balancing Binary Search Trees) perform **insertions**, **deletions**, and **rotations** to maintain balance — with smooth animations and real-time height/balance updates.

🎮 **Live Demo:** [https://abhaya-shresthaa.github.io/dsaProject](https://abhaya-shresthaa.github.io/dsaProject)

---

## 📖 Overview

This project helps students and learners **visualize AVL Tree operations interactively**.  
You can insert or delete nodes, see balance factors, rotations (LL, RR, LR, RL), and control animation speed.

## 🚀 Features

- **Insert & Delete Nodes** — with smooth, step-by-step animations
- **Automatic Balancing** — shows LL, RR, LR, and RL rotations visually
- **Displays Node Heights & Balance Factors** beside each node
- **Traversal Path Highlighting** during operations
- **Adjustable Animation Speed** (1x–4x)
- **Timeline Navigation** — step forward or backward through tree states
- **In-Order Traversal Print** — displays sorted node values
- **Responsive & Minimal UI** built for clarity

---

## 🧠 Technologies Used

| Purpose | Technology |
|---------|------------|
| Structure | HTML5 |
| Styling | CSS3 |
| Logic | JavaScript (ES6) |
| Visualization | [D3.js v7](https://d3js.org) |

---

## 🛠️ Installation & Setup

### ▶️ Option 1 — View Online
Simply open the **[Live Demo](https://abhaya-shresthaa.github.io/dsaProject)** in your browser.

### 💻 Option 2 — Run Locally

1. **Clone or Download the repository:**
   ```bash
   git clone https://github.com/abhaya-shresthaa/dsaProject.git
   cd dsaProject



## Open in browser:

bash
    For most systems:
    open index.html

Or use a local server:
    python -m http.server 8000
    Then visit http://localhost:8000

## 🎮 How to Use

**Insert Nodes:**

Enter a value in the "Insert Value" box
Click "Insert" button
Watch the animation as the tree inserts and automatically balances

**Delete Nodes:**

Enter a value in the "Delete Value" box
Click "Delete" button
Observe deletion and rebalancing process

**Navigation Controls:**

⏪ Step Back / ⏩ Step Forward — navigate through previous tree states
Speed: 1x / 2x / 3x / 4x — adjust animation playback speed
Print In-Order — view sorted node values of the current tree

## ⚙️ Project Structure

text
📦 dsaProject
├── index.html        # Main UI and layout
├── style.css         # Styling for buttons, layout, and colors
└── visualizer.js     # Core AVL tree logic + D3.js animations

## 🔍 How It Works

## 🌿 AVL Tree Logic (visualizer.js)

- Implements standard AVL tree insertion and deletion algorithms in pure JavaScript
- Maintains height and balance factor for every node
- Performs the required LL, RR, LR, and RL rotations automatically after each operation
- After every change, recalculates node positions and updates the visualization

## 🎨 Visualization (D3.js)

Uses D3.js to dynamically draw an SVG tree diagram
Each node is represented as a circle with the value and balance info
Links (edges) are drawn using D3 line elements
Animations occur during insertion, deletion, and rotations
Smooth transitions highlight rebalancing visually, showing subtree rotations clearly

## 📈 Example Operations

Operation	Description
Insert 10 → 20 → 30	Triggers Right-Right (RR) rotation
Insert 30 → 20 → 10	Triggers Left-Left (LL) rotation
Insert 10 → 30 → 20	Triggers Right-Left (RL) rotation
Insert 30 → 10 → 20	Triggers Left-Right (LR) rotation

## 👤 Author

Abhaya Shresthaa
📎 GitHub: @abhaya-shresthaa
🌐 Live Demo: AVL Tree Visualizer

**✨ Thank you for exploring the AVL Tree Visualizer! ✨**
**Built using HTML, CSS, JavaScript, and D3.js.**