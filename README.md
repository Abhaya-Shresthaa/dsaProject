AVL Tree Visualization - README

Overview

An interactive web-based visualization tool for AVL Trees (self-balancing Binary Search Trees) that demonstrates insertion, deletion, and balancing operations with smooth animations.

Features

Core Functionality

Insert Operations: Add nodes with automatic balancing
Delete Operations: Remove nodes with rebalancing
Real-time Visualization: Animated tree operations
Balance Tracking: Display height and balance factor for each node
Step Navigation: Move forward/backward through operation history
In-order Traversal: Display sorted values
Visual Features

Smooth Animations: Node movements and rotations
Color-coded States:

Red glow: Currently visited nodes
Yellow glow: Rotation pivot points
Orange: New nodes being inserted
Red: Unbalanced nodes
Arc-based Rotations: Circular motion during tree rotations
Floating Node Effects: Visual tracking of node movements
Interactive Controls

Speed Control: 1x, 2x, 3x, 4x animation speeds
Step Navigation: Browse through operation history
Real-time Input: Direct value insertion/deletion
Technical Implementation

Architecture

Frontend: Pure HTML, CSS, JavaScript with D3.js for visualization
Tree Logic: Custom AVL tree implementation with rotation handling
Animation System: Queue-based animation system with speed control
State Management: Snapshot system for undo/redo functionality
Key Components

AVL Tree Class

Complete AVL tree implementation with:

Insertion with automatic balancing
Deletion with rebalancing
Height and balance factor calculations
Four rotation cases (LL, LR, RR, RL)
Visualization Engine

D3.js Integration: SVG-based tree rendering
Dynamic Layout: Automatic tree positioning and spacing
Animation Pipeline: Smooth transitions between states
Collision Detection: Proper node placement without overlaps
Animation System

Queue-based Execution: Sequential animation processing
Speed Modulation: Adjustable animation durations
State Transitions: Smooth node movements and rotations
Visual Feedback: Highlighting and color changes
Usage Instructions

Basic Operations

Insert Node:

Enter a numeric value in the "Value to insert" field
Click "Insert" button
Watch the traversal and automatic balancing
Delete Node:

Enter a numeric value in the "Value to delete" field
Click "Delete" button
Observe deletion and rebalancing process
Navigation:

Use ⏪ Step Back and ⏩ Step Forward to browse history
Click "Print In-Order" to see sorted values
Animation Controls

Speed Buttons: Adjust animation speed (1x-4x)
Real-time Updates: Visual feedback during operations
Status Display: Current operation description
Technical Details

Tree Properties Displayed

Value: Node's numeric value
Height: Height of the subtree
Balance: Balance factor (left height - right height)
Balancing Operations

The visualizer demonstrates all four AVL rotation cases:

Left-Left (LL): Single right rotation
Left-Right (LR): Left then right rotation
Right-Right (RR): Single left rotation
Right-Left (RL): Right then left rotation
Performance Features

Efficient tree operations (O(log n) for insert/delete)
Optimized animations with minimal DOM operations
Memory-efficient snapshot system
Browser Compatibility

Modern browsers with ES6+ support
Chrome, Firefox, Safari, Edge
Mobile-responsive design
Project Structure

text
avl-tree-visualizer/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
└── visualizer.js       # Core AVL logic and visualization
Demo

Live demo available at: https://abhaya-shresthaa.github.io/dsaProject/

Educational Value

This tool is ideal for:

Computer science students learning data structures
Understanding AVL tree operations and balancing
Visualizing algorithm complexity and efficiency
Demonstrating self-balancing binary search trees