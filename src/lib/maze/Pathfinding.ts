import Maze, { MazeProcess, PriorityQueue } from "./Maze"

export class Node
{

    public readonly edges: Edge[] = []

    public constructor(public readonly position: [number, number]) { }

    public addEdge(edge: Edge) { this.edges.push(edge) }
    public getEdge(i: number): Edge | null
    {
        for (let edge of this.edges) if (edge.node === i) return edge
        return null
    }

}

export class Edge
{

    public constructor(public readonly node: number, public readonly weight: number) { }

}

export default class Graph
{

    public readonly nodes: Node[] = []

    public constructor(private readonly maze: Maze)
    {
        for (let i = 0; i < maze.width; i++) for (let j = 0; j < maze.height; j++)
        {
            if (!maze.nodes[i][j].enabled) continue

            let n = this.index([i, j])
            let node = this.nodes[n] = new Node([i, j])

            for (let edge of maze.nodes[i][j].edges) if (edge.enabled) node.addEdge(new Edge(this.index(edge.node), 1))
        }
    }

    public index([i, j]: [number, number]): number { return j * this.maze.width + i }

}

class NodeMinQueue extends PriorityQueue<[number, number]>
{

    protected override comparator([i, d1]: [number, number], [j, d2]: [number, number]): boolean { return d1 < d2 }

}

export class DijkstrasAlgorithm extends MazeProcess
{

    public readonly start: [number, number]
    public readonly end: [number, number]

    public constructor(maze: Maze, start: [number, number] = [0, 0], end: [number, number] | null = null)
    {
        super(maze)

        this.start = start
        this.end = end ?? [maze.width - 1, maze.height - 1]
    }


    private graph!: Graph

    private queue: NodeMinQueue = new NodeMinQueue()
    private set: [number, number][] = [[0, 0]]

    public override init()
    {
        this.graph = new Graph(this.maze)
        for (let i = 0; i < this.graph.nodes.length; i++) this.set[i] = [i, Infinity]

        let index = this.graph.index(this.start)
        this.queue.push(this.set[index] = [index, 0])
    }

    protected heuristic(position: [number, number], weight: number): number { return weight }
    public override update()
    {
        let node = this.queue.pop()
        if (node === null) return void (this.finished = true)

        let [i, d1] = node
        if (i === this.graph.index(this.end)) return void (this.finished = true)

        for (let edge of this.graph.nodes[i].edges)
        {
            let [_, d2] = this.set[edge.node]
            let position = this.graph.nodes[edge.node].position

            let weight = d1 + edge.weight
            if (weight < d2)
            {
                this.set[edge.node] = [i, weight]
                this.queue.push([edge.node, this.heuristic(position, weight)])
            }
        }
    }

    public override render(c: CanvasRenderingContext2D)
    {
        c.fillStyle = "#00ff00"
        for (let n = 0; n < this.set.length; n++)
        {
            let [from, _] = this.set[n]
            if (from !== n) this.renderEdge(c, n, from)
        }

        if (!this.finished) return
        c.fillStyle = "#ff0000"

        let n = this.graph.index(this.end)
        while (n !== this.graph.index(this.start))
        {
            let [from, _] = this.set[n]
            this.renderEdge(c, n, from)

            n = from
        }
    }

    private renderEdge(c: CanvasRenderingContext2D, n: number, m: number)
    {
        let w = c.canvas.width / (2 * this.maze.width + 1), h = c.canvas.height / (2 * this.maze.height + 1)

        let [i, j] = this.graph.nodes[n].position
        let [k, l] = this.graph.nodes[m].position

        if (i === k) c.fillRect((2 * i + 1) * w, (2 * Math.min(j, l) + 1) * h, w, 3 * h)
        else if (j === l) c.fillRect((2 * Math.min(i, k) + 1) * w, (2 * j + 1) * h, 3 * w, h)
    }

}

export class AStarAlgorithm extends DijkstrasAlgorithm
{

    public override heuristic([i, j]: [number, number], weight: number): number
    {
        let [k, l] = this.end
        let distance = Math.sqrt((i - k) ** 2 + (j - l) ** 2)

        return weight + distance
    }

}
