<script lang="ts">
import { base } from "$app/paths"
</script>

<svelte:head>
    <title>Algorithm Visualizations</title>
</svelte:head>
<div class="main">
    <h1>Algorithm Visualizations</h1>
    <a href="{base}/sorting">Sorting Algorithms</a>
    <a href="{base}/maze">Maze Generation Algorithms</a>
</div>
<style>
:global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
}

.main {
    display: flex;
    flex-direction: column;
    margin: 16px;
}

h1 {
    font-size: 28px;
    margin-bottom: 12px;
}

a {
    font-size: 14px;
    text-decoration: none;
    color: #53abf8;
    margin-bottom: 4px;
}

a:hover {
    text-decoration: underline;
}

</style>
