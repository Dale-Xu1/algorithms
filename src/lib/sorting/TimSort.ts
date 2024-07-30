import Graph, { GraphProcess } from "./Graph"

// NOTE: !! This is not a correct implementation of Tim sort (it has been modified for the purpose of visualization)
export default class TimSort extends GraphProcess
{

    // private readonly minGallop: number = 7
    public constructor(graph: Graph, private readonly minRun: number = 32) { super(graph) }

    private runLength!: number
    private stack: [number, number][] = []

    private *insertionSort(low: number, high: number, start: number)
    {
        let graph = this.graph
        for (let i = start; i < high; i++)
        {
            let key = graph.values[i]
            let l = low, r = i
            while (l < r)
            {
                let middle = (l + r) >>> 1
                if (key < graph.values[middle]) r = middle
                else l = middle + 1

                graph.mark(middle)
                yield
            }

            for (let j = i; j > l; j--)
            {
                [graph.values[j], graph.values[j - 1]] = [graph.values[j - 1], graph.values[j]]
                graph.mark(j - 1, j)
                yield
            }

            // for (let j = i; j > low && graph.values[j - 1] > graph.values[j]; j--)
            // {
            //     [graph.values[j], graph.values[j - 1]] = [graph.values[j - 1], graph.values[j]]
            //     graph.mark(j - 1, j)
            //     yield
            // }
        }
    }

    // private *merge(low: number, middle: number, high: number)
    // {
    //     let graph = this.graph

    //     let sorted: number[] = []
    //     let left = this.graph.values.slice(low, middle)
    //     let right = this.graph.values.slice(middle, high)

    //     let i = 0, j = 0
    //     while (i < left.length && j < right.length)
    //     {
    //         graph.mark(low + i, middle + j)

    //         if (left[i] <= right[j]) sorted.push(left[i++])
    //         else sorted.push(right[j++])
    //         yield
    //     }

    //     while (i < left.length)
    //     {
    //         graph.mark(low + i)
    //         sorted.push(left[i++])
    //         yield
    //     }

    //     while (j < right.length)
    //     {
    //         graph.mark(middle + j)
    //         sorted.push(right[j++])
    //         yield
    //     }

    //     for (let i = 0; i < sorted.length; i++)
    //     {
    //         graph.mark(low + i)
    //         graph.values[low + i] = sorted[i]
    //         yield
    //     }
    // }

    // private *mergeStack(i: number)
    // {
    //     let [left, a] = this.stack[i]
    //     let [middle, b] = this.stack[i + 1]
    //     this.stack.splice(i, 2, [left, a + b])

    //     yield *this.merge(left, middle, middle + b)
    // }

    private *gallopLeft(key: number, start: number, length: number, hint: number): Generator<void, number, void>
    {
        let graph = this.graph
        let offset = 1, lastOffset = 0

        graph.mark(start + hint), yield
        if (key > graph.values[start + hint])
        {
            let maxOffset = length - hint
            while (offset < maxOffset)
            {
                let index = start + hint + offset
                graph.mark(index), yield
                if (key <= graph.values[index]) break

                lastOffset = offset
                offset = (offset << 1) + 1
                if (offset <= 0) offset = maxOffset
            }

            if (offset > maxOffset) offset = maxOffset
            lastOffset += hint
            offset += hint
        }
        else
        {
            let maxOffset = hint + 1
            while (offset < maxOffset)
            {
                let index = start + hint - offset
                graph.mark(index), yield
                if (key > graph.values[index]) break

                lastOffset = offset
                offset = (offset << 1) + 1
                if (offset <= 0) offset = maxOffset
            }

            if (offset > maxOffset) offset = maxOffset;
            [offset, lastOffset] = [hint - lastOffset, hint - offset]
        }

        lastOffset++
        while (lastOffset < offset)
        {
            let middle = lastOffset + ((offset - lastOffset) >>> 1)
            if (key > graph.values[start + middle]) lastOffset = middle + 1
            else offset = middle

            graph.mark(start + middle)
            yield
        }

        return offset
    }

