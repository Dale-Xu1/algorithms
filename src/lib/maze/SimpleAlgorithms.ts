import Maze, { Edge, MazeProcess } from "./Maze"

export class DepthFirstSearch extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly visited: boolean[][] = []

    private position!: [number, number]
    private stack: [number, number][] = []

    public override init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++)
        {
            this.visited[i] = []
            for (let j = 0; j < maze.height; j++) this.visited[i][j] = false
        }
        
        let i = Math.floor(Math.random() * maze.width), j = Math.floor(Math.random() * maze.height)
        this.visited[i][j] = true

        this.position = [i, j]
        this.stack.push(this.position)
    }

    public override update()
    {
        let maze = this.maze
        let [i, j] = this.position

        let min: Edge | null = null
        for (let edge of maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.visited[k][l]) continue

            if (min === null || edge.weight < min.weight) min = edge
        }

        if (min === null)
        {
            this.stack.pop()
            if (this.stack.length === 0) return void (this.finished = true)

            this.position = this.stack[this.stack.length - 1]
            return void this.update()
        }

        let [k, l] = this.position = min.node
        this.visited[k][l] = true
        this.stack.push(this.position)

        maze.enable([i, j], [k, l])
    }

}

export class HuntAndKill extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly visited: boolean[][] = []

    private position: [number, number] = [0, 0]
    private last: [number, number] = this.position

    public override init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++)
        {
            this.visited[i] = []
            for (let j = 0; j < maze.height; j++) this.visited[i][j] = false
        }

        this.visited[0][0] = true
    }

    public override update()
    {
        let maze = this.maze
        let [i, j] = this.position

        let min: Edge | null = null
        for (let edge of maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.visited[k][l]) continue

            if (min === null || edge.weight < min.weight) min = edge
        }

        if (min === null)
        {
            let node = this.find(this.last)
            if (node === null) return void (this.finished = true)

            this.position = this.last = node
            return void this.update()
        }

        let [k, l] = this.position = min.node
        this.visited[k][l] = true
        maze.enable([i, j], [k, l])
    }

    private find([k, l]: [number, number]): [number, number] | null
    {
        let maze = this.maze
        for (let j = l; j < maze.height; j++) for (let i = j === l ? k : 0; i < maze.width; i++)
        {
            if (!this.visited[i][j]) continue
            for (let edge of maze.nodes[i][j].edges)
            {
                let [k, l] = edge.node
                if (!this.visited[k][l]) return [i, j]
            }
        }

        return null
    }

}

export class Sidewinder extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private *generate()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width - 1; i++) maze.enable([i, 0], [i + 1, 0]), yield

        for (let j = 1; j < maze.height; j++)
        {
            let start = 0
            for (let i = 0; i < maze.width; i++)
            {
                if (Math.random() < 0.5 || i >= maze.width - 1)
                {
                    let cell = start + Math.floor(Math.random() * (i - start + 1))
                    start = i + 1

                    maze.enable([cell, j], [cell, j - 1])
                }
                else maze.enable([i, j], [i + 1, j])
                yield
            }
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.generate() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}

export class BinaryTree extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private *generate()
    {
        let maze = this.maze
        for (let j = 0; j < maze.height; j++) for (let i = 0; i < maze.width; i++)
        {
            if (i >= maze.width - 1 && j >= maze.height - 1) return

            if (i >= maze.width - 1) maze.enable([i, j], [i, j + 1])
            else if (j >= maze.height - 1) maze.enable([i, j], [i + 1, j])
            else maze.enable([i, j], Math.random() < 0.5 ? [i + 1, j] : [i, j + 1])

            yield
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.generate() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

    // private i: number = 0
    // private j: number = 0

    // public update()
    // {
    //     let maze = this.maze
    //     if (this.i >= maze.width - 1 && this.j >= maze.height - 1) return void (this.finished = true)

    //     if (this.i >= maze.width - 1) maze.enable([this.i, this.j], [this.i, this.j + 1])
    //     else if (this.j >= maze.height - 1) maze.enable([this.i, this.j], [this.i + 1, this.j])
    //     else maze.enable([this.i, this.j], Math.random() < 0.5 ? [this.i + 1, this.j] : [this.i, this.j + 1])

    //     this.i++
    //     if (this.i >= maze.width)
    //     {
    //         this.i = 0
    //         this.j++
    //     }
    // }

}
