import Graph, { GraphProcess } from "./Graph"

export default class BitonicSort extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private *merge(low: number, n: number, direction: boolean): Generator<void, void, void>
    {
        if (n <= 1) return

        let m = 1
        while (m < n) m <<= 1
        m >>= 1

        let graph = this.graph
        for (let i = low; i < low + n - m; i++)
        {
            if (graph.values[i] > graph.values[i + m] === direction)
            {
                [graph.values[i], graph.values[i + m]] = [graph.values[i + m], graph.values[i]]
            }

            graph.mark(i, i + m)
            yield
        }

        yield *this.merge(low, m, direction)
        yield *this.merge(low + m, n - m, direction)
    }

    private *sort(low: number, n: number, direction: boolean): Generator<void, void, void>
    {
        if (n <= 1) return
        let m = Math.floor(n / 2)

        yield *this.sort(low, m, !direction)
        yield *this.sort(low + m, n - m, direction)
        yield *this.merge(low, n, direction)
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort(0, this.graph.length, true) }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}
