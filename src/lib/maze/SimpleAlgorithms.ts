import Maze, { Edge, MazeProcess } from "./Maze"

export class DepthFirstSearch extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly visited: boolean[][] = []

    private position!: [number, number]
    private stack: [number, number][] = []

    public init()
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

    public update()
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
    private position!: [number, number]

    public init()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width; i++)
        {
            this.visited[i] = []
            for (let j = 0; j < maze.height; j++) this.visited[i][j] = false
        }

        this.visited[0][0] = true
        this.position = [0, 0]
    }

    public update()
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
            let node = this.find()
            if (node === null) return void (this.finished = true)

            this.position = node
            return void this.update()
        }

        let [k, l] = this.position = min.node
        this.visited[k][l] = true
        maze.enable([i, j], [k, l])
    }

    private find(): [number, number] | null
    {
        let maze = this.maze
        for (let j = 0; j < maze.height; j++) for (let i = 0; i < maze.width; i++)
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
