import Maze, { MazeProcess } from "./Maze"

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

class ActiveNode { public constructor(public readonly index: [number, number], public from: [number, number], public key: number) { } }
class NodeMinQueue extends PriorityQueue<ActiveNode>
{

    protected comparator(a: ActiveNode, b: ActiveNode): boolean { return a.key < b.key }

}

export default class PrimsAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly mst: boolean[][] = []
    private readonly queue: NodeMinQueue = new NodeMinQueue()

    public init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++)
        {
            this.mst[i] = []
            for (let j = 0; j < maze.height; j++) this.mst[i][j] = false
        }

        let i = Math.floor(Math.random() * maze.width), j = Math.floor(Math.random() * maze.height)

        this.mst[i][j] = true
        this.updateActive(i, j)
    }

    public update()
    {
        let min = this.queue.pop()
        if (min === null) return void (this.finished = true)

        let [i, j] = min.index
        if (this.mst[i][j]) return void this.update()

        this.mst[i][j] = true
        this.updateActive(i, j)
        this.maze.enable(min.index, min.from)
    }

    private updateActive(i: number, j: number)
    {
        for (let edge of this.maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.mst[k][l]) continue

            this.queue.push(new ActiveNode(edge.node, [i, j], edge.weight))
        }
    }

}