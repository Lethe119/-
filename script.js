/* script.js */

// ================= 導航邏輯 =================
function switchTab(tabId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.menu li').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    // 對應選單高亮
    const map = { 'arrays':0, 'stacks':1, 'linkedlists':2, 'trees':3, 'graphs':4 };
    document.querySelectorAll('.menu li')[map[tabId]].classList.add('active');
}

// ================= 測驗邏輯 =================
function checkAnswer(btn, isCorrect) {
    const parent = btn.parentElement;
    const explanation = parent.nextElementSibling;
    
    // 停用所有按鈕防止重複點擊
    const allBtns = parent.querySelectorAll('button');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct');
        btn.innerHTML += ' ✅';
    } else {
        btn.classList.add('wrong');
        btn.innerHTML += ' ❌';
        // 自動標示正確答案
        allBtns.forEach(b => {
            if(b.onclick.toString().includes('true')) {
                b.classList.add('correct');
            }
        });
    }
    // 顯示解析
    explanation.style.display = 'block';
}

// ================= 1. Array Visuals =================
let arrayData = [10, 20, 30, 40, 50];

function renderArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    arrayData.forEach((val, idx) => {
        const div = document.createElement('div');
        div.className = 'array-cell';
        div.id = `arr-${idx}`;
        div.innerHTML = `${val}<small>${idx}</small>`;
        container.appendChild(div);
    });
}

async function insertArrayAt() {
    const val = parseInt(document.getElementById('arr-val').value);
    const idx = parseInt(document.getElementById('arr-idx').value);
    
    if (idx < 0 || idx > arrayData.length) { alert("索引錯誤"); return; }

    // 視覺化位移效果
    for (let i = arrayData.length - 1; i >= idx; i--) {
        const cell = document.getElementById(`arr-${i}`);
        if(cell) {
            cell.classList.add('shifting');
            cell.style.backgroundColor = '#ffeeba'; // 視覺提示
        }
    }
    await new Promise(r => setTimeout(r, 500)); // 等待動畫

    arrayData.splice(idx, 0, val);
    renderArray();
    
    // 高亮新元素
    const newCell = document.getElementById(`arr-${idx}`);
    if (newCell) {
        newCell.classList.add('highlight');
        setTimeout(() => newCell.classList.remove('highlight'), 1000);
    }
}

function deleteArrayAt() {
    const idx = parseInt(document.getElementById('arr-idx').value);
    if(idx >= 0 && idx < arrayData.length) {
        arrayData.splice(idx, 1);
        renderArray();
    }
}
renderArray();

// ================= 2. Stack & Queue =================
let stack = [];
function renderStack() {
    const con = document.getElementById('stack-visual');
    con.innerHTML = '';
    stack.forEach(v => {
        const div = document.createElement('div');
        div.className = 'stack-box';
        div.textContent = v;
        con.appendChild(div);
    });
}
function pushStack() { if(stack.length<5) { stack.push(Math.floor(Math.random()*99)); renderStack(); } else alert("Stack滿了"); }
function popStack() { if(stack.length>0) { stack.pop(); renderStack(); } else alert("Stack空了"); }

// Circular Queue
const QMAX = 8;
let qArr = new Array(QMAX).fill(null);
let front = 0, rear = 0, qSize = 0;

function renderQueue() {
    const grid = document.getElementById('queue-grid');
    grid.innerHTML = '';
    for(let i=0; i<QMAX; i++) {
        const d = document.createElement('div');
        d.className = 'q-cell';
        if(qArr[i] !== null) {
            d.textContent = qArr[i];
            d.style.background = '#d1ecf1';
            d.style.color = '#0c5460';
            d.style.fontWeight = 'bold';
        } else {
            d.textContent = i;
            d.style.color = '#ccc';
        }
        
        // 標記 Front/Rear
        if(qSize > 0) {
            if(i === front) d.style.border = "2px solid #2ecc71";
            let actualRear = (rear - 1 + QMAX) % QMAX;
            if(i === actualRear) d.style.border = "2px solid #e74c3c";
        }
        grid.appendChild(d);
    }
    document.getElementById('q-front').textContent = front;
    document.getElementById('q-rear').textContent = rear;
}

