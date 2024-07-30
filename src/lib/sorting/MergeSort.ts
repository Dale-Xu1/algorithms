import Graph, { GraphProcess } from "./Graph"

export default class MergeSort extends GraphProcess
{

    private *merge(low: number, middle: number, high: number)
    {
        let graph = this.graph

        let sorted: number[] = []
        let left = this.graph.values.slice(low, middle)
        let right = this.graph.values.slice(middle, high + 1)

        let i = 0, j = 0
        while (i < left.length && j < right.length)
        {
            graph.mark(low + i, middle + j)

            if (left[i] <= right[j]) sorted.push(left[i++])
            else sorted.push(right[j++])
            yield
        }

        while (i < left.length)
        {
            graph.mark(low + i)
            sorted.push(left[i++])
            yield
        }

        while (j < right.length)
        {
            graph.mark(middle + j)
            sorted.push(right[j++])
            yield
        }

        for (let i = 0; i < sorted.length; i++)
        {
            graph.mark(low + i)
            graph.values[low + i] = sorted[i]
            yield
        }
    }

    private *sort(low: number, high: number): Generator<void, void, void>
    {
        if (low >= high) return

        let middle = low + Math.floor((high - low) / 2)
        yield *this.sort(low, middle)
        yield *this.sort(middle + 1, high)

        yield *this.merge(low, middle + 1, high)
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort(0, this.graph.length - 1) }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    // private readonly queue: [number, number][] = []

    // private low!: number
    // private high!: number
    // private middle!: number

    // private sorted!: number[]
    // private left!: number[]
    // private right!: number[]

    // private merged: boolean = false
    // private index: number = 0
    // private i: number = 0
    // private j: number = 0

    // public override init()
    // {
    //     this.generateMerges(0, this.graph.length - 1)
    //     this.shift()
    // }

    // private generateMerges(low: number, high: number)
    // {
    //     if (low >= high) return

    //     let m = low + Math.floor((high - low) / 2)
    //     this.generateMerges(low, m)
    //     this.generateMerges(m + 1, high)

    //     this.queue.push([low, high])
    // }

    // private shift()
    // {
    //     if (this.queue.length === 0) return void (this.finished = true)
    //     let [low, high] = this.queue.shift()!

    //     this.low = low
    //     this.high = high
    //     this.middle = low + Math.floor((high - low) / 2) + 1

    //     this.sorted = []
    //     this.left = this.graph.values.slice(this.low, this.middle)
    //     this.right = this.graph.values.slice(this.middle, this.high + 1)

    //     this.merged = false
    //     this.index = this.i = this.j = 0
    // }

    // public override update()
    // {
    //     let graph = this.graph

    //     if (this.i >= this.left.length && this.j >= this.right.length) this.merged = true
    //     if (this.merged)
    //     {
    //         graph.activate(this.low + this.index)
    //         graph.values[this.low + this.index] = this.sorted[this.index++]

    //         if (this.index >= this.sorted.length) this.shift()
    //         return
    //     }

    //     if (this.i >= this.left.length)
    //     {
    //         graph.activate(this.middle + this.j)
    //         this.sorted.push(this.right[this.j++])
    //     }
    //     else if (this.j >= this.right.length)
    //     {
    //         graph.activate(this.low + this.i)
    //         this.sorted.push(this.left[this.i++])
    //     }
    //     else
    //     {
    //         graph.activate(this.low + this.i, this.middle + this.j)

    //         if (this.left[this.i] <= this.right[this.j]) this.sorted.push(this.left[this.i++])
    //         else this.sorted.push(this.right[this.j++])
    //     }
    // }

}