    private *gallopRight(key: number, start: number, length: number, hint: number): Generator<void, number, void>
    {
        let graph = this.graph
        let offset = 1, lastOffset = 0

        graph.mark(start + hint), yield
        if (key < graph.values[start + hint])
        {
            let maxOffset = hint + 1
            while (offset < maxOffset)
            {
                let index = start + hint - offset
                graph.mark(index), yield
                if (key >= graph.values[index]) break

                lastOffset = offset
                offset = (offset << 1) + 1
                if (offset <= 0) offset = maxOffset
            }

            if (offset > maxOffset) offset = maxOffset;
            [offset, lastOffset] = [hint - lastOffset, hint - offset]
        }
        else
        {
            let maxOffset = length - hint
            while (offset < maxOffset)
            {
                let index = start + hint + offset
                graph.mark(index), yield
                if (key < graph.values[start + hint + offset]) break

                lastOffset = offset
                offset = (offset << 1) + 1
                if (offset <= 0) offset = maxOffset
            }

            if (offset > maxOffset) offset = maxOffset
            lastOffset += hint
            offset += hint
        }

        lastOffset++
        while (lastOffset < offset)
        {
            let middle = lastOffset + ((offset - lastOffset) >>> 1)
            if (key < graph.values[start + middle]) offset = middle
            else lastOffset = middle + 1

            graph.mark(start + middle)
            yield
        }

        return offset
    }

    private *mergeLow(a: number, l1: number, b: number, l2: number)
    {
        let graph = this.graph

        let sorted: number[] = []
        let left = this.graph.values.slice(a, a + l1)
        let right = this.graph.values.slice(b, b + l2)

        let i = 0, j = 0
        while (i < l1 && j < l2)
        {
            graph.mark(a + i, b + j)

            if (left[i] <= right[j]) sorted.push(left[i++])
            else sorted.push(right[j++])
            yield
        }

        while (i < l1)
        {
            graph.mark(a + i)
            sorted.push(left[i++])
            yield
        }

        while (j < l2)
        {
            graph.mark(b + j)
            sorted.push(right[j++])
            yield
        }

        for (let i = 0; i < sorted.length; i++)
        {
            graph.mark(a + i)
            graph.values[a + i] = sorted[i]
            yield
        }

        // let graph = this.graph
        // let temp = []
        // for (let i = 0; i < l1; i++) temp[i] = graph.values[a + i]

        // let cursor1 = 0, cursor2 = b, dest = a
        // graph.values[dest++] = graph.values[cursor2++]
        // if (--l2 === 0)
        // {
        //     for (let i = 0; i < l1; i++) graph.values[dest + i] = temp[cursor1 + i]
        //     return
        // }
        // if (l1 === 1)
        // {
        //     for (let i = 0; i < l2; i++) graph.values[dest + i] = graph.values[cursor2 + i]
        //     graph.values[dest + l2] = temp[cursor1]
        //     return
        // }

        // outer: while (true)
        // {
        //     let count1 = 0, count2 = 0
        //     do
        //     {
        //         if (graph.values[cursor2] < temp[cursor1])
        //         {
        //             graph.values[dest++] = graph.values[cursor2++]
        //             count2++, count1 = 0
        //             if (--l2 === 0) break outer
        //         }
        //         else
        //         {
        //             graph.values[dest++] = temp[cursor1++]
        //             count1++, count2 = 0
        //             if (--l1 === 1) break outer
        //         }
        //     } while ((count1 | count2) < this.minGallop)
        //     do
        //     {
        //         count1 = yield this.gallopRight(graph.values[cursor2], temp, cursor1, l1, 0)
        //         if (count1 !== 0)
        //         {
        //             arrayCopy(temp, cursor1, a, dest, count1)
        //             dest += count1, cursor1 += count1, l1 -= count1
        //             if (l1 <= 1) break outer
        //         }
        //         graph.values[dest++] = graph.values[cursor2++]
        //         if (--l2 === 0) break outer

        //         count2 = yield this.gallopLeft(temp[cursor1], cursor2, l2, 0)
        //         if (count2 !== 0)
        //         {
        //             arrayCopy(a, cursor2, a, dest, count2)
        //             dest += count2, cursor2 += count2, l2 -= count2
        //             if (l2 === 0) break outer
        //         }
        //         graph.values[dest++] = temp[cursor1++]

        //         if (--l1 === 1) break outer
        //     } while (count1 >= this.minGallop || count2 >= this.minGallop)
        // }

        // if (l1 == 1)
        // {
        //     arrayCopy(a, cursor2, a, dest, l2)
        //     graph.values[dest + l2] = temp[cursor1]
        // }
        // else
        // {
        //     arrayCopy(temp, cursor1, a, dest, l1)
        // }
    }

    private *mergeHigh(a: number, l1: number, b: number, l2: number)
    {
        let graph = this.graph

        let sorted: number[] = []
        let left = this.graph.values.slice(a, a + l1)
        let right = this.graph.values.slice(b, b + l2)

        let i = l1 - 1, j = l2 - 1
        while (i >= 0 && j >= 0)
        {
            graph.mark(a + i, b + j)

            if (left[i] >= right[j]) sorted.unshift(left[i--])
            else sorted.unshift(right[j--])
            yield
        }

        while (i >= 0)
        {
            graph.mark(a + i)
            sorted.unshift(left[i--])
            yield
        }

        while (j >= 0)
        {
            graph.mark(b + j)
            sorted.unshift(right[j--])
            yield
        }

        for (let i = sorted.length - 1; i >= 0; i--)
        {
            graph.mark(a + i)
            graph.values[a + i] = sorted[i]
            yield
        }
    }

