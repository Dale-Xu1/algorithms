<script lang="ts">
import { onMount } from "svelte"

import Maze, { MazeProcess } from "../../lib/maze/Maze"

import { BinaryTree, BreadthFirstSearch, DepthFirstSearch, HuntAndKill, Sidewinder } from "../../lib/maze/SimpleAlgorithms"
import KruskalsAlgorithm from "../../lib/maze/KruskalsAlgorithm"
import PrimsAlgorithm from "../../lib/maze/PrimsAlgorithm"
// TODO: Eller
// TODO: Aldous-Broder, Wilson (extension necessary)
// TODO: Recursive division (new rendering system necessary)

const SIZE: number = 10

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

let algorithms = [BinaryTree, Sidewinder, BreadthFirstSearch] // [PrimsAlgorithm, KruskalsAlgorithm]
let index: number = 0

let maze: Maze
let process: MazeProcess

onMount(() =>
{
    c = canvas.getContext("2d")!
    resize()

    let ratio = window.devicePixelRatio
    let width = Math.floor(canvas.width / ratio / SIZE), height = Math.floor(canvas.height / ratio / SIZE)

    maze = new Maze(width, height, 3)
    process = new algorithms[index](maze)
    process.init()

    requestAnimationFrame(loop)
})

function loop()
{
    requestAnimationFrame(loop)

    for (let i = 0; i < 20; i++)
    {
        process.update()
        if (process.finished)
        {
            maze.validateUndirected()
            maze.reset()

            if (++index >= algorithms.length) index = 0
            process = new algorithms[index](maze)
            process.init()

            break
        }
    }

    c.clearRect(0, 0, canvas.width, canvas.height)
    maze.render(c)
    maze.update()
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
    background-color: #000000;
}

</style>
