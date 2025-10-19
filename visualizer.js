// visualizer.js - Fixed AVL balancing logic with Speed Controls

const svg = d3.select("#tree");
const width = +svg.attr("width");
const height = +svg.attr("height");
const centerX = width / 2;
const nodeRadius = 20;

let nodeIdCounter = 0;
let timeline = [];
let timelineIndex = -1;

// ---------------- Animation Speed Control ----------------
let animationSpeed = 1.0; // 1.0 = normal speed

function getAdjustedDuration(baseDuration) {
  return baseDuration / animationSpeed;
}

function updateSpeedButtons() {
  // Remove active class from all buttons
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to current speed button
  const activeButton = document.getElementById(`speed${animationSpeed}x`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

function setAnimationSpeed(speed) {
  animationSpeed = speed;
  updateSpeedButtons();
}

// ---------------- AVL data structures & algorithm (records path)
class VNode {
  constructor(value) {
    this.id = ++nodeIdCounter;
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.balance = 0;
    this._x = 0; this._y = 0;
    this._prevX = null; this._prevY = null;
  }
}

class AVL {
  constructor(){ this.root = null; }

  insert(value){
    const path = [];
    this.root = this._insert(this.root, value, path);
    this.updateHeightsAndBalances(this.root);
    return path;
  }

  _insert(node, value, path){
    if(!node){
      const n = new VNode(value);
      path.push({type:"create", node:n});
      return n;
    }
    path.push({type:"visit", node});
    if(value < node.value) {
      node.left = this._insert(node.left, value, path);
    } else if(value > node.value) {
      node.right = this._insert(node.right, value, path);
    } else {
      return node; // Duplicate values not allowed
    }
    
    // Update height and balance factor
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    node.balance = this._height(node.left) - this._height(node.right);
    
    return this._rebalance(node, path);
  }

  delete(value){
    const path = [];
    this.root = this._delete(this.root, value, path);
    if (this.root) {
      this.updateHeightsAndBalances(this.root);
    }
    return path;
  }

  _delete(node, value, path){
    if(!node) return null;
    
    path.push({type:"visit", node});
    
    if(value < node.value) {
      node.left = this._delete(node.left, value, path);
    } else if(value > node.value) {
      node.right = this._delete(node.right, value, path);
    } else {
      path.push({type:"delete", node});
      
      // Case 1: No child or one child
      if(!node.left) {
        return node.right;
      } else if(!node.right) {
        return node.left;
      }
      
      // Case 2: Two children - find inorder predecessor (largest in left subtree)
      // This gives better balance in AVL trees
      let pred = this._max(node.left);
      
      // Create a new node to replace the deleted one (so we get a new ID for visualization)
      const newNode = new VNode(pred.value);
      newNode.left = node.left;
      newNode.right = node.right;
      
      // Delete the predecessor from the left subtree
      newNode.left = this._delete(newNode.left, pred.value, path);
      
      path.push({type:"replace", replaced:node, with:newNode});
      node = newNode;
    }

    if (!node) return node;

    // Update height and balance factor
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    node.balance = this._height(node.left) - this._height(node.right);
    
    return this._rebalance(node, path);
  }

  _max(node){ 
    while(node && node.right) node = node.right; 
    return node; 
  }

  _min(node){ 
    while(node && node.left) node = node.left; 
    return node; 
  }

  _height(node) {
    return node ? node.height : 0;
  }

  updateHeightsAndBalances(node){
    if(!node) return 0;
    
    const leftHeight = this.updateHeightsAndBalances(node.left);
    const rightHeight = this.updateHeightsAndBalances(node.right);
    
    node.height = 1 + Math.max(leftHeight, rightHeight);
    node.balance = leftHeight - rightHeight;
    
    return node.height;
  }

  getBalance(node){ 
    if(!node) return 0;
    return this._height(node.left) - this._height(node.right);
  }

  _rebalance(node, path){
    if (!node) return node;
    
    const balance = node.balance;
    
    // Left Left Case
    if (balance > 1 && this.getBalance(node.left) >= 0) {
      path.push({type:"rotate", kind:"LL", pivot:node});
      return this._rightRotate(node);
    }
    
    // Left Right Case
    if (balance > 1 && this.getBalance(node.left) < 0) {
      path.push({type:"rotate", kind:"LR", pivot:node});
      node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    
    // Right Right Case
    if (balance < -1 && this.getBalance(node.right) <= 0) {
      path.push({type:"rotate", kind:"RR", pivot:node});
      return this._leftRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && this.getBalance(node.right) > 0) {
      path.push({type:"rotate", kind:"RL", pivot:node});
      node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }
    
    return node;
  }

  _rightRotate(y){
    const x = y.left;
    const T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;

    // Update balances
    y.balance = this.getBalance(y);
    x.balance = this.getBalance(x);

    return x;
  }

  _leftRotate(x){
    const y = x.right;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;

    // Update balances
    x.balance = this.getBalance(x);
    y.balance = this.getBalance(y);

    return y;
  }

  find(value){
    let cur = this.root;
    while(cur){
      if(value === cur.value) return cur;
      cur = value < cur.value ? cur.left : cur.right;
    }
    return null;
  }

  // Helper to check if tree is balanced
  isBalanced(node = this.root) {
    if (!node) return true;
    
    const balance = this.getBalance(node);
    if (Math.abs(balance) > 1) return false;
    
    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }
}

const avl = new AVL();

// ---------------- Animation queue ----------------
let animQueue = [];
let playing = false;
function enqueue(fn){ animQueue.push(fn); if(!playing) runQueue(); }
async function runQueue(){ playing=true; while(animQueue.length){ const fn=animQueue.shift(); try{ await fn(); }catch(e){ console.error(e);} } playing=false; }
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------------- Improved Tree Layout ----------------
function computePositions(root){
  if(!root) return {nodes:[], links:[]};
  
  const nodes = [];
  const links = [];
  const levelHeight = 80;
  const margin = 60;
  
  function calculateTreeInfo(node, level) {
    if (!node) return { width: 0, depth: level };
    
    const leftInfo = calculateTreeInfo(node.left, level + 1);
    const rightInfo = calculateTreeInfo(node.right, level + 1);
    
    return {
      width: 1 + leftInfo.width + rightInfo.width,
      depth: Math.max(level, leftInfo.depth, rightInfo.depth),
      left: leftInfo,
      right: rightInfo
    };
  }
  
  const treeInfo = calculateTreeInfo(root, 0);
  const maxDepth = treeInfo.depth;
  
  const availableWidth = width - 2 * margin;
  const baseSpacing = Math.min(120, availableWidth / Math.max(1, treeInfo.width));
  
  function positionNode(node, x, y, level, availableWidth, treeInfo) {
    if (!node) return;
    
    node._x = x;
    node._y = y;
    nodes.push({id: node.id, nodeRef: node, x: x, y: y});
    
    const childAvailableWidth = availableWidth * 0.8;
    const leftSpacing = treeInfo.left ? (treeInfo.left.width / treeInfo.width) * childAvailableWidth : 0;
    const rightSpacing = treeInfo.right ? (treeInfo.right.width / treeInfo.width) * childAvailableWidth : 0;
    
    if (node.left) {
      const leftX = x - leftSpacing / 2;
      const leftY = y + levelHeight;
      links.push({
        sourceId: node.id, targetId: node.left.id,
        source: {x: x, y: y}, target: {x: leftX, y: leftY}
      });
      positionNode(node.left, leftX, leftY, level + 1, leftSpacing, treeInfo.left);
    }
    
    if (node.right) {
      const rightX = x + rightSpacing / 2;
      const rightY = y + levelHeight;
      links.push({
        sourceId: node.id, targetId: node.right.id,
        source: {x: x, y: y}, target: {x: rightX, y: rightY}
      });
      positionNode(node.right, rightX, rightY, level + 1, rightSpacing, treeInfo.right);
    }
  }
  
  positionNode(root, centerX, 80, 0, availableWidth, treeInfo);
  
  return {nodes, links};
}

// Calculate the point on the circle's circumference given center and target
function getCircleEdgePoint(source, target, radius) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return source;
  
  const ratio = radius / distance;
  return {
    x: source.x + dx * ratio,
    y: source.y + dy * ratio
  };
}

// Calculate both start and end points for the edge
function getEdgePoints(source, target, radius) {
  const start = getCircleEdgePoint(source, target, radius);
  const end = getCircleEdgePoint(target, source, radius);
  return { start, end };
}

// straight line between nodes connecting to circle surfaces
function straightLine(s, t) {
  const edgePoints = getEdgePoints(s, t, nodeRadius);
  return `M ${edgePoints.start.x} ${edgePoints.start.y} L ${edgePoints.end.x} ${edgePoints.end.y}`;
}

// draw static skeleton quickly (no transitions)
function drawStatic(root){
  const {nodes, links} = computePositions(root);
  
  // links
  const linkSel = svg.selectAll("path.link").data(links, d => d.sourceId + "-" + d.targetId);
  linkSel.enter().append("path").attr("class", "link").attr("d", d => straightLine(d.source, d.target));
  linkSel.exit().remove();
  
  // nodes
  const nodeSel = svg.selectAll("g.node").data(nodes, d => d.id);
  const gEnter = nodeSel.enter().append("g").attr("class", "node").attr("transform", d => `translate(${d.x},${d.y})`);
  gEnter.append("circle").attr("r", nodeRadius);
  gEnter.append("text").attr("class", "value").attr("y", 4).attr("text-anchor", "middle").text(d => d.nodeRef.value);
  gEnter.append("text").attr("class", "meta").attr("x", 25).attr("y", -8).attr("text-anchor", "start")
    .text(d => `h:${d.nodeRef.height} b:${d.nodeRef.balance}`);
  nodeSel.exit().remove();
}

// animate whole tree to new positions (nodes and links)
function animateTreeTransition(baseDuration = 700, arcMap = null){
  const duration = getAdjustedDuration(baseDuration);
  return new Promise(resolve => {
    const {nodes, links} = computePositions(avl.root);

    // LINKS
    const linkSel = svg.selectAll("path.link").data(links, d => d.sourceId + "-" + d.targetId);
    const linkEnter = linkSel.enter().insert("path", "g").attr("class", "link")
      .attr("d", d => {
        const edgePoints = getEdgePoints(d.source, d.source, nodeRadius);
        return `M ${edgePoints.start.x} ${edgePoints.start.y} L ${edgePoints.end.x} ${edgePoints.end.y}`;
      });
    
    const mergedLinks = linkEnter.merge(linkSel);
    mergedLinks.transition().duration(duration).attrTween("d", function(d){
      const prev = this.__prev || d.source;
      const prevT = this.__prevT || d.target;
      
      const ix = d3.interpolateNumber(prev.x, d.source.x);
      const iy = d3.interpolateNumber(prev.y, d.source.y);
      const jx = d3.interpolateNumber(prevT.x, d.target.x);
      const jy = d3.interpolateNumber(prevT.y, d.target.y);
      
      return t => {
        const currentSource = {x: ix(t), y: iy(t)};
        const currentTarget = {x: jx(t), y: jy(t)};
        const edgePoints = getEdgePoints(currentSource, currentTarget, nodeRadius);
        return `M ${edgePoints.start.x} ${edgePoints.start.y} L ${edgePoints.end.x} ${edgePoints.end.y}`;
      };
    }).on("end", function(d){ 
      this.__prev = d.source; 
      this.__prevT = d.target; 
    });

    linkSel.exit().transition().duration(getAdjustedDuration(duration/2)).attr("opacity", 0).remove();

    // NODES
    const nodeSel = svg.selectAll("g.node").data(nodes, d => d.id);

    const nodeEnter = nodeSel.enter().append("g").attr("class", "node")
      .attr("transform", d => {
        const sx = d.nodeRef._prevX != null ? d.nodeRef._prevX : centerX;
        const sy = d.nodeRef._prevY != null ? d.nodeRef._prevY : height - 40;
        return `translate(${sx},${sy})`;
      })
      .style("opacity", 0);

    nodeEnter.append("circle").attr("r", nodeRadius);
    nodeEnter.append("text").attr("class","value").attr("y", 4).attr("text-anchor", "middle").text(d => d.nodeRef.value);
    nodeEnter.append("text").attr("class","meta").attr("x", 25).attr("y", -8).attr("text-anchor", "start")
      .text(d => `h:${d.nodeRef.height} b:${d.nodeRef.balance}`);

    const nodeUpdate = nodeEnter.merge(nodeSel);
    nodeUpdate.select("text.meta").text(d => `h:${d.nodeRef.height} b:${d.nodeRef.balance}`);
    
    nodeUpdate.transition().duration(duration).style("opacity", 1).attrTween("transform", function(d){
      const target = `translate(${d.x},${d.y})`;
      const from = this.__prevPos || {x: d.nodeRef._prevX != null ? d.nodeRef._prevX : centerX, y: d.nodeRef._prevY != null ? d.nodeRef._prevY : height-40};
      this.__prevPos = {x: d.x, y: d.y};
      
      if(arcMap && arcMap[d.id]){
        const arc = arcMap[d.id];
        const cx = arc.cx, cy = arc.cy;
        const fromA = Math.atan2(from.y - cy, from.x - cx);
        const toA = Math.atan2(d.y - cy, d.x - cx);
        const rFrom = Math.hypot(from.x - cx, from.y - cy);
        const rTo = Math.hypot(d.x - cx, d.y - cy);
        const interpR = d3.interpolateNumber(rFrom, rTo);
        const interpA = d3.interpolateNumber(fromA, toA);
        return t => {
          const a = interpA(t), r = interpR(t);
          const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
          return `translate(${x},${y})`;
        };
      } else {
        const ix = d3.interpolateNumber(from.x, d.x);
        const iy = d3.interpolateNumber(from.y, d.y);
        return t => `translate(${ix(t)},${iy(t)})`;
      }
    }).on("end", function(d){ d.nodeRef._prevX = d.x; d.nodeRef._prevY = d.y; });

    nodeSel.exit().transition().duration(getAdjustedDuration(duration/2)).style("opacity", 0).remove();

    setTimeout(resolve, duration + 10);
  });
}

// highlight node helper
async function highlightNode(nodeRef, cls="glow-red", ms=700){
  svg.selectAll("g.node").classed("glow-red", false);
  svg.selectAll("g.node").classed("glow-yellow", false);
  
  svg.selectAll("g.node").filter(d => d && d.id === nodeRef.id).classed(cls, true);
  await sleep(getAdjustedDuration(ms));
  svg.selectAll("g.node").filter(d => d && d.id === nodeRef.id).classed(cls, false);
}

// animate traversal: show floating node moving along path and gets attached directly
async function animateTraversalAndPlace(path, value){
  const fid = "float-" + Date.now();
  const startX = 30, startY = height - 30;
  
  // Create floating node (yellow color for traversal)
  svg.append("g").attr("id", fid).attr("transform", `translate(${startX},${startY})`)
    .append("circle").attr("r", 18).attr("fill", "orange");
  svg.select(`#${fid}`).append("text").attr("y",4).attr("text-anchor","middle").attr("fill","white").text(value);

  // move along visited nodes if any
  const visits = path.filter(p => p.type === "visit");
  for(let step of visits){
    const node = step.node;
    // recompute positions to ensure node has _x/_y
    computePositions(avl.root);
    const tx = node._x || centerX, ty = node._y || height - 60;
    // glow the node
    await highlightNode(node, "glow-red", getAdjustedDuration(450));
    // move floating a bit near node (above)
    await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(550)).attr("transform", `translate(${tx},${ty - 40})`).on("end", res));
    await sleep(getAdjustedDuration(120));
  }

  // Find the final position where the new node should be placed
  const created = path.slice().reverse().find(p => p.type === "create");
  if (!created) return;

  const targetNode = created.node;
  
  // Calculate the final position based on the parent node
  let finalX = centerX, finalY = 80;
  
  if (visits.length > 0) {
    const lastVisit = visits[visits.length - 1];
    const parentNode = lastVisit.node;
    
    // Determine if it should be left or right child
    if (value < parentNode.value) {
      // Position as left child
      finalX = parentNode._x - 60;
      finalY = parentNode._y + 80;
    } else {
      // Position as right child
      finalX = parentNode._x + 60;
      finalY = parentNode._y + 80;
    }
  }

  // Move directly to final position (no bottom center detour)
  await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(800)).attr("transform", `translate(${finalX},${finalY})`).on("end", res));
  
  // Change color from orange to blue when attached
  await new Promise(res => {
    svg.select(`#${fid} circle`)
      .transition().duration(getAdjustedDuration(400))
      .attr("fill", "#1976d2")
      .on("end", res);
  });
  
  // Remove floating and let the real node appear
  await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(300)).style("opacity",0).on("end", function(){ 
    svg.select(`#${fid}`).remove(); 
    res(); 
  }));
}

