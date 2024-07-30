export class Node
{

    public readonly edges: Edge[] = []

    public addEdge(edge: Edge) { this.edges.push(edge) }
    public getEdge(i: number, j: number): Edge | null
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

    public enabled: boolean = Math.random() < 0.5

    public constructor(public readonly node: [number, number], public readonly weight: number) { }

}

export default class Maze
{

    public readonly nodes: Node[][] = []

    public constructor(public readonly width: number, public readonly height: number)
    {
        for (let i = 0; i < width; i++)
        {
            this.nodes[i] = []
            for (let j = 0; j < height; j++) this.nodes[i][j] = new Node()
        }

        for (let i = 0; i < width; i++) for (let j = 0; j < height; j++)
        {
            if (i < width - 1)
            {
                let weight = Math.random()
                this.nodes[i][j].addEdge(new Edge([i + 1, j], weight))
                this.nodes[i + 1][j].addEdge(new Edge([i, j], weight))
            }
            if (j < height - 1)
            {
                let weight = Math.random()
                this.nodes[i][j].addEdge(new Edge([i, j + 1], weight))
                this.nodes[i][j + 1].addEdge(new Edge([i, j], weight))
            }
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

    public render(c: CanvasRenderingContext2D)
    {
        c.strokeStyle = "#ffffff"
        for (let i = 0; i < this.width; i++) for (let j = 0; j < this.height; j++)
        {
            let node = this.nodes[i][j]
            let right = node.getEdge(i + 1, j), down = node.getEdge(i, j + 1)

            if (right !== null && right.enabled) this.line(c, i, j, i + 1, j)
            if (down !== null && down.enabled) this.line(c, i, j, i, j + 1)
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
