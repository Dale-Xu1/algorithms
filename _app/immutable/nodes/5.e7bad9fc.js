var te=Object.defineProperty;var ee=(a,h,t)=>h in a?te(a,h,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[h]=t;var u=(a,h,t)=>(ee(a,typeof h!="symbol"?h+"":h,t),t);import{S as ie,i as se,s as he,a as k,k as b,q as E,J as le,h as p,c as _,l as v,m as w,r as M,n as m,b as nt,C as d,K as Vt,L as y,M as Zt,D as Qt,N as ne,o as re,O as ae,u as oe,w as de}from"../chunks/index.80ca1699.js";let ue=class{constructor(){u(this,"edges",[]);u(this,"enabled",!1)}addEdge(h){this.edges.push(h)}getEdge([h,t]){for(let e of this.edges){let[s,i]=e.node;if(h===s&&t===i)return e}return null}};class St{constructor(h,t,e){this.to=h,this.from=t,this.weight=e}}let st=class{constructor(h,t){u(this,"enabled",!1);this.node=h,this.weight=t}equal(h){return h===null?!1:this.enabled===h.enabled&&this.weight===h.weight}};const G="#000000",ht="#ff5050";class fe{constructor(h,t,e){u(this,"nodes",[]);u(this,"state",[]);this.width=h,this.height=t,this.lifetime=e,this.reset()}reset(){for(let h=0;h<this.width;h++){this.nodes[h]=[];for(let t=0;t<this.height;t++)this.nodes[h][t]=new ue}for(let h=0;h<2*this.width-1;h++){this.state[h]=[];for(let t=0;t<2*this.height-1;t++)this.state[h][t]=-1}for(let h=0;h<this.width;h++)for(let t=0;t<this.height;t++){if(h<this.width-1){let e=Math.random();this.nodes[h][t].addEdge(new st([h+1,t],e)),this.nodes[h+1][t].addEdge(new st([h,t],e))}if(t<this.height-1){let e=Math.random();this.nodes[h][t].addEdge(new st([h,t+1],e)),this.nodes[h][t+1].addEdge(new st([h,t],e))}}}empty(){for(let h=0;h<this.width;h++)for(let t=0;t<this.height;t++)this.nodes[h][t].enabled=!0,h<this.width-1&&this.enable([h,t],[h+1,t]),t<this.height-1&&this.enable([h,t],[h,t+1]);for(let h=0;h<2*this.width-1;h++){this.state[h]=[];for(let t=0;t<2*this.height-1;t++)this.state[h][t]=0}}enable([h,t],[e,s]){let i=this.nodes[h][t],l=this.nodes[e][s],n=i.getEdge([e,s]),r=l.getEdge([h,t]);i.enabled=l.enabled=!0,n!==null&&(n.enabled=!0),r!==null&&(r.enabled=!0)}disable([h,t],[e,s]){let i=this.nodes[h][t],l=this.nodes[e][s],n=i.getEdge([e,s]),r=l.getEdge([h,t]);n!==null&&(n.enabled=!1),r!==null&&(r.enabled=!1)}update(){for(let h=0;h<2*this.width-1;h++)for(let t=0;t<2*this.height-1;t++)this.state[h][t]>0&&this.state[h][t]--}render(h){let t=h.canvas.width,e=h.canvas.height,s=t/(2*this.width+1),i=e/(2*this.height+1);h.fillStyle=G,h.fillRect(0,0,t,i),h.fillRect(0,0,s,e),h.fillRect(0,e-i,t,i),h.fillRect(t-s,0,s,e),this.updateState();for(let l=0;l<this.width;l++)for(let n=0;n<this.height;n++){let r=2*l,o=2*n,g=this.nodes[l][n];if(!g.enabled){h.fillStyle=G,h.fillRect(r*s,o*i,s*3,i*3);continue}this.state[r][o]>0&&(h.fillStyle=ht,h.fillRect((r+1)*s,(o+1)*i,s,i));let c=g.getEdge([l+1,n]),D=g.getEdge([l,n+1]);if(c!==null&&this.nodes[l+1][n].enabled&&this.state[r+1][o]!==0&&(h.fillStyle=this.state[r+1][o]>0?ht:G,h.fillRect((r+2)*s,(o+1)*i,s,i)),D!==null&&this.nodes[l][n+1].enabled&&this.state[r][o+1]!==0&&(h.fillStyle=this.state[r][o+1]>0?ht:G,h.fillRect((r+1)*s,(o+2)*i,s,i)),c!==null&&D!==null&&this.state[r+1][o+1]!==0){let Q=this.nodes[l+1][n],j=this.nodes[l][n+1],W=this.nodes[l+1][n+1];if(!Q.enabled||!j.enabled||!W.enabled)continue;h.fillStyle=this.state[r+1][o+1]>0?ht:G,h.fillRect((r+2)*s,(o+2)*i,s,i)}}}unmark([h,t]){this.state[h][t]=-1}mark([h,t]){this.state[h][t]===-1&&(this.state[h][t]=this.lifetime)}updateState(){for(let h=0;h<this.width;h++)for(let t=0;t<this.height;t++){let e=2*h,s=2*t,i=this.nodes[h][t];i.enabled?this.mark([e,s]):this.unmark([e,s]);let l=i.getEdge([h+1,t]),n=i.getEdge([h,t+1]);if(l!==null&&(l.enabled?this.mark([e+1,s]):this.unmark([e+1,s])),n!==null&&(n.enabled?this.mark([e,s+1]):this.unmark([e,s+1])),l!==null&&n!==null){let r=this.nodes[h+1][t],o=this.nodes[h][t+1],g=r.getEdge([h+1,t+1]),c=o.getEdge([h+1,t+1]);l.enabled&&n.enabled&&g.enabled&&c.enabled?this.mark([e+1,s+1]):this.unmark([e+1,s+1])}}}validate(){for(let h=0;h<this.width;h++)for(let t=0;t<this.height;t++){let e=this.nodes[h][t],s=e.getEdge([h+1,t]),i=e.getEdge([h,t+1]),l=!0;if(s!==null&&l&&(l=s.equal(this.nodes[h+1][t].getEdge([h,t]))),i!==null&&l&&(l=i.equal(this.nodes[h][t+1].getEdge([h,t]))),!l)throw new Error("Graph is not undirected");if(!e.enabled){for(let n of e.edges)if(n.enabled)throw new Error("Invalid disabled node")}}}}class T{constructor(h){u(this,"finished",!1);this.maze=h}render(h){}}class Xt{constructor(){u(this,"heap",[])}push(h){this.heap.push(h),this.heapifyUp()}peek(){return this.heap[0]}pop(){if(this.heap.length<=1)return this.heap.pop()??null;let h=this.peek();return this.heap[0]=this.heap[this.heap.length-1],this.heap.pop(),this.heapifyDown(),h}heapifyUp(){let h=this.heap.length-1;for(;h>0;){let t=(h+1>>>1)-1;if(!this.comparator(this.heap[h],this.heap[t]))break;[this.heap[h],this.heap[t]]=[this.heap[t],this.heap[h]],h=t}}heapifyDown(){let h=0;for(;;){let t=(h<<1)+1,e=h+1<<1,s=h;if(t<this.heap.length&&this.comparator(this.heap[t],this.heap[s])&&(s=t),e<this.heap.length&&this.comparator(this.heap[e],this.heap[s])&&(s=e),s===h)break;[this.heap[h],this.heap[s]]=[this.heap[s],this.heap[h]],h=s}}}class ce extends T{constructor(t,e=.5){super(t);u(this,"generator");this.bias=e}*generate(){let t=this.maze;for(let e=0;e<t.width-1;e++)t.enable([e,0],[e+1,0]),yield;for(let e=1;e<t.height;e++){let s=0;for(let i=0;i<t.width;i++){if(Math.random()<this.bias||i>=t.width-1){let l=s+Math.floor(Math.random()*(i-s+1));s=i+1,t.enable([l,e],[l,e-1])}else t.enable([i,e],[i+1,e]);yield}}}init(){this.maze.reset(),this.generator=this.generate()}update(){this.generator.next().done&&(this.finished=!0)}toString(){return"Sidewinder"}}class ge extends T{constructor(t,e=.5){super(t);u(this,"generator");this.bias=e}*generate(){let t=this.maze;for(let e=0;e<t.height;e++)for(let s=0;s<t.width;s++)s===0&&e===0||(s===0?t.enable([s,e],[s,e-1]):e===0?t.enable([s,e],[s-1,e]):t.enable([s,e],Math.random()<this.bias?[s,e-1]:[s-1,e]),yield)}init(){this.maze.reset(),this.generator=this.generate()}update(){this.generator.next().done&&(this.finished=!0)}toString(){return"Binary Tree"}}class pe extends T{constructor(t){super(t);u(this,"visited",[]);u(this,"position");u(this,"stack",[])}init(){let t=this.maze;t.reset();for(let i=0;i<t.width;i++){this.visited[i]=[];for(let l=0;l<t.height;l++)this.visited[i][l]=!1}let e=Math.floor(Math.random()*t.width),s=Math.floor(Math.random()*t.height);this.visited[e][s]=!0,this.position=[e,s],this.stack.push(this.position)}update(){let t=this.maze,[e,s]=this.position,i=[];for(let o of t.nodes[e][s].edges){let[g,c]=o.node;this.visited[g][c]||i.push(o)}if(i.length===0)return this.stack.pop(),this.stack.length===0?void(this.finished=!0):(this.position=this.stack[this.stack.length-1],void this.update());let l=i[Math.floor(Math.random()*i.length)],[n,r]=this.position=l.node;this.visited[n][r]=!0,this.stack.push(this.position),t.enable([e,s],[n,r])}toString(){return"Depth First Search"}}class me extends T{constructor(t){super(t);u(this,"visited",[]);u(this,"active",[])}init(){let t=this.maze;t.reset();for(let i=0;i<t.width;i++){this.visited[i]=[];for(let l=0;l<t.height;l++)this.visited[i][l]=!1}let e=Math.floor(Math.random()*t.width),s=Math.floor(Math.random()*t.height);this.visited[e][s]=!0,this.updateActive(e,s)}update(){if(this.active.length===0)return void(this.finished=!0);let t=Math.floor(Math.random()*this.active.length),[e,s]=this.active[t];this.active.splice(t,1);let[i,l]=e;if(this.visited[i][l])return void this.update();this.visited[i][l]=!0,this.updateActive(i,l),this.maze.enable(e,s)}updateActive(t,e){for(let s of this.maze.nodes[t][e].edges){let[i,l]=s.node;this.visited[i][l]||this.active.push([s.node,[t,e]])}}toString(){return"Breadth First Search"}}class be extends T{constructor(t){super(t);u(this,"visited",[]);u(this,"position",[0,0]);u(this,"last",this.position)}init(){let t=this.maze;t.reset();for(let e=0;e<t.width;e++){this.visited[e]=[];for(let s=0;s<t.height;s++)this.visited[e][s]=!1}this.visited[0][0]=!0}update(){let t=this.maze,[e,s]=this.position,i=[];for(let o of t.nodes[e][s].edges){let[g,c]=o.node;this.visited[g][c]||i.push(o)}if(i.length===0){let o=this.find(this.last);return o===null?void(this.finished=!0):(this.position=this.last=o,void this.update())}let l=i[Math.floor(Math.random()*i.length)],[n,r]=this.position=l.node;this.visited[n][r]=!0,t.enable([e,s],[n,r])}find([t,e]){let s=this.maze;for(let i=e;i<s.height;i++)for(let l=i===e?t:0;l<s.width;l++)if(this.visited[l][i])for(let n of s.nodes[l][i].edges){let[r,o]=n.node;if(!this.visited[r][o])return[l,i]}return null}toString(){return"Hunt and Kill"}}let ve=class extends Xt{comparator(h,t){return h.weight<t.weight}};class Wt extends T{constructor(t){super(t);u(this,"mst",[]);u(this,"queue",new ve)}init(){let t=this.maze;t.reset();for(let i=0;i<t.width;i++){this.mst[i]=[];for(let l=0;l<t.height;l++)this.mst[i][l]=!1}let e=Math.floor(Math.random()*t.width),s=Math.floor(Math.random()*t.height);this.mst[e][s]=!0,this.updateActive(e,s)}update(){let t=this.queue.pop();if(t===null)return void(this.finished=!0);let[e,s]=t.to;if(this.mst[e][s])return void this.update();this.mst[e][s]=!0,this.updateActive(e,s),this.maze.enable(t.to,t.from)}updateActive(t,e){for(let s of this.maze.nodes[t][e].edges){let[i,l]=s.node;this.mst[i][l]||this.queue.push(new St(s.node,[t,e],s.weight))}}toString(){return"Prim"}}class we extends T{constructor(t){super(t);u(this,"parent",[]);u(this,"rank",[]);u(this,"queue",[])}init(){let t=this.maze;t.reset();for(let e=0;e<t.width;e++){this.parent[e]=[],this.rank[e]=[];for(let s=0;s<t.height;s++){this.parent[e][s]=[e,s],this.rank[e][s]=0;let i=t.nodes[e][s],l=i.getEdge([e+1,s]),n=i.getEdge([e,s+1]);l!==null&&this.queue.push(new St(l.node,[e,s],l.weight)),n!==null&&this.queue.push(new St(n.node,[e,s],n.weight))}}this.queue.sort((e,s)=>e.weight-s.weight)}update(){if(this.queue.length===0)return void(this.finished=!0);let t=this.queue.shift(),e=this.find(t.to),s=this.find(t.from),[i,l]=e,[n,r]=s;if(i===n&&l===r)return void this.update();this.union(e,s),this.maze.enable(t.to,t.from)}find([t,e]){let[s,i]=this.parent[t][e];return t===s&&e===i?[t,e]:this.parent[t][e]=this.find([s,i])}union([t,e],[s,i]){this.rank[t][e]<this.rank[s][i]?this.parent[t][e]=[s,i]:this.rank[t][e]>this.rank[s][i]?this.parent[s][i]=[t,e]:(this.parent[s][i]=[t,e],this.rank[t][e]++)}toString(){return"Kruskal"}}const Yt="#5050ff";class ke extends T{constructor(t){super(t);u(this,"visited",[]);u(this,"unvisited");u(this,"position")}init(){let t=this.maze;t.reset();for(let i=0;i<t.width;i++){this.visited[i]=[];for(let l=0;l<t.height;l++)this.visited[i][l]=!1}this.unvisited=t.width*t.height-1;let e=Math.floor(Math.random()*t.width),s=Math.floor(Math.random()*t.height);this.visited[e][s]=!0,this.position=[e,s]}update(){if(this.unvisited<=0)return void(this.finished=!0);let t=this.maze,[e,s]=this.position,i=t.nodes[e][s].edges,l=i[Math.floor(Math.random()*i.length)],[n,r]=this.position=l.node;this.visited[n][r]||(this.visited[n][r]=!0,this.unvisited--,t.enable([e,s],[n,r]))}render(t){if(this.finished)return;let e=this.maze,s=t.canvas.width/(2*e.width+1),i=t.canvas.height/(2*e.height+1),[l,n]=this.position;t.fillStyle=Yt,t.fillRect((2*l+1)*s,(2*n+1)*i,s,i)}toString(){return"Aldous-Broder"}}class _e extends T{constructor(t){super(t);u(this,"available",[]);u(this,"state",[]);u(this,"walk",[])}init(){let t=this.maze;t.reset();for(let i=0;i<t.width;i++){this.state[i]=[];for(let l=0;l<t.height;l++)this.state[i][l]=0,this.available.push([i,l])}let[e,s]=this.choose();this.state[e][s]=2,t.nodes[e][s].enabled=!0,this.reset()}update(){let t=this.maze,[e,s]=this.walk[this.walk.length-1],i=t.nodes[e][s].edges,l=i[Math.floor(Math.random()*i.length)],[n,r]=l.node;if(this.state[n][r]===1)this.removeLoop(l.node);else if(this.state[n][r]===2){for(let o=0;o<this.walk.length;o++){o<this.walk.length-1&&t.enable(this.walk[o],this.walk[o+1]);let[g,c]=this.walk[o];this.state[g][c]=2}t.enable(this.walk[this.walk.length-1],l.node),this.reset()}else this.walk.push(l.node),this.state[n][r]=1}reset(){let t=this.choose();if(t===null)return this.finished=!0,void(this.walk=[]);let[e,s]=t;if(this.state[e][s]===2)return void this.reset();this.walk=[t],this.state[e][s]=1}choose(){if(this.available.length===0)return null;let t=Math.floor(Math.random()*this.available.length),e=this.available[t];return this.available.splice(t,1),e}removeLoop([t,e]){let s=[];for(let i=this.walk.length-1;i>=0;i--){let[l,n]=this.walk[i];if(t===l&&e===n)break;this.walk.pop(),this.state[l][n]=0,s.push([l,n]),i===0&&console.log([t,e],s,this.state[t][e])}}render(t){if(this.walk.length<1)return;let e=this.maze,s=t.canvas.width/(2*e.width+1),i=t.canvas.height/(2*e.height+1);if(t.fillStyle=Yt,this.walk.length===1){let[l,n]=this.walk[0];t.fillRect((2*l+1)*s,(2*n+1)*i,s,i)}else for(let l=0;l<this.walk.length-1;l++){let[n,r]=this.walk[l],[o,g]=this.walk[l+1];n===o?t.fillRect((2*n+1)*s,(2*Math.min(r,g)+1)*i,s,3*i):r===g&&t.fillRect((2*Math.min(n,o)+1)*s,(2*r+1)*i,3*s,i)}}toString(){return"Wilson"}}class Ee extends T{constructor(t,e=.5,s=.5){super(t);u(this,"parent",[]);u(this,"rank",[]);u(this,"generator");this.a=e,this.b=s}reset(){for(let t=0;t<this.maze.width;t++)this.parent[t]=t,this.rank[t]=0}*generate(){let t=this.maze;this.reset();for(let e=0;e<t.height-1;e++){for(let i=0;i<t.width-1;i++){let l=this.find(i),n=this.find(i+1);l!==n&&Math.random()<this.a&&(this.union(l,n),t.enable([i,e],[i+1,e]),yield)}let s=Array.from({length:t.width},()=>[]);for(let i=0;i<t.width;i++)s[this.find(i)].push(i);this.reset();for(let i of s){if(i.length===0)continue;let l=[];for(let r of i)Math.random()<this.b&&l.push(r);l.length===0&&l.push(i[Math.floor(Math.random()*i.length)]);let n=Math.min(...l);for(let r of l)this.parent[r]=n,t.enable([r,e],[r,e+1]),yield}}for(let e=0;e<t.width-1;e++){let s=this.find(e),i=this.find(e+1);s!==i&&(this.union(s,i),t.enable([e,t.height-1],[e+1,t.height-1]),yield)}}find(t){let e=this.parent[t];return t===e?t:this.parent[t]=this.find(e)}union(t,e){this.rank[t]<this.rank[e]?this.parent[t]=e:this.rank[t]>this.rank[e]?this.parent[e]=t:(this.parent[e]=t,this.rank[t]++)}init(){this.maze.reset(),this.generator=this.generate()}update(){this.generator.next().done&&(this.finished=!0)}toString(){return"Eller"}}class Me extends T{constructor(t){super(t);u(this,"generator")}*generate(t,e,s,i){if(s<=1||i<=1)return;let l=this.maze,n;if(s<i?n=0:s>i?n=1:n=Math.random()<.5?0:1,n===0){let r=e+Math.floor(Math.random()*(i-1)),o=Math.floor(Math.random()*s);for(let c=0;c<s;c++)c!==o&&(l.disable([t+c,r],[t+c,r+1]),yield);let g=r-e+1;yield*this.generate(t,e,s,g),yield*this.generate(t,r+1,s,i-g)}else{let r=t+Math.floor(Math.random()*(s-1)),o=Math.floor(Math.random()*i);for(let c=0;c<i;c++)c!==o&&(l.disable([r,e+c],[r+1,e+c]),yield);let g=r-t+1;yield*this.generate(t,e,g,i),yield*this.generate(r+1,e,s-g,i)}}init(){this.maze.reset(),this.maze.empty(),this.generator=this.generate(0,0,this.maze.width,this.maze.height)}update(){this.generator.next().done&&(this.finished=!0)}toString(){return"Recursive Division"}}class ze extends T{constructor(t,e=1){super(t);u(this,"deadends",[]);this.probability=e}init(){let t=this.maze;for(let e=0;e<t.width;e++)for(let s=0;s<t.height;s++)this.countEnabled([e,s])===1&&this.deadends.push([e,s]);for(let e=0;e<this.deadends.length-1;e++){let s=e+Math.floor(Math.random()*(this.deadends.length-e));[this.deadends[e],this.deadends[s]]=[this.deadends[s],this.deadends[e]]}}update(){if(this.deadends.length===0)return void(this.finished=!0);let[t,e]=this.deadends.pop();if(Math.random()>this.probability||this.countEnabled([t,e])>1)return void this.update();let s=[],i=1/0;for(let n of this.maze.nodes[t][e].edges){if(n.enabled)continue;let r=this.countEnabled(n.node);r>i||r===0||(r<i&&(i=r,s=[]),s.push(n))}if(s.length===0)return void this.update();let l=s[Math.floor(Math.random()*s.length)];this.maze.enable([t,e],l.node)}countEnabled([t,e]){let s=0;for(let i of this.maze.nodes[t][e].edges)i.enabled&&s++;return s}toString(){return"Braid"}}class ye{constructor(h){u(this,"edges",[]);this.position=h}addEdge(h){this.edges.push(h)}getEdge(h){for(let t of this.edges)if(t.node===h)return t;return null}}class Se{constructor(h,t){this.node=h,this.weight=t}}class Ae{constructor(h){u(this,"nodes",[]);this.maze=h;for(let t=0;t<h.width;t++)for(let e=0;e<h.height;e++){if(!h.nodes[t][e].enabled)continue;let s=this.index([t,e]),i=this.nodes[s]=new ye([t,e]);for(let l of h.nodes[t][e].edges)l.enabled&&i.addEdge(new Se(this.index(l.node),1))}}index([h,t]){return t*this.maze.width+h}}class Te extends Xt{comparator([h,t],[e,s]){return t<s}}const je="#50ff50",Be="#5050ff",Ne="#ff5050";class $t extends T{constructor(t,e=[0,0],s=null){super(t);u(this,"start");u(this,"end");u(this,"graph");u(this,"queue",new Te);u(this,"set",[]);u(this,"startIndex");u(this,"endIndex");this.start=e,this.end=s??[t.width-1,t.height-1]}init(){this.graph=new Ae(this.maze);for(let e=0;e<this.graph.nodes.length;e++)this.set[e]=[e,1/0];let t=this.startIndex=this.graph.index(this.start);this.endIndex=this.graph.index(this.end),this.queue.push(this.set[t]=[t,0])}heuristic(t,e){return e}update(){let t=this.queue.pop();if(t===null)return void(this.finished=!0);let[e,s]=t;if(e===this.endIndex)return void(this.finished=!0);for(let i of this.graph.nodes[e].edges){let[,l]=this.set[i.node],n=this.graph.nodes[i.node].position,r=s+i.weight;r<l&&(this.set[i.node]=[e,r],this.queue.push([i.node,this.heuristic(n,r)]))}}render(t){let e=t.canvas.width/(2*this.maze.width+1),s=t.canvas.height/(2*this.maze.height+1);t.fillStyle=je;for(let l=0;l<this.set.length;l++){let[n]=this.set[l];n!==l&&this.renderEdge(t,l,n)}t.fillStyle=Be;for(let[l]of this.queue.heap){let[n,r]=this.graph.nodes[l].position;t.fillRect((2*n+1)*e,(2*r+1)*s,e,s)}if(!this.finished)return;t.fillStyle=Ne;let i=this.endIndex;for(;i!==this.startIndex;){let[l]=this.set[i];this.renderEdge(t,i,l),i=l}}renderEdge(t,e,s){let i=t.canvas.width/(2*this.maze.width+1),l=t.canvas.height/(2*this.maze.height+1),[n,r]=this.graph.nodes[e].position,[o,g]=this.graph.nodes[s].position;n===o?t.fillRect((2*n+1)*i,(2*Math.min(r,g)+1)*l,i,3*l):r===g&&t.fillRect((2*Math.min(n,o)+1)*i,(2*r+1)*l,3*i,l)}toString(){return"Dijkstra"}}class qe extends $t{heuristic([h,t],e){let[s,i]=this.end,l=Math.sqrt((h-s)**2+(t-i)**2);return e+l}toString(){return"A*"}}function Lt(a,h,t){const e=a.slice();return e[24]=h[t],e}function Gt(a){let h,t=a[2],e=[];for(let s=0;s<t.length;s+=1)e[s]=Jt(Lt(a,t,s));return{c(){h=b("div");for(let s=0;s<e.length;s+=1)e[s].c();this.h()},l(s){h=v(s,"DIV",{class:!0});var i=w(h);for(let l=0;l<e.length;l+=1)e[l].l(i);i.forEach(p),this.h()},h(){m(h,"class","queue svelte-1ruhymb")},m(s,i){nt(s,h,i);for(let l=0;l<e.length;l+=1)e[l]&&e[l].m(h,null)},p(s,i){if(i&4){t=s[2];let l;for(l=0;l<t.length;l+=1){const n=Lt(s,t,l);e[l]?e[l].p(n,i):(e[l]=Jt(n),e[l].c(),e[l].m(h,null))}for(;l<e.length;l+=1)e[l].d(1);e.length=t.length}},d(s){s&&p(h),ae(e,s)}}}function Jt(a){let h,t=a[24]+"",e;return{c(){h=b("span"),e=E(t),this.h()},l(s){h=v(s,"SPAN",{class:!0});var i=w(h);e=M(i,t),i.forEach(p),this.h()},h(){m(h,"class","svelte-1ruhymb")},m(s,i){nt(s,h,i),d(h,e)},p(s,i){i&4&&t!==(t=s[24]+"")&&oe(e,t)},d(s){s&&p(h)}}}function Re(a){let h,t,e,s,i,l,n,r,o,g,c,D,Q,j,W,J,B,Z,X,N,Y,$,q,tt,et,R,S,I,U,rt,at,O,ot,dt,x,ut,ft,P,ct,gt,C,pt,mt,F,bt,vt,K,wt,kt,H,_t,Et,V,Mt,zt,yt,At,z=a[2].length>0&&Gt(a);return{c(){h=k(),t=b("div"),e=b("canvas"),s=k(),i=b("div"),l=b("span"),n=E("Iterations/frame:"),r=k(),o=b("input"),g=k(),c=b("button"),D=E("Clear Queue"),Q=k(),j=b("button"),W=E("Prim"),J=k(),B=b("button"),Z=E("Kruskal"),X=k(),N=b("button"),Y=E("DFS"),$=k(),q=b("button"),tt=E("BFS"),et=k(),R=b("button"),S=E("Hunt and Kill"),I=k(),U=b("button"),rt=E("Eller"),at=k(),O=b("button"),ot=E("Aldous-Broder"),dt=k(),x=b("button"),ut=E("Wilson"),ft=k(),P=b("button"),ct=E("Recursive Division"),gt=k(),C=b("button"),pt=E("Binary Tree"),mt=k(),F=b("button"),bt=E("Sidewinder"),vt=k(),K=b("button"),wt=E("Braid"),kt=k(),H=b("button"),_t=E("Dijkstra"),Et=k(),V=b("button"),Mt=E("A*"),zt=k(),z&&z.c(),this.h()},l(A){le("svelte-1t3o4f4",document.head).forEach(p),h=_(A),t=v(A,"DIV",{class:!0});var it=w(t);e=v(it,"CANVAS",{class:!0}),w(e).forEach(p),s=_(it),i=v(it,"DIV",{class:!0});var f=w(i);l=v(f,"SPAN",{class:!0});var Tt=w(l);n=M(Tt,"Iterations/frame:"),Tt.forEach(p),r=_(f),o=v(f,"INPUT",{type:!0,class:!0}),g=_(f),c=v(f,"BUTTON",{class:!0});var jt=w(c);D=M(jt,"Clear Queue"),jt.forEach(p),Q=_(f),j=v(f,"BUTTON",{class:!0});var Bt=w(j);W=M(Bt,"Prim"),Bt.forEach(p),J=_(f),B=v(f,"BUTTON",{class:!0});var Nt=w(B);Z=M(Nt,"Kruskal"),Nt.forEach(p),X=_(f),N=v(f,"BUTTON",{class:!0});var qt=w(N);Y=M(qt,"DFS"),qt.forEach(p),$=_(f),q=v(f,"BUTTON",{class:!0});var Rt=w(q);tt=M(Rt,"BFS"),Rt.forEach(p),et=_(f),R=v(f,"BUTTON",{class:!0});var It=w(R);S=M(It,"Hunt and Kill"),It.forEach(p),I=_(f),U=v(f,"BUTTON",{class:!0});var Dt=w(U);rt=M(Dt,"Eller"),Dt.forEach(p),at=_(f),O=v(f,"BUTTON",{class:!0});var Ut=w(O);ot=M(Ut,"Aldous-Broder"),Ut.forEach(p),dt=_(f),x=v(f,"BUTTON",{class:!0});var Ot=w(x);ut=M(Ot,"Wilson"),Ot.forEach(p),ft=_(f),P=v(f,"BUTTON",{class:!0});var xt=w(P);ct=M(xt,"Recursive Division"),xt.forEach(p),gt=_(f),C=v(f,"BUTTON",{class:!0});var Pt=w(C);pt=M(Pt,"Binary Tree"),Pt.forEach(p),mt=_(f),F=v(f,"BUTTON",{class:!0});var Ct=w(F);bt=M(Ct,"Sidewinder"),Ct.forEach(p),vt=_(f),K=v(f,"BUTTON",{class:!0});var Ft=w(K);wt=M(Ft,"Braid"),Ft.forEach(p),kt=_(f),H=v(f,"BUTTON",{class:!0});var Kt=w(H);_t=M(Kt,"Dijkstra"),Kt.forEach(p),Et=_(f),V=v(f,"BUTTON",{class:!0});var Ht=w(V);Mt=M(Ht,"A*"),Ht.forEach(p),zt=_(f),z&&z.l(f),f.forEach(p),it.forEach(p),this.h()},h(){document.title="Maze Generation Algorithms",m(e,"class","svelte-1ruhymb"),m(l,"class","svelte-1ruhymb"),m(o,"type","number"),m(o,"class","svelte-1ruhymb"),m(c,"class","svelte-1ruhymb"),m(j,"class","svelte-1ruhymb"),m(B,"class","svelte-1ruhymb"),m(N,"class","svelte-1ruhymb"),m(q,"class","svelte-1ruhymb"),m(R,"class","svelte-1ruhymb"),m(U,"class","svelte-1ruhymb"),m(O,"class","svelte-1ruhymb"),m(x,"class","svelte-1ruhymb"),m(P,"class","svelte-1ruhymb"),m(C,"class","svelte-1ruhymb"),m(F,"class","svelte-1ruhymb"),m(K,"class","svelte-1ruhymb"),m(H,"class","svelte-1ruhymb"),m(V,"class","svelte-1ruhymb"),m(i,"class","controls svelte-1ruhymb"),m(t,"class","main svelte-1ruhymb")},m(A,L){nt(A,h,L),nt(A,t,L),d(t,e),a[4](e),d(t,s),d(t,i),d(i,l),d(l,n),d(i,r),d(i,o),Vt(o,a[3]),d(i,g),d(i,c),d(c,D),d(i,Q),d(i,j),d(j,W),d(i,J),d(i,B),d(B,Z),d(i,X),d(i,N),d(N,Y),d(i,$),d(i,q),d(q,tt),d(i,et),d(i,R),d(R,S),d(i,I),d(i,U),d(U,rt),d(i,at),d(i,O),d(O,ot),d(i,dt),d(i,x),d(x,ut),d(i,ft),d(i,P),d(P,ct),d(i,gt),d(i,C),d(C,pt),d(i,mt),d(i,F),d(F,bt),d(i,vt),d(i,K),d(K,wt),d(i,kt),d(i,H),d(H,_t),d(i,Et),d(i,V),d(V,Mt),d(i,zt),z&&z.m(i,null),yt||(At=[y(o,"input",a[5]),y(c,"click",a[6]),y(j,"click",a[7]),y(B,"click",a[8]),y(N,"click",a[9]),y(q,"click",a[10]),y(R,"click",a[11]),y(U,"click",a[12]),y(O,"click",a[13]),y(x,"click",a[14]),y(P,"click",a[15]),y(C,"click",a[16]),y(F,"click",a[17]),y(K,"click",a[18]),y(H,"click",a[19]),y(V,"click",a[20])],yt=!0)},p(A,[L]){L&8&&Zt(o.value)!==A[3]&&Vt(o,A[3]),A[2].length>0?z?z.p(A,L):(z=Gt(A),z.c(),z.m(i,null)):z&&(z.d(1),z=null)},i:Qt,o:Qt,d(A){A&&p(h),A&&p(t),a[4](null),z&&z.d(),yt=!1,ne(At)}}}const lt=10;function Ie(a,h,t){let e,s,i,l=[],n,r=5;re(()=>{s=e.getContext("2d");let S=Math.ceil(e.scrollWidth/lt),I=Math.ceil(e.scrollHeight/lt);S%2===0&&(S+=1),I%2===0&&(I+=1),t(0,e.width=S*lt,e),t(0,e.height=I*lt,e),t(1,i=new fe((S-1)/2,(I-1)/2,3)),n=new Wt(i),n.init(),requestAnimationFrame(o)});function o(){if(n.finished&&l.length>0&&(t(2,[n,...l]=l,l),n.init()),!n.finished){for(let S=0;S<r;S++)if(n.update(),n.finished){i.validate();break}}s.clearRect(0,0,e.width,e.height),i.render(s),i.update(),n.render(s),requestAnimationFrame(o)}function g(S){de[S?"unshift":"push"](()=>{e=S,t(0,e)})}function c(){r=Zt(this.value),t(3,r)}return[e,i,l,r,g,c,()=>t(2,l=[]),()=>t(2,l=[...l,new Wt(i)]),()=>t(2,l=[...l,new we(i)]),()=>t(2,l=[...l,new pe(i)]),()=>t(2,l=[...l,new me(i)]),()=>t(2,l=[...l,new be(i)]),()=>t(2,l=[...l,new Ee(i)]),()=>t(2,l=[...l,new ke(i)]),()=>t(2,l=[...l,new _e(i)]),()=>t(2,l=[...l,new Me(i)]),()=>t(2,l=[...l,new ge(i)]),()=>t(2,l=[...l,new ce(i)]),()=>t(2,l=[...l,new ze(i)]),()=>t(2,l=[...l,new $t(i)]),()=>t(2,l=[...l,new qe(i)])]}class Ce extends ie{constructor(h){super(),se(this,h,Ie,Re,he,{})}}export{Ce as component};