function enqueue() {
    if(qSize === QMAX) { alert("Queue滿了"); return; }
    qArr[rear] = Math.floor(Math.random()*99);
    rear = (rear + 1) % QMAX;
    qSize++;
    renderQueue();
}
function dequeue() {
    if(qSize === 0) { alert("Queue空了"); return; }
    qArr[front] = null;
    front = (front + 1) % QMAX;
    qSize--;
    renderQueue();
}
renderQueue();

// ================= 3. Linked List =================
let ll = ['Head', 'A', 'B'];
function renderLL() {
    const c = document.getElementById('ll-visual');
    c.innerHTML = '';
    ll.forEach((v, i) => {
        const n = document.createElement('div');
        n.className = 'll-node';
        n.innerHTML = `<div class="ll-data">${v}</div>`;
        if(i < ll.length-1) n.innerHTML += `<div class="ll-arrow"></div>`;
        else n.innerHTML += `<span style="margin-left:5px; color:#888;">➔ NULL</span>`;
        c.appendChild(n);
    });
}
function addToHead() { ll.unshift(document.getElementById('ll-val').value); renderLL(); }
function addToTail() { ll.push(document.getElementById('ll-val').value); renderLL(); }
function removeHead() { ll.shift(); renderLL(); }
renderLL();

// ================= 4. BST Canvas =================
class Node { constructor(v){ this.v = v; this.l = null; this.r = null; this.x=0; this.y=0; } }
let root = null;

function addTreeNode() {
    const v = parseInt(document.getElementById('tree-val').value);
    if(isNaN(v)) return;
    if(!root) root = new Node(v); else insertNode(root, v);
    drawTree();
}
function insertNode(n, v) {
    if(v < n.v) { if(!n.l) n.l = new Node(v); else insertNode(n.l, v); }
    else { if(!n.r) n.r = new Node(v); else insertNode(n.r, v); }
}
function resetTree() { root = null; drawTree(); }

function drawTree() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,800,400);
    if(root) { pos(root, 400, 40, 200); render(root, ctx); }
}
function pos(n, x, y, off) {
    if(!n) return;
    n.x = x; n.y = y;
    pos(n.l, x-off, y+60, off/1.8);
    pos(n.r, x+off, y+60, off/1.8);
}
function render(n, ctx) {
    if(!n) return;
    if(n.l) line(ctx, n, n.l);
    if(n.r) line(ctx, n, n.r);
    
    ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, 2*Math.PI);
    ctx.fillStyle = '#3498db'; ctx.fill();
    ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.textBaseline='middle';
    ctx.fillText(n.v, n.x, n.y);
    
    render(n.l, ctx); render(n.r, ctx);
}
function line(ctx, a, b) {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
}

// ================= 5. Graph Canvas =================
let gNodes = [], gEdges = [], sel = null;
const gCan = document.getElementById('graphCanvas');
if(gCan) {
    const ctx = gCan.getContext('2d');
    gCan.addEventListener('mousedown', e => {
        const rect = gCan.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const click = gNodes.find(n => Math.hypot(n.x-x, n.y-y) < 20);
        
        if(click) {
            if(sel && sel !== click) { gEdges.push({a:sel, b:click}); sel=null; }
            else sel = click;
        } else {
            gNodes.push({x,y,id:gNodes.length}); sel = null;
        }
        drawGraph(ctx);
    });
}
function drawGraph(ctx) {
    if (!ctx) return;
    ctx.clearRect(0,0,800,400);
    gEdges.forEach(e => {
        ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });
    gNodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, 15, 0, 2*Math.PI);
        ctx.fillStyle = (n===sel)? '#f1c40f':'#2c3e50'; ctx.fill();
        ctx.fillStyle = 'white'; ctx.fillText(n.id, n.x, n.y);
    });
}
function clearGraph() { gNodes=[]; gEdges=[]; sel=null; drawGraph(gCan.getContext('2d')); }