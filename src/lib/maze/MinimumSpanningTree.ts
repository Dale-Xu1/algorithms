import Maze, { ActiveEdge, MazeProcess } from "./Maze"

abstract class PriorityQueue<T>
{

    public readonly heap: T[] = []

    protected abstract comparator(a: T, b: T): boolean

    public push(value: T)
    {
        this.heap.push(value)
        this.heapifyUp()
    }

    public peek(): T { return this.heap[0] }
    public pop(): T | null
    {
        if (this.heap.length <= 1) return this.heap.pop() ?? null
        let value = this.peek()

        this.heap[0] = this.heap[this.heap.length - 1]
        this.heap.pop()
        this.heapifyDown()

        return value
    }

    private heapifyUp()
    {
        let node = this.heap.length - 1
        while (node > 0)
        {
            let parent = ((node + 1) >>> 1) - 1
            if (!this.comparator(this.heap[node], this.heap[parent])) break

            [this.heap[node], this.heap[parent]] = [this.heap[parent], this.heap[node]]
            node = parent
        }
    }

    private heapifyDown()
    {
        let node = 0
        while (true)
        {
            let left = (node << 1) + 1, right = (node + 1) << 1
            let child = node
            if (left < this.heap.length && this.comparator(this.heap[left], this.heap[child])) child = left
            if (right < this.heap.length && this.comparator(this.heap[right], this.heap[child])) child = right
            if (child === node) break

            [this.heap[node], this.heap[child]] = [this.heap[child], this.heap[node]]
            node = child
        }
    }

}

class NodeMinQueue extends PriorityQueue<ActiveEdge>
{

    protected override comparator(a: ActiveEdge, b: ActiveEdge): boolean { return a.weight < b.weight }

}

export class PrimsAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly mst: boolean[][] = []
    private readonly queue: NodeMinQueue = new NodeMinQueue()

    public override init()
    {
        let maze = this.maze
        maze.reset()

        for (let i = 0; i < maze.width; i++)
        {
            this.mst[i] = []
            for (let j = 0; j < maze.height; j++) this.mst[i][j] = false
        }

        let i = Math.floor(Math.random() * maze.width), j = Math.floor(Math.random() * maze.height)
        this.mst[i][j] = true
        this.updateActive(i, j)
    }

    public override update()
    {
        let min = this.queue.pop()
        if (min === null) return void (this.finished = true)

        let [i, j] = min.to
        if (this.mst[i][j]) return void this.update()

        this.mst[i][j] = true
        this.updateActive(i, j)
        this.maze.enable(min.to, min.from)
    }

    private updateActive(i: number, j: number)
    {
        for (let edge of this.maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.mst[k][l]) continue

            this.queue.push(new ActiveEdge(edge.node, [i, j], edge.weight))
        }
    }

}

export class KruskalsAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly parent: [number, number][][] = []
    private readonly rank: number[][] = []

    private readonly queue: ActiveEdge[] = []

    public override init()
    {
        let maze = this.maze
        maze.reset()

        for (let i = 0; i < maze.width; i++)
        {
            this.parent[i] = [], this.rank[i] = []
            for (let j = 0; j < maze.height; j++)
            {
                this.parent[i][j] = [i, j], this.rank[i][j] = 0

                let node = maze.nodes[i][j]
                let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])

                if (right !== null) this.queue.push(new ActiveEdge(right.node, [i, j], right.weight))
                if (down !== null) this.queue.push(new ActiveEdge(down.node, [i, j], down.weight))
            }
        }

        this.queue.sort((a, b) => a.weight - b.weight)
    }

    public override update()
    {
        if (this.queue.length === 0) return void (this.finished = true)
        let edge = this.queue.shift()!

        let u = this.find(edge.to), v = this.find(edge.from)
        let [i, j] = u, [k, l] = v
        if (i === k && j === l) return void this.update()

        this.union(u, v)
        this.maze.enable(edge.to, edge.from)
    }

    private find([i, j]: [number, number]): [number, number]
    {
        let [k, l] = this.parent[i][j]
        if (i === k && j === l) return [i, j]

        return this.parent[i][j] = this.find([k, l])
    }

    private union([i, j]: [number, number], [k, l]: [number, number])
    {
        if (this.rank[i][j] < this.rank[k][l]) this.parent[i][j] = [k, l]
        else if (this.rank[i][j] > this.rank[k][l]) this.parent[k][l] = [i, j]
        else
        {
            this.parent[k][l] = [i, j]
            this.rank[i][j]++
        }
    }

}
