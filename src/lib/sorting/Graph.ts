export default class Graph
{

    public readonly values: number[] = []
    private readonly active: number[] = []

    public constructor(public readonly length: number, private readonly lifetime: number)
    {
        for (let i = 0; i < length; i++)
        {
            this.values[i] = (i + 1) / length
            this.active[i] = 0
        }
    }


    public mark(...indices: number[])
    {
        for (let i of indices) this.active[i] = this.lifetime
    }

    public update()
    {
        for (let i = 0; i < this.length; i++) if (this.active[i] > 0) this.active[i]--
    }

    public render(c: CanvasRenderingContext2D)
    {
        let width = c.canvas.width, height = c.canvas.height
        for (let i = 0; i < this.length; i++)
        {
            c.fillStyle = `hsl(0, 100%, ${50 + (this.lifetime - this.active[i]) / this.lifetime * 50}%)`

            let w = width / this.length, h = this.values[i] * height
            c.fillRect(i * w, height - h, w, h)
        }
    }

    public validate()
    {
        for (let i = 0; i < this.length - 1; i++)
        {
            if (this.values[i] > this.values[i + 1])
            {
                console.log(this.values)
                throw new Error("List is not sorted")
            }
        }
    }

}

export abstract class GraphProcess
{

    public finished: boolean = false

    protected constructor(public readonly graph: Graph) { }

    public abstract init(): void
    public abstract update(): void

}

export class Shuffle extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private i: number = 0

    public override init() { }
    public override update()
    {
        if (this.i >= this.graph.length - 1) return void (this.finished = true)

        let graph = this.graph
        let j = this.i + Math.floor(Math.random() * (graph.length - this.i));

        [graph.values[this.i], graph.values[j]] = [graph.values[j], graph.values[this.i]]
        graph.mark(this.i, j)

        this.i++
    }

}
