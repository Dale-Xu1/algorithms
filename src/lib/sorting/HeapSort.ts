import Graph, { GraphProcess } from "./Graph"

export default class HeapSort extends GraphProcess
{

    private *heapify(n: number, i: number): Generator<void, void, void>
    {
        let graph = this.graph

        let largest = i
        let left = 2 * i + 1
        let right = 2 * i + 2

        if (left < n)
        {
            graph.mark(largest, left)
            if (graph.values[left] > graph.values[largest]) largest = left
            yield
        }
        if (right < n)
        {
            graph.mark(largest, right)
            if (graph.values[right] > graph.values[largest]) largest = right
            yield
        }

        if (largest !== i)
        {
            [graph.values[i], graph.values[largest]] = [graph.values[largest], graph.values[i]]
            yield *this.heapify(n, largest)
        }
    }

    private *sort()
    {
        let graph = this.graph
        for (let i = Math.floor(graph.length / 2) - 1; i >= 0; i--) yield *this.heapify(graph.length, i)

        for (let i = graph.length - 1; i > 0; i--)
        {
            [graph.values[0], graph.values[i]] = [graph.values[i], graph.values[0]]
            graph.mark(0, i)

            yield
            yield *this.heapify(i, 0)
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    // private heapified: boolean = false
    // private n!: number

    // private index!: number
    // private i!: number

    // public override init()
    // {
    //     this.n = this.graph.length
    //     this.index = this.i = Math.floor(this.n / 2) - 1
    // }

    // public override update()
    // {
    //     let largest = this.i
    //     let left = 2 * this.i + 1
    //     let right = 2 * this.i + 2

    //     let graph = this.graph
    //     if (left < this.n && graph.values[left] > graph.values[largest]) largest = left
    //     if (right < this.n && graph.values[right] > graph.values[largest]) largest = right

    //     graph.activate(largest)
    //     if (left < this.n) graph.activate(left)
    //     if (right < this.n) graph.activate(right)

    //     if (largest !== this.i)
    //     {
    //         [graph.values[this.i], graph.values[largest]] = [graph.values[largest], graph.values[this.i]]
    //         graph.activate(this.i)

    //         this.i = largest
    //     }
    //     else if (!this.heapified)
    //     {
    //         this.i = --this.index
    //         if (this.index < 0) this.heapified = true
    //     }
    //     else
    //     {
    //         this.i = 0
    //         if (--this.n <= 0) return void (this.finished = true);

    //         [graph.values[0], graph.values[this.n]] = [graph.values[this.n], graph.values[0]]
    //         graph.activate(0, this.n)
    //     }
    // }

}
