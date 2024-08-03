import Maze, { MazeProcess } from "./Maze"

class ActiveEdge { public constructor(public readonly to: [number, number], public readonly from: [number, number], public readonly weight: number) { } }

export default class KruskalsAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly parent: [number, number][][] = []
    private readonly rank: number[][] = []

    private readonly queue: ActiveEdge[] = []

    public init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++)
        {
            this.parent[i] = [], this.rank[i] = []
            for (let j = 0; j < maze.height; j++)
            {
                this.parent[i][j] = [i, j], this.rank[i][j] = 0

                let node = maze.nodes[i][j]
                let right = node.getEdge([i + 1, j]), down = node.getEdge([i, j + 1])

                if (right !== null) this.queue.push(new ActiveEdge(right.node, [i, j], right.weight))
                if (down !== null) this.queue.push(new ActiveEdge(down.node, [i, j], down.weight))
            }
        }

        this.queue.sort((a, b) => a.weight - b.weight)
    }

    public update()
    {
        if (this.queue.length === 0) return void (this.finished = true)
        let edge = this.queue.shift()!

        let u = this.find(edge.to), v = this.find(edge.from)
        let [i, j] = u, [k, l] = v
        if (i === k && j === l) return void this.update()

        this.union(u, v)
        this.maze.enable(edge.to, edge.from)
    }

    private find([i, j]: [number, number]): [number, number]
    {
        let [k, l] = this.parent[i][j]
        if (i === k && j === l) return [i, j]

        return this.parent[i][j] = this.find([k, l])
    }

    private union([i, j]: [number, number], [k, l]: [number, number])
    {
        if (this.rank[i][j] < this.rank[k][l]) this.parent[i][j] = [k, l]
        else if (this.rank[i][j] > this.rank[k][l]) this.parent[k][l] = [i, j]
        else
        {
            this.parent[k][l] = [i, j]
            this.rank[i][j]++
        }
    }

}