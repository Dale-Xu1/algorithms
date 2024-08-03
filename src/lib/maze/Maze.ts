export class Node
{

    public readonly edges: Edge[] = []

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

export class Edge
{

    public enabled: boolean = false
    public active: number = 0

    public constructor(public readonly node: [number, number], public readonly weight: number) { }

    public update() { if (this.active > 0) this.active-- }
    public equal(edge: Edge | null): boolean
    {
        if (edge === null) return false
        return this.enabled === edge.enabled && this.active === edge.active && this.weight === edge.weight
    }

}

export default class Maze
{

    public readonly nodes: Node[][] = []

    public constructor(public readonly width: number, public readonly height: number, private readonly lifetime: number) { this.reset() }
    public reset()
    {
        for (let i = 0; i < this.width; i++)
        {
            this.nodes[i] = []
            for (let j = 0; j < this.height; j++) this.nodes[i][j] = new Node()
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


    public enable([i, j]: [number, number], [k, l]: [number, number])
    {
        let a = this.nodes[i][j].getEdge([k, l]), b = this.nodes[k][l].getEdge([i, j])
        if (a !== null) a.enabled = true, a.active = this.lifetime
        if (b !== null) b.enabled = true, b.active = this.lifetime
    }

    public update()
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let node = this.nodes[i][j]
            for (let edge of node.edges) edge.update()
        }
    }

    public render(c: CanvasRenderingContext2D)
    {
        c.strokeStyle = "#ff0000"
        this.renderAll(c, true)

        c.strokeStyle = "#ffffff"
        this.renderAll(c, false)
    }

    private renderAll(c: CanvasRenderingContext2D, state: boolean)
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let node = this.nodes[i][j]
            let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])

            if (right !== null && right.enabled && right.active > 0 === state) this.line(c, i, j, i + 1, j)
            if (down !== null && down.enabled && down.active > 0 === state) this.line(c, i, j, i, j + 1)
        }
    }

    private line(c: CanvasRenderingContext2D, i: number, j: number, k: number, l: number)
    {
        let w = c.canvas.width / this.width, h =  c.canvas.height / this.height
        c.lineWidth = w / 2
        c.lineCap = "square"

        c.beginPath()
        c.moveTo(i * w + w / 2, j * h + h / 2)
        c.lineTo(k * w + w / 2, l * h + h / 2)
        c.stroke()
    }

    public validateUndirected()
    {
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let node = this.nodes[i][j]
            let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])

            let result = true
            if (right !== null) result &&= right.equal(this.nodes[i + 1][j].getEdge([i, j]))
            if (down !== null) result &&= down.equal(this.nodes[i][j + 1].getEdge([i, j]))

            if (!result) throw new Error("Graph is not undirected")
        }
    }

}

export abstract class MazeProcess
{

    public finished: boolean = false

    protected constructor(public readonly maze: Maze) { }

    public abstract init(): void
    public abstract update(): void

}
