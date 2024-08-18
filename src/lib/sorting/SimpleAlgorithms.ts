import Graph, { GraphProcess } from "./Graph"

export class BubbleSort extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private *sort()
    {
        let graph = this.graph
        for (let i = 0; i < graph.length - 1; i++)
        {
            let swapped = false
            for (let j = 0; j < graph.length - i - 1; j++)
            {
                if (graph.values[j] > graph.values[j + 1])
                {
                    [graph.values[j], graph.values[j + 1]] = [graph.values[j + 1], graph.values[j]]
                    swapped = true
                }

                graph.mark(j, j + 1)
                yield
            }

            if (!swapped) break
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Bubble" }

//     private i: number = 0
//     private j: number = 0

//     public override init() { }
//     public override update()
//     {
//         let graph = this.graph
//         if (this.i >= graph.length - 1) return void (this.finished = true)

//         graph.activate(this.j, this.j + 1)
//         if (graph.values[this.j] > graph.values[this.j + 1])
//         {
//             [graph.values[this.j], graph.values[this.j + 1]] = [graph.values[this.j + 1], graph.values[this.j]]
//         }

//         if (++this.j >= graph.length - this.i - 1)
//         {
//             this.i++
//             this.j = 0
//         }
//     }

}

export class InsertionSort extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private *sort()
    {
        let graph = this.graph
        for (let i = 1; i < graph.length; i++)
        {
            for (let j = i; j > 0; j--)
            {
                graph.mark(j - 1, j)
                yield

                if (graph.values[j - 1] > graph.values[j])
                {
                    [graph.values[j], graph.values[j - 1]] = [graph.values[j - 1], graph.values[j]]
                }
                else break
            }
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Insertion" }

//     private i: number = 0
//     private j: number = 0

//     public override init() { }
//     public override update()
//     {
//         let graph = this.graph
//         if (this.i >= graph.length) return void (this.finished = true)

//         graph.activate(this.j, this.j - 1)
//         if (graph.values[this.j - 1] > graph.values[this.j] && this.j > 0)
//         {
//             [graph.values[this.j], graph.values[this.j - 1]] = [graph.values[this.j - 1], graph.values[this.j]]
//             this.j--
//         }
//         else
//         {
//             this.i++
//             this.j = this.i
//         }
//     }

}

export class SelectionSort extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private *sort()
    {
        let graph = this.graph
        for (let i = 0; i < graph.length - 1; i++)
        {
            let min = i
            for (let j = i + 1; j < graph.length; j++)
            {
                graph.mark(min, j)
                if (graph.values[j] < graph.values[min]) min = j
                yield
            }

            [graph.values[i], graph.values[min]] = [graph.values[min], graph.values[i]]
            graph.mark(i, min)
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Selection" }

}

export class ShellSort extends GraphProcess
{

    public constructor(graph: Graph) { super(graph) }

    private *sort()
    {
        let graph = this.graph
        for (let gap = Math.floor(graph.length / 2); gap > 0; gap = Math.floor(gap / 2))
        {
            for (let i = gap; i < graph.length; i++)
            {
                let initial = graph.values[i]
                for (let j = i; j >= gap; j -= gap)
                {
                    let state = graph.values[j - gap] > initial
                    if (state)
                    {
                        [graph.values[j - gap], graph.values[j]] = [graph.values[j], graph.values[j - gap]]
                    }

                    graph.mark(j - gap, j)
                    yield
                    if (!state) break
                }
            }
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.sort() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    public override toString(): string { return "Shell" }

}
