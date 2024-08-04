<script lang="ts">
import { onMount } from "svelte"

import Maze, { MazeProcess } from "../../lib/maze/Maze"

import { BinaryTree, BreadthFirstSearch, DepthFirstSearch, HuntAndKill, Sidewinder } from "../../lib/maze/SimpleAlgorithms"
import KruskalsAlgorithm from "../../lib/maze/KruskalsAlgorithm"
import PrimsAlgorithm from "../../lib/maze/PrimsAlgorithm"
import BraidMaze from "../../lib/maze/BraidMaze"

// TODO: Aldous-Broder, Wilson (render extension necessary)
// TODO: Recursive division (different reset routine)

const SIZE: number = 20

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

let maze: Maze
let queue: MazeProcess[] = []
let current: MazeProcess | null = null

let iterations: number = 5

onMount(() =>
{
    c = canvas.getContext("2d")!
    resize()

    let ratio = window.devicePixelRatio
    let width = Math.floor(canvas.width / ratio / SIZE), height = Math.floor(canvas.height / ratio / SIZE)

    maze = new Maze(width, height, 3)
    queue = [new PrimsAlgorithm(maze), new BraidMaze(maze)]

    requestAnimationFrame(loop)
})

function loop()
{
    if (current === null && queue.length > 0)
    {
        current = queue.shift()!
        current.init()
    }

    if (current !== null) for (let i = 0; i < iterations; i++)
    {
        current.update()
        if (current.finished)
        {
            maze.validate()
            current = null
            break
        }
    }

    c.clearRect(0, 0, canvas.width, canvas.height)
    maze.render(c)
    maze.update()

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
    <!-- <div class="controls"></div> -->
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

</style>
