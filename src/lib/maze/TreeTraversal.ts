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

        let edges: Edge[] = []
        for (let edge of maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.visited[k][l]) continue

            edges.push(edge)
        }

        if (edges.length === 0)
        {
            this.stack.pop()
            if (this.stack.length === 0) return void (this.finished = true)

            this.position = this.stack[this.stack.length - 1]
            return void this.update()
        }

        let edge = edges[Math.floor(Math.random() * edges.length)]
        let [k, l] = this.position = edge.node

        this.visited[k][l] = true
        this.stack.push(this.position)
        maze.enable([i, j], [k, l])
    }

}

export class BreadthFirstSearch extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly visited: boolean[][] = []
    private readonly active: [[number, number], [number, number]][] = []

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
        this.updateActive(i, j)
    }

    public override update()
    {
        if (this.active.length === 0) return void (this.finished = true)

        let index = Math.floor(Math.random() * this.active.length)
        let [to, from] = this.active[index]
        this.active.splice(index, 1)

        let [i, j] = to
        if (this.visited[i][j]) return void this.update()

        this.visited[i][j] = true
        this.updateActive(i, j)
        this.maze.enable(to, from)
    }

    private updateActive(i: number, j: number)
    {
        for (let edge of this.maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.visited[k][l]) continue

            this.active.push([edge.node, [i, j]])
        }
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

        let edges: Edge[] = []
        for (let edge of maze.nodes[i][j].edges)
        {
            let [k, l] = edge.node
            if (this.visited[k][l]) continue

            edges.push(edge)
        }

        if (edges.length === 0)
        {
            let node = this.find(this.last)
            if (node === null) return void (this.finished = true)

            this.position = this.last = node
            return void this.update()
        }

        let edge = edges[Math.floor(Math.random() * edges.length)]
        let [k, l] = this.position = edge.node

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
