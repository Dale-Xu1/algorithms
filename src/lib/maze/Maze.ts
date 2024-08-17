export class Node
{

    public readonly edges: Edge[] = []
    public enabled: boolean = false

    public addEdge(edge: Edge) { this.edges.push(edge) }
    public getEdge([i, j]: [number, number]): Edge | null
    {
        for (let edge of this.edges)
        {
            let [k, l] = edge.node
            if (i === k && j === l) return edge
        }

        return null
    }

}

export class ActiveEdge { public constructor(public readonly to: [number, number], public readonly from: [number, number], public readonly weight: number) { } }
export class Edge
{

    public enabled: boolean = false

    public constructor(public readonly node: [number, number], public readonly weight: number) { }

    public equal(edge: Edge | null): boolean
    {
        if (edge === null) return false
        return this.enabled === edge.enabled && this.weight === edge.weight
    }

}

const enum State { WALL = -1, EMPTY = 0 }
const WALL  : string = "#000000"
const ACTIVE: string = "#ff5050"

export default class Maze
{

    public readonly nodes: Node[][] = []
    private readonly state: State[][] = []

    public constructor(public readonly width: number, public readonly height: number, private readonly lifetime: number) { this.reset() }
    public reset()
    {
        for (let i = 0; i < this.width; i++)
        {
            this.nodes[i] = []
            for (let j = 0; j < this.height; j++) this.nodes[i][j] = new Node()
        }

        for (let i = 0; i < 2 * this.width - 1; i++)
        {
            this.state[i] = []
            for (let j = 0; j < 2 * this.height - 1; j++) this.state[i][j] = State.WALL
        }

        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            if (i < this.width - 1)
            {
                let weight = Math.random()
                this.nodes[i][j].addEdge(new Edge([i + 1, j], weight))
                this.nodes[i + 1][j].addEdge(new Edge([i, j], weight))
            }
            if (j < this.height - 1)
            {
                let weight = Math.random()
                this.nodes[i][j].addEdge(new Edge([i, j + 1], weight))
                this.nodes[i][j + 1].addEdge(new Edge([i, j], weight))
            }
        }
    }

    public empty()
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            this.nodes[i][j].enabled = true
            if (i < this.width - 1) this.enable([i, j], [i + 1, j])
            if (j < this.height - 1) this.enable([i, j], [i, j + 1])
        }

        for (let i = 0; i < 2 * this.width - 1; i++)
        {
            this.state[i] = []
            for (let j = 0; j < 2 * this.height - 1; j++) this.state[i][j] = State.EMPTY
        }
    }

    public enable([i, j]: [number, number], [k, l]: [number, number])
    {
        let m = this.nodes[i][j], n = this.nodes[k][l]
        let a = m.getEdge([k, l]), b = n.getEdge([i, j])

        m.enabled = n.enabled = true
        if (a !== null) a.enabled = true
        if (b !== null) b.enabled = true
    }

    public disable([i, j]: [number, number], [k, l]: [number, number])
    {
        let m = this.nodes[i][j], n = this.nodes[k][l]
        let a = m.getEdge([k, l]), b = n.getEdge([i, j])

        if (a !== null) a.enabled = false
        if (b !== null) b.enabled = false
    }

    public update()
    {
        for (let i = 0; i < 2 * this.width - 1; i++) for (let j = 0; j < 2 * this.height - 1; j++)
        {
            if (this.state[i][j] > State.EMPTY) this.state[i][j]--
        }
    }

    public render(c: CanvasRenderingContext2D)
    {
        let width = c.canvas.width, height = c.canvas.height
        let w = width / (2 * this.width + 1), h = height / (2 * this.height + 1)

        c.fillStyle = WALL
        c.fillRect(0, 0, width, h)
        c.fillRect(0, 0, w, height)
        c.fillRect(0, height - h, width, h)
        c.fillRect(width - w, 0, w, height)

        this.updateState()
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let u = 2 * i, v = 2 * j
            let node = this.nodes[i][j]

            if (!node.enabled)
            {
                c.fillStyle = WALL, c.fillRect(u * w, v * h, w * 3, h * 3)
                continue
            }
            if (this.state[u][v] > State.EMPTY) c.fillStyle = ACTIVE, c.fillRect((u + 1) * w, (v + 1) * h, w, h)

            let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])
            if (right !== null && this.nodes[i + 1][j].enabled && this.state[u + 1][v] !== State.EMPTY)
            {
                c.fillStyle = this.state[u + 1][v] > State.EMPTY ? ACTIVE : WALL
                c.fillRect((u + 2) * w, (v + 1) * h, w, h)
            }
            if (down !== null && this.nodes[i][j + 1].enabled && this.state[u][v + 1] !== State.EMPTY)
            {
                c.fillStyle = this.state[u][v + 1] > State.EMPTY ? ACTIVE : WALL
                c.fillRect((u + 1) * w, (v + 2) * h, w, h)
            }

            if (right !== null && down !== null && this.state[u + 1][v + 1] !== 0)
            {
                let n1 = this.nodes[i + 1][j], n2 = this.nodes[i][j + 1], n3 = this.nodes[i + 1][j + 1]
                if (!n1.enabled || !n2.enabled || !n3.enabled) continue

                c.fillStyle = this.state[u + 1][v + 1] > State.EMPTY ? ACTIVE : WALL
                c.fillRect((u + 2) * w, (v + 2) * h, w, h)
            }
        }
    }

    private unmark([i, j]: [number, number]) { this.state[i][j] = State.WALL }
    private mark([i, j]: [number, number]) { if (this.state[i][j] === State.WALL) this.state[i][j] = this.lifetime }

    private updateState()
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let u = 2 * i, v = 2 * j
            let n1 = this.nodes[i][j]

            if (n1.enabled) this.mark([u, v])
            else this.unmark([u, v])

            let e1 = n1.getEdge([i + 1, j]), e2 = n1.getEdge([i, j + 1])
            if (e1 !== null)
            {
                if (e1.enabled) this.mark([u + 1, v])
                else this.unmark([u + 1, v])
            }
            if (e2 !== null)
            {
                if (e2.enabled) this.mark([u, v + 1])
                else this.unmark([u, v + 1])
            }

            if (e1 !== null && e2 !== null)
            {
                let n2 = this.nodes[i + 1][j], n3 = this.nodes[i][j + 1]
                let e3 = n2.getEdge([i + 1, j + 1])!, e4 = n3.getEdge([i + 1, j + 1])!

                if (e1.enabled && e2.enabled && e3.enabled && e4.enabled) this.mark([u + 1, v + 1])
                else this.unmark([u + 1, v + 1])
            }
        }
    }

    public validate()
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let node = this.nodes[i][j]
            let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])

            let result = true
            if (right !== null) result &&= right.equal(this.nodes[i + 1][j].getEdge([i, j]))
            if (down !== null) result &&= down.equal(this.nodes[i][j + 1].getEdge([i, j]))

            if (!result) throw new Error("Graph is not undirected")
            if (!node.enabled) for (let edge of node.edges) if (edge.enabled) throw new Error("Invalid disabled node")
        }
    }

}

export abstract class MazeProcess
{

    public finished: boolean = false

    protected constructor(public readonly maze: Maze) { }

    public abstract init(): void
    public abstract update(): void

    public render(c: CanvasRenderingContext2D) { }

}

export abstract class PriorityQueue<T>
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