// create an arcMap for a rotation step
function buildArcMapForRotation(pivotNode){
  const pre = computePositions(avl.root);
  const affected = new Set();
  function collect(n){
    if(!n) return;
    affected.add(n.id);
    collect(n.left); collect(n.right);
  }
  collect(pivotNode);
  const arcMap = {};
  const cx = pivotNode._x || centerX;
  const cy = pivotNode._y || 80;
  affected.forEach(id => { arcMap[id] = {cx, cy}; });
  return arcMap;
}

// Find unbalanced nodes in the tree
function findUnbalancedNodes(node, unbalanced = []){
  if(!node) return unbalanced;
  if(Math.abs(node.balance) > 1){
    unbalanced.push(node);
  }
  findUnbalancedNodes(node.left, unbalanced);
  findUnbalancedNodes(node.right, unbalanced);
  return unbalanced;
}

// ---------------- Flows ----------------
async function insertFlow(value){
  const tempAvl = new AVL();
  function cloneTree(node){
    if(!node) return null;
    const n = new VNode(node.value);
    n.id = node.id;
    n.left = cloneTree(node.left);
    n.right = cloneTree(node.right);
    n.height = node.height;
    n.balance = node.balance;
    n._x = node._x;
    n._y = node._y;
    n._prevX = node._prevX;
    n._prevY = node._prevY;
    return n;
  }
  tempAvl.root = cloneTree(avl.root);
  
  const path = tempAvl.insert(value);
  
  // 1) Show traversal with floating node following path to final position
  enqueue(async () => {
    document.getElementById("steps").innerText = `Traversing to insert ${value}`;
    await animateTraversalAndPlace(path, value);
  });

  // 2) Immediately add the node to tree and show it
  enqueue(async () => {
    document.getElementById("steps").innerText = `Attaching node ${value} to tree`;
    avl.insert(value);
    drawStatic(avl.root);
    await animateTreeTransition(400);
  });

  // 3) Check for and highlight unbalanced nodes
  enqueue(async () => {
    const unbalanced = findUnbalancedNodes(avl.root);
    if(unbalanced.length > 0){
      document.getElementById("steps").innerText = `Found ${unbalanced.length} unbalanced node(s) - performing rotations`;
      for(const node of unbalanced){
        svg.selectAll("g.node").filter(d => d.id === node.id).classed("unbalanced", true);
      }
      await sleep(getAdjustedDuration(1000));
      for(const node of unbalanced){
        svg.selectAll("g.node").filter(d => d.id === node.id).classed("unbalanced", false);
      }
      await sleep(getAdjustedDuration(500));
    } else {
      document.getElementById("steps").innerText = `Tree is balanced after insertion`;
      await sleep(getAdjustedDuration(800));
    }
  });

  // Perform rotations if any were recorded
  for(const step of path){
    if(step.type === "rotate"){
      enqueue(async () => {
        document.getElementById("steps").innerText = `${step.kind} rotation at ${step.pivot.value}`;
        const arcMap = buildArcMapForRotation(step.pivot);
        await highlightNode(step.pivot, "glow-yellow", getAdjustedDuration(600));
        await animateTreeTransition(850, arcMap);
      });
    }
  }

  enqueue(async () => {
    document.getElementById("steps").innerText = `Insert ${value} complete. Tree ${avl.isBalanced() ? 'is balanced' : 'is NOT balanced'}`;
    await animateTreeTransition(300);
    snapshot();
  });
}

