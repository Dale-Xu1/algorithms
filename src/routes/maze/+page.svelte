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

const SIZE: number = 10

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

let maze: Maze
let queue: MazeProcess[] = []
let current: MazeProcess

let iterations: number = 5

onMount(() =>
{
    c = canvas.getContext("2d")!

    let width = Math.ceil(canvas.scrollWidth / SIZE), height = Math.ceil(canvas.scrollHeight / SIZE)
    if (width % 2 === 0) width += 1
    if (height % 2 === 0) height += 1

    canvas.width = width * SIZE
    canvas.height = height * SIZE

    maze = new Maze((width - 1) / 2, (height - 1) / 2, 3)
    current = new PrimsAlgorithm(maze)
    current.init()

    requestAnimationFrame(loop)
})

function loop()
{
    if (current.finished && queue.length > 0)
    {
        [current, ...queue] = queue
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

// TODO: Display queue in HTML
</script>

<svelte:head>
    <title>Maze Generation Algorithms</title>
</svelte:head>
<div class="main">
    <canvas bind:this={canvas}></canvas>
    <div class="controls">
        <span>Iterations/frame:</span>
        <input type="number" bind:value={iterations}>
        <button on:click={() => queue = []}>Clear Queue</button>
        <button on:click={() => queue = [...queue, new PrimsAlgorithm(maze)]}>Prim</button>
        <button on:click={() => queue = [...queue, new KruskalsAlgorithm(maze)]}>Kruskal</button>
        <button on:click={() => queue = [...queue, new DepthFirstSearch(maze)]}>DFS</button>
        <button on:click={() => queue = [...queue, new BreadthFirstSearch(maze)]}>BFS</button>
        <button on:click={() => queue = [...queue, new HuntAndKill(maze)]}>Hunt and Kill</button>
        <button on:click={() => queue = [...queue, new EllersAlgorithm(maze)]}>Eller</button>
        <button on:click={() => queue = [...queue, new AldousBroderAlgorithm(maze)]}>Aldous-Broder</button>
        <button on:click={() => queue = [...queue, new WilsonsAlgorithm(maze)]}>Wilson</button>
        <button on:click={() => queue = [...queue, new RecursiveDivision(maze)]}>Recursive Division</button>
        <button on:click={() => queue = [...queue, new BinaryTreeAlgorithm(maze)]}>Binary Tree</button>
        <button on:click={() => queue = [...queue, new SidewinderAlgorithm(maze)]}>Sidewinder</button>
        <button on:click={() => queue = [...queue, new BraidMaze(maze)]}>Braid</button>
        <button on:click={() => queue = [...queue, new DijkstrasAlgorithm(maze)]}>Dijkstra</button>
        <button on:click={() => queue = [...queue, new AStarAlgorithm(maze)]}>A*</button>
        {#if queue.length > 0}
            <div class="queue">
                {#each queue as process}
                    <span>{process}</span>
                {/each}
            </div>
        {/if}
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
    height: 0;
    flex-grow: 1;
    background-color: #ffffff;
    image-rendering: pixelated;
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

.queue {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    max-height: 75vh;
    padding: 4px 8px;
    background-color: #ffffff99;
    overflow-y: scroll;
}

.queue::-webkit-scrollbar {
    display: none;
}

.queue span {
    margin: 2px;
    font-size: 12px;
}

</style>
