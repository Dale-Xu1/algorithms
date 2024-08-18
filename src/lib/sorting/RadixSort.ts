import Graph, { GraphProcess } from "./Graph"

export class RadixSortLSD extends GraphProcess
{

    public constructor(graph: Graph, private radix: number = 4) { super(graph) }

    private toInt(value: number): number { return Math.round(value * this.graph.length) }
    private *sort()
    {
        let graph = this.graph
        let index = 0
        for (let i = 1; i < graph.length; i++)
        {
            graph.mark(index, i)
            if (graph.values[i] > graph.values[index]) index = i
            yield
        }

        let pMax = Math.ceil(Math.log(this.toInt(graph.values[index]) + 1) / Math.log(this.radix))
        for (let p = 0; p < pMax; p++)
        {
            let base = Math.pow(this.radix, p)
            let buckets: number[][] = Array.from({ length: this.radix }, () => [])

            for (let i = 0; i < graph.length; i++)
            {
                let r = Math.floor(this.toInt(graph.values[i]) / base) % this.radix
                buckets[r].push(graph.values[i])
                graph.mark(i)
                yield
            }

            let length = Math.max(...buckets.map(bucket => bucket.length))
            for (let i = 0; i < length; i++) for (let j = 0, start = 0; j < buckets.length; j++)
            {
                let l = buckets[j].length
                if (i < l)
                {
                    graph.values[start + i] = buckets[j][i]
                    graph.mark(start + i)
                    yield
                }

                start += l
            }
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Radix (LSD)" }

}

export class RadixSortMSD extends GraphProcess
{

    public constructor(graph: Graph, private radix: number = 4) { super(graph) }

    private max!: number

    private toInt(value: number): number { return Math.round(value * this.graph.length) }
    private *traverse(low: number, high: number, depth: number): Generator<void, void, void>
    {
        let graph = this.graph
        let pMax = Math.ceil(Math.log(this.max + 1) / Math.log(this.radix))

        let base = Math.pow(this.radix, pMax - depth)
        let buckets: number[][] = Array.from({ length: this.radix }, () => [])

        for (let i = low; i < high; i++)
        {
            let r = Math.floor(this.toInt(graph.values[i]) / base) % this.radix
            buckets[r].push(graph.values[i])
            graph.mark(i)
            yield
        }

        let length = Math.max(...buckets.map(bucket => bucket.length))
        for (let i = 0; i < length; i++) for (let j = 0, start = low; j < buckets.length; j++)
        {
            let l = buckets[j].length
            if (i < l)
            {
                graph.values[start + i] = buckets[j][i]
                graph.mark(start + i)
                yield
            }

            start += l
        }

        if (depth >= pMax) return
        for (let i = 0, start = low; i < this.radix; i++)
        {
            yield *this.traverse(start, start + buckets[i].length, depth + 1)
            start += buckets[i].length
        }
    }

    private *sort()
    {
        let graph = this.graph
        let index = 0
        for (let i = 1; i < graph.length; i++)
        {
            graph.mark(index, i)
            if (graph.values[i] > graph.values[index]) index = i
            yield
        }

        this.max = this.toInt(graph.values[index])
        yield *this.traverse(0, this.graph.length, 1)
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Radix (MSD)" }

}