// Fixed deletion flow - properly handles root node deletion and replacement
async function deleteFlow(value){
  const nodeToDelete = avl.find(value);
  if (!nodeToDelete) {
    document.getElementById("steps").innerText = `Value ${value} not found in tree`;
    return;
  }

  document.getElementById("steps").innerText = `Starting deletion of ${value}`;
  
  svg.selectAll("g.node").classed("glow-red", false);
  svg.selectAll("g.node").classed("glow-yellow", false);

  // Store the node to be deleted for animation
  const nodeToDeletePos = {
    x: nodeToDelete._x || centerX, 
    y: nodeToDelete._y || height/2,
    id: nodeToDelete.id,
    value: nodeToDelete.value
  };

  // Perform deletion and get the path
  const path = avl.delete(value);
  
  // 1) traversal highlight to node to delete
  enqueue(async () => {
    document.getElementById("steps").innerText = `Traversing to delete ${value}`;
    const visits = path.filter(p => p.type === "visit");
    for(const p of visits){
      await highlightNode(p.node, "glow-red", getAdjustedDuration(450));
    }
  });

  // 2) Show deletion animation
  enqueue(async () => {
    document.getElementById("steps").innerText = `Removing node ${value}`;
    
    // Check if this is a replacement case (node with two children)
    const replaceStep = path.find(p => p.type === "replace");
    
    if (replaceStep) {
      // This is a node with two children being replaced
      const oldNode = replaceStep.replaced;
      const newNode = replaceStep.with;
      
      // Highlight both nodes involved in replacement
      await highlightNode(oldNode, "glow-yellow", getAdjustedDuration(800));
      
      document.getElementById("steps").innerText = `Replacing ${oldNode.value} with ${newNode.value}`;
      
      // Create floating node for the replacement value
      const fid = "floatreplace-" + Date.now();
      svg.append("g").attr("id", fid).attr("transform", `translate(${nodeToDeletePos.x},${nodeToDeletePos.y})`)
        .append("circle").attr("r", 18).attr("fill", "green");
      svg.select(`#${fid}`).append("text").attr("y",4).attr("text-anchor","middle").attr("fill","white").text(newNode.value);

      // Update the tree structure
      drawStatic(avl.root);
      await animateTreeTransition(600);
      
      // Remove floating node
      await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(300)).style("opacity",0).on("end", function(){ 
        svg.select(`#${fid}`).remove(); 
        res(); 
      }));
      
    } else {
      // This is a leaf or single child node deletion
      // Create floating node at the node's position
      const fid = "floatdel-" + Date.now();
      svg.append("g").attr("id", fid).attr("transform", `translate(${nodeToDeletePos.x},${nodeToDeletePos.y})`)
        .append("circle").attr("r", 18).attr("fill", "tomato");
      svg.select(`#${fid}`).append("text").attr("y",4).attr("text-anchor","middle").attr("fill","white").text(value);

      // Hide the actual node being deleted
      await new Promise(res => {
        svg.selectAll("g.node").filter(d => d && d.id === nodeToDeletePos.id)
          .transition().duration(getAdjustedDuration(200)).style("opacity", 0).on("end", res);
      });

      // Update the tree structure
      drawStatic(avl.root);
      await animateTreeTransition(400);

      // Animate the deleted node shrinking to corner
      const targetX = 30, targetY = height - 30;
      await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(800)).attrTween("transform", function(){
        const ix = d3.interpolateNumber(nodeToDeletePos.x, targetX);
        const iy = d3.interpolateNumber(nodeToDeletePos.y, targetY);
        return t => `translate(${ix(t)},${iy(t)})`;
      }).on("end", res));
      
      // Fade out and remove the floating node
      await new Promise(res => svg.select(`#${fid}`).transition().duration(getAdjustedDuration(300)).style("opacity",0).on("end", function(){ 
        svg.select(`#${fid}`).remove(); 
        res(); 
      }));
    }

    // Final tree update
    drawStatic(avl.root);
    await animateTreeTransition(400);
  });

  // 3) Check for and highlight unbalanced nodes after deletion
  enqueue(async () => {
    const unbalanced = findUnbalancedNodes(avl.root);
    if(unbalanced.length > 0){
      document.getElementById("steps").innerText = `Found ${unbalanced.length} unbalanced node(s) after deletion - performing rotations`;
      for(const node of unbalanced){
        svg.selectAll("g.node").filter(d => d.id === node.id).classed("unbalanced", true);
      }
      await sleep(getAdjustedDuration(1000));
      for(const node of unbalanced){
        svg.selectAll("g.node").filter(d => d.id === node.id).classed("unbalanced", false);
      }
      await sleep(getAdjustedDuration(500));
    }
  });

  // 4) Animate rewire (rotations recorded in path) - highlight pivots & animate
  for(const step of path){
    if(step.type === "rotate"){
      enqueue(async () => {
        document.getElementById("steps").innerText = `${step.kind} rotation at ${step.pivot.value}`;
        const arcMap = buildArcMapForRotation(step.pivot);
        await highlightNode(step.pivot, "glow-yellow", getAdjustedDuration(500));
        await animateTreeTransition(800, arcMap);
      });
    }
  }

  // 5) final settle and snapshot
  enqueue(async () => {
    document.getElementById("steps").innerText = `Deletion ${value} complete. Tree ${avl.isBalanced() ? 'is balanced' : 'is NOT balanced'}`;
    await animateTreeTransition(400);
    snapshot();
  });
}

