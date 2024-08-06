<script lang="ts">
import { onMount } from "svelte"

import Maze, { MazeProcess } from "../../lib/maze/Maze"

import { SidewinderAlgorithm, BinaryTreeAlgorithm } from "../../lib/maze/SimpleAlgorithms"
import { DepthFirstSearch, BreadthFirstSearch, HuntAndKill } from "../../lib/maze/TreeTraversal"
import { PrimsAlgorithm, KruskalsAlgorithm } from "../../lib/maze/MinimumSpanningTree"
import { AldousBroderAlgorithm, WilsonsAlgorithm } from "../../lib/maze/UniformSpanningTree"
import EllersAlgorithm from "../../lib/maze/EllersAlgorithm"
import { RecursiveDivision } from "$lib/maze/RecursiveDivision"

import BraidMaze from "../../lib/maze/BraidMaze"
import { DijkstrasAlgorithm, AStarAlgorithm } from "../../lib/maze/Pathfinding"

const SIZE: number = 20

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

let maze: Maze
let queue: MazeProcess[] = []
let current: MazeProcess

let iterations: number = 5

onMount(() =>
{
    c = canvas.getContext("2d")!
    resize()

    let ratio = window.devicePixelRatio
    let width = Math.floor(canvas.width / ratio / SIZE), height = Math.floor(canvas.height / ratio / SIZE)

    maze = new Maze(width, height, 3)
    queue = []

    current = new PrimsAlgorithm(maze)
    current.init()

    requestAnimationFrame(loop)
})

function loop()
{
    if (current.finished && queue.length > 0)
    {
        current = queue.shift()!
        current.init()
    }

    if (!current.finished) for (let i = 0; i < iterations; i++)
    {
        current.update()
        if (current.finished)
        {
            maze.validate()
            break
        }
    }

    c.clearRect(0, 0, canvas.width, canvas.height)
    maze.render(c)
    maze.update()
    current.render(c)

    requestAnimationFrame(loop)
}

function resize()
{
    let ratio = window.devicePixelRatio
    canvas.width = canvas.scrollWidth * ratio
    canvas.height = canvas.scrollHeight * ratio
}

</script>

<svelte:head>
    <title>Maze Generation Algorithms</title>
</svelte:head>
<svelte:window on:resize={resize} />
<div class="main">
    <canvas bind:this={canvas}></canvas>
    <div class="controls">
        <span>Iterations/frame:</span>
        <input type="number" bind:value={iterations}>
        <button on:click={() => queue.push(new PrimsAlgorithm(maze))}>Prim</button>
        <button on:click={() => queue.push(new KruskalsAlgorithm(maze))}>Kruskal</button>
        <button on:click={() => queue.push(new DepthFirstSearch(maze))}>DFS</button>
        <button on:click={() => queue.push(new BreadthFirstSearch(maze))}>BFS</button>
        <button on:click={() => queue.push(new HuntAndKill(maze))}>Hunt and Kill</button>
        <button on:click={() => queue.push(new EllersAlgorithm(maze))}>Eller</button>
        <button on:click={() => queue.push(new AldousBroderAlgorithm(maze))}>Aldous-Broder</button>
        <button on:click={() => queue.push(new WilsonsAlgorithm(maze))}>Wilson</button>
        <button on:click={() => queue.push(new RecursiveDivision(maze))}>Recursive Division</button>
        <button on:click={() => queue.push(new BinaryTreeAlgorithm(maze))}>Binary Tree</button>
        <button on:click={() => queue.push(new SidewinderAlgorithm(maze))}>Sidewinder</button>
        <button on:click={() => queue.push(new BraidMaze(maze))}>Braid</button>
        <button on:click={() => queue.push(new DijkstrasAlgorithm(maze))}>Dijkstra</button>
        <button on:click={() => queue.push(new AStarAlgorithm(maze))}>A*</button>
    </div>
</div>
<style>
:global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

:global(body) {
    overflow: hidden;
}

.main {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

canvas {
    width: 100%;
    flex-grow: 1;
    background-color: #ffffff;
}

.controls {
    padding: 4px 12px;
    border-top: 1px solid #a0a0a0
}

span {
    font-size: 14px;
}

input, button {
    margin: 4px;
    padding: 2px;
    border: 1px solid #a0a0a0;
    border-radius: 0;
}

input {
    width: 80px;
    margin-right: 12px;
}

button {
    cursor: pointer;
}

button:hover {
    background-color: #dddddd;
}

</style>
