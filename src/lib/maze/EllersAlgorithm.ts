import Maze, { MazeProcess } from "./Maze"

export default class EllersAlgorithm extends MazeProcess
{

    public constructor(maze: Maze, private readonly a: number = 0.5, private readonly b: number = 0.5) { super(maze) }

    private readonly parent: number[] = []
    private readonly rank: number[] = []

    private reset() { for (let i = 0; i < this.maze.width; i++) this.parent[i] = i, this.rank[i] = 0 }
    private *generate()
    {
        let maze = this.maze
        this.reset()

        for (let j = 0; j < maze.height - 1; j++)
        {
            for (let i = 0; i < maze.width - 1; i++)
            {
                let u = this.find(i), v = this.find(i + 1)
                if (u === v) continue

                if (Math.random() < this.a)
                {
                    this.union(u, v)
                    maze.enable([i, j], [i + 1, j])
                    yield
                }
            }

            let sets: number[][] = Array.from({ length: maze.width }, () => [])
            for (let i = 0; i < maze.width; i++) sets[this.find(i)].push(i)

            this.reset()
            for (let set of sets)
            {
                if (set.length === 0) continue

                let vertices: number[] = []
                for (let i of set) if (Math.random() < this.b) vertices.push(i)
                if (vertices.length === 0) vertices.push(set[Math.floor(Math.random() * set.length)])

                let min = Math.min(...vertices)
                for (let i of vertices)
                {
                    this.parent[i] = min
                    maze.enable([i, j], [i, j + 1])
                    yield
                }
            }
        }

        for (let i = 0; i < maze.width - 1; i++)
        {
            let u = this.find(i), v = this.find(i + 1)
            if (u === v) continue

            this.union(u, v)
            maze.enable([i, maze.height - 1], [i + 1, maze.height - 1])
            yield
        }
    }

    private find(i: number): number
    {
        let j = this.parent[i]
        if (i === j) return i

        return this.parent[i] = this.find(j)
    }

    private union(i: number, j: number)
    {
        if (this.rank[i] < this.rank[j]) this.parent[i] = j
        else if (this.rank[i] > this.rank[j]) this.parent[j] = i
        else this.parent[j] = i, this.rank[i]++
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.generate() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}