// ---------------- Snapshots ----------------
function snapshot(){
  function serialize(n){
    if(!n) return null;
    return {id: n.id, value: n.value, left: serialize(n.left), right: serialize(n.right)};
  }
  const s = serialize(avl.root);
  timeline = timeline.slice(0, timelineIndex + 1);
  timeline.push(s);
  timelineIndex = timeline.length - 1;
}

async function renderSnapshot(index){
  function build(obj){
    if(!obj) return null;
    const n = new VNode(obj.value);
    n.id = obj.id;
    n.left = build(obj.left);
    n.right = build(obj.right);
    return n;
  }
  avl.root = build(timeline[index]);
  avl.updateHeightsAndBalances(avl.root);
  document.getElementById("steps").innerText = `Snapshot ${index+1}/${timeline.length}`;
  drawStatic(avl.root);
  await animateTreeTransition(400);
}

// ---------------- Print In-Order Traversal ----------------
function printInOrder() {
  const output = document.getElementById("printOutput");
  const values = [];
  
  function inOrderTraversal(node) {
    if (!node) return;
    inOrderTraversal(node.left);
    values.push(node.value);
    inOrderTraversal(node.right);
  }
  
  inOrderTraversal(avl.root);
  
  if (values.length === 0) {
    output.innerHTML = "Tree is empty";
  } else {
    output.innerHTML = `In-order traversal: [${values.join(', ')}]`;
  }
}

