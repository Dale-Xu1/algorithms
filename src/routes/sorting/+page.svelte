<script lang="ts">
import { onMount } from "svelte"

import Graph, { GraphProcess, Shuffle } from "../../lib/sorting/Graph"
import { BubbleSort, InsertionSort, SelectionSort, ShellSort } from "../../lib/sorting/SimpleAlgorithms"
import { QuickSortLL, QuickSortLR } from "../../lib/sorting/QuickSort"
import MergeSort from "../../lib/sorting/MergeSort"
import HeapSort from "../../lib/sorting/HeapSort"
import TimSort from "../../lib/sorting/TimSort"
import BitonicSort from "../../lib/sorting/BitonicSort"
import { RadixSortLSD, RadixSortMSD } from "../../lib/sorting/RadixSort"

let canvas: HTMLCanvasElement
let c: CanvasRenderingContext2D

let graph: Graph = new Graph(1000, 1)
let queue: GraphProcess[] = []
let current: GraphProcess | null = null

let iterations: number = 10

onMount(() =>
{
    c = canvas.getContext("2d")!

    resize()
    requestAnimationFrame(loop)
})

function loop()
{
    requestAnimationFrame(loop)
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
            // if (!(current instanceof Shuffle)) graph.validate()
            current = null
            break
        }
    }

    c.clearRect(0, 0, canvas.width, canvas.height)
    graph.render(c)
}

function resize()
{
    let ratio = window.devicePixelRatio
    canvas.width = canvas.scrollWidth * ratio
    canvas.height = canvas.scrollHeight * ratio
}

</script>

<svelte:head>
    <title>Sorting Algorithms</title>
</svelte:head>
<svelte:window on:resize={resize} />
<div class="main">
    <canvas bind:this={canvas}></canvas>
    <div class="controls">
        <span>Iterations/frame:</span>
        <input type="number" bind:value={iterations}>
        <button on:click={() => queue.push(new Shuffle(graph))}>Shuffle</button>
        <button on:click={() => queue.push(new BubbleSort(graph))}>Bubble</button>
        <button on:click={() => queue.push(new InsertionSort(graph))}>Insertion</button>
        <button on:click={() => queue.push(new SelectionSort(graph))}>Selection</button>
        <button on:click={() => queue.push(new ShellSort(graph))}>Shell</button>
        <button on:click={() => queue.push(new QuickSortLL(graph))}>Quick (LL)</button>
        <button on:click={() => queue.push(new QuickSortLR(graph))}>Quick (LR)</button>
        <button on:click={() => queue.push(new MergeSort(graph))}>Merge</button>
        <button on:click={() => queue.push(new HeapSort(graph))}>Heap</button>
        <button on:click={() => queue.push(new TimSort(graph))}>Tim</button>
        <button on:click={() => queue.push(new BitonicSort(graph))}>Bitonic</button>
        <button on:click={() => queue.push(new RadixSortLSD(graph))}>Radix (LSD)</button>
        <button on:click={() => queue.push(new RadixSortMSD(graph))}>Radix (MSD)</button>
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
    background-color: #000000;
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