    private *mergeStack(i: number)
    {
        let graph = this.graph

        let [a, l1] = this.stack[i]
        let [b, l2] = this.stack[i + 1]
        this.stack.splice(i, 2, [a, l1 + l2])

        let k = yield *this.gallopRight(graph.values[b], a, l1, 0)
        a += k, l1 -= k
        if (l1 === 0) return

        l2 = yield *this.gallopLeft(graph.values[a + l1 - 1], b, l2, l2 - 1)
        if (l2 === 0) return

        if (l1 <= l2) yield *this.mergeLow(a, l1, b, l2)
        else yield *this.mergeHigh(a, l1, b, l2)
    }

    private *collapse()
    {
        while (this.stack.length > 1)
        {
            let n = this.stack.length - 2
            if (n > 0 && this.stack[n - 1][1] <= this.stack[n][1] + this.stack[n + 1][1])
            {
                if (this.stack[n - 1][1] < this.stack[n + 1][1]) n--
                yield *this.mergeStack(n)
            }
            else if (this.stack[n][1] <= this.stack[n + 1][1]) yield *this.mergeStack(n)
            else break
        }
    }

    private *forceCollapse()
    {
        while (this.stack.length > 1)
        {
            let n = this.stack.length - 2
            if (n > 0 && this.stack[n - 1][1] < this.stack[n + 1][1]) n--
            yield *this.mergeStack(n)
        }
    }

    private *reverse(low: number, high: number)
    {
        let graph = this.graph
        for (let i = low, j = high - 1; i < j; i++, j--)
        {
            [graph.values[i], graph.values[j]] = [graph.values[j], graph.values[i]]
            graph.mark(i, j)
            yield
        }
    }

    private *countRun(start: number): Generator<void, number, void>
    {
        let graph = this.graph
        if (start >= graph.length - 1) return 1

        graph.mark(start, start + 1)
        yield

        let high = start + 2
        if (graph.values[start] < graph.values[start + 1])
        {
            while (high < graph.length && graph.values[high - 1] < graph.values[high])
            {
                graph.mark(high - 1, high), high++
                yield
            }
        }
        else
        {
            while (high < graph.length && graph.values[high - 1] > graph.values[high])
            {
                graph.mark(high - 1, high), high++
                yield
            }
            yield *this.reverse(start, high)
        }

        return high - start
    }

    private *sort()
    {
        let graph = this.graph
        let current = 0
        while (current < graph.length)
        {
            let length = yield *this.countRun(current)
            if (length < this.runLength)
            {
                let high = Math.min(this.runLength, graph.length - current)
                yield *this.insertionSort(current, current + high, current + length)

                length = high
            }

            this.stack.push([current, length])
            current += length

            yield *this.collapse()
        }

        yield *this.forceCollapse()
    }

    private generator!: Generator<void, void, void>
    public override init()
    {
        let graph = this.graph
        let r = 0, n = graph.length

        while (n >= this.minRun) r |= n & 1, n >>= 1
        this.runLength = n + r

        this.generator = this.sort()
    }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    // private *sort(run: Run): Generator<void, [number, number], void>
    // {
    //     if (run instanceof Array)
    //     {
    //         yield *this.insertionSort(...run)
    //         return run
    //     }

    //     let [left, _] = yield *this.sort(run.left)
    //     let [middle, right] = yield *this.sort(run.right)

    //     yield *this.merge(left, middle, right)
    //     return [left, right]
    // }

    // private generator!: Generator<void, [number, number], void>
    // public override init()
    // {
    //     let graph = this.graph
    //     let r = 0, n = graph.length

    //     while (n >= this.minRun) r |= n & 1, n >>= 1
    //     let runLength = n + r

    //     let runs: Run[] = []
    //     for (let i = 0; i < graph.length; i += runLength) runs.push([i, Math.min(i + runLength - 1, graph.length - 1)])
    //     while (runs.length > 1)
    //     {
    //         let next: Run[] = []
    //         for (let i = 0; i < runs.length; i += 2)
    //         {
    //             if (i >= runs.length - 1) next.push(runs[i])
    //             else next.push({ left: runs[i], right: runs[i + 1] })
    //         }

    //         runs = next
    //     }

    //     this.generator = this.sort(runs[0])
    // }

    // public override update()
    // {
    //     if (this.generator.next().done) this.finished = true
    // }

}