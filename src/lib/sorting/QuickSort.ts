import Graph, { GraphProcess } from "./Graph"

export class QuickSortLL extends GraphProcess
{

    private *partition(low: number, high: number)
    {
        let graph = this.graph

        let i = low
        let pivot = graph.values[high]

        for (let j = low; j < high; j++)
        {
            graph.mark(j, high)
            if (graph.values[j] < pivot)
            {
                [graph.values[i], graph.values[j]] = [graph.values[j], graph.values[i]]
                graph.mark(i)

                i++
            }

            yield
        }

        [graph.values[i], graph.values[high]] = [graph.values[high], graph.values[i]]
        graph.mark(i, high)
        yield

        return i
    }

    private *sort(low: number, high: number): Generator<void, void, void>
    {
        if (low >= high) return
        let i = yield *this.partition(low, high)

        yield *this.sort(low, i - 1)
        yield *this.sort(i + 1, high)
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort(0, this.graph.length - 1) }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}

export class QuickSortLR extends GraphProcess
{

    private *partition(low: number, high: number)
    {
        let graph = this.graph

        let i = low, j = high
        let pivot = graph.values[low]

        while (true)
        {
            while (graph.values[i] < pivot) graph.mark(low, i++), yield
            while (graph.values[j] > pivot) graph.mark(low, j--), yield
            if (i >= j) return j;

            [graph.values[i], graph.values[j]] = [graph.values[j], graph.values[i]]
            graph.mark(i, j)
        }
    }

    private *sort(low: number, high: number): Generator<void, void, void>
    {
        if (low >= high) return
        let i = yield *this.partition(low, high)

        yield *this.sort(low, i)
        yield *this.sort(i + 1, high)
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort(0, this.graph.length - 1) }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

//     private readonly stack: [number, number][] = []

//     private low!: number
//     private high!: number

//     private i!: number
//     private j!: number

//     private pivot!: number

//     public override init() { this.initPartition(0, this.graph.length - 1) }
//     private initPartition(low: number, high: number)
//     {
//         this.low = low, this.high = high
//         this.i = this.j = low

//         this.pivot = this.graph.values[high]
//     }

//     private pop()
//     {
//         if (this.stack.length === 0) return void (this.finished = true)
//         let [low, high] = this.stack.pop()!

//         if (low >= high || low < 0) return void this.pop()
//         this.initPartition(low, high)
//     }

//     public override update()
//     {
//         let graph = this.graph

//         graph.activate(this.j)
//         if (graph.values[this.j] < this.pivot)
//         {
//             [graph.values[this.i], graph.values[this.j]] = [graph.values[this.j], graph.values[this.i]]
//             graph.activate(this.i)

//             this.i++
//         }

//         if (++this.j >= this.high)
//         {
//             [graph.values[this.i], graph.values[this.high]] = [graph.values[this.high], graph.values[this.i]]
//             graph.activate(this.i, this.high)

//             this.stack.push([this.i + 1, this.high])
//             this.stack.push([this.low, this.i - 1])
//             this.pop()
//         }
//     }

}
