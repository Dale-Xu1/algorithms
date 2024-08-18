import Maze, { Edge, MazeProcess } from "./Maze"

export default class BraidMaze extends MazeProcess
{

    public constructor(maze: Maze, private readonly probability: number = 1) { super(maze) }

    private readonly deadends: [number, number][] = []

    public override init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++) for (let j = 0; j < maze.height; j++)
        {
            if (this.countEnabled([i, j]) === 1) this.deadends.push([i, j])
        }

        for (let i = 0; i < this.deadends.length - 1; i++)
        {
            let j = i + Math.floor(Math.random() * (this.deadends.length - i));
            [this.deadends[i], this.deadends[j]] = [this.deadends[j], this.deadends[i]]
        }
    }

    public override update()
    {
        if (this.deadends.length === 0) return void (this.finished = true)

        let [i, j] = this.deadends.pop()!
        if (Math.random() > this.probability || this.countEnabled([i, j]) > 1) return void this.update()

        let edges: Edge[] = [], min = Infinity
        for (let edge of this.maze.nodes[i][j].edges)
        {
            if (edge.enabled) continue
            let enabled = this.countEnabled(edge.node)

            if (enabled > min || enabled === 0) continue
            else if (enabled < min) min = enabled, edges = []
            edges.push(edge)
        }

        if (edges.length === 0) return void this.update()
        let edge = edges[Math.floor(Math.random() * edges.length)]

        this.maze.enable([i, j], edge.node)
    }

    private countEnabled([i, j]: [number, number]): number
    {
        let count = 0
        for (let edge of this.maze.nodes[i][j].edges) if (edge.enabled) count++

        return count
    }

    public override toString(): string { return "Braid" }

}