// ----------------- UI wiring -----------------
document.getElementById("insertBtn").addEventListener("click", () => {
  const v = parseInt(document.getElementById("insertValue").value);
  if(Number.isNaN(v)) return;
  insertFlow(v);
});
document.getElementById("deleteBtn").addEventListener("click", () => {
  const v = parseInt(document.getElementById("deleteValue").value);
  if(Number.isNaN(v)) return;
  deleteFlow(v);
});
document.getElementById("stepBack").addEventListener("click", async () => {
  if(timelineIndex > 0){
    timelineIndex--;
    await renderSnapshot(timelineIndex);
  }
});
document.getElementById("stepFwd").addEventListener("click", async () => {
  if(timelineIndex < timeline.length - 1){
    timelineIndex++;
    await renderSnapshot(timelineIndex);
  }
});
document.getElementById("printBtn").addEventListener("click", () => {
  printInOrder();
});

// Speed control event listeners
document.getElementById("speed1x").addEventListener("click", () => setAnimationSpeed(1));
document.getElementById("speed2x").addEventListener("click", () => setAnimationSpeed(2));
document.getElementById("speed3x").addEventListener("click", () => setAnimationSpeed(3));
document.getElementById("speed4x").addEventListener("click", () => setAnimationSpeed(4));

// initial empty snapshot & draw
snapshot();
drawStatic(avl.root);
animateTreeTransition(1);
updateSpeedButtons(); // Set initial active button