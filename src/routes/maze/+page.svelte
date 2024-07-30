<script lang="ts">
import { onMount } from "svelte"

import Maze from "../../lib/maze/Maze"

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

const SIZE: number = 20
let maze: Maze

onMount(() =>
{
    c = canvas.getContext("2d")!
    resize()

    let ratio = window.devicePixelRatio
    let width = Math.floor(canvas.width / ratio / SIZE), height = Math.floor(canvas.height / ratio / SIZE)

    maze = new Maze(width, height)
    requestAnimationFrame(loop)
})

function loop()
{
    requestAnimationFrame(loop)

    c.clearRect(0, 0, canvas.width, canvas.height)
    maze.render(c)
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
