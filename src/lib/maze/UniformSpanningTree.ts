import Maze, { MazeProcess } from "./Maze"

export class AldousBroderAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private readonly visited: boolean[][] = []
    private unvisited!: number

    private position!: [number, number]

    public override init()
    {
        let maze = this.maze
        maze.reset()

        for (let i = 0; i < maze.width; i++)
        {
            this.visited[i] = []
            for (let j = 0; j < maze.height; j++) this.visited[i][j] = false
        }

        this.unvisited = maze.width * maze.height - 1

        let i = Math.floor(Math.random() * maze.width), j = Math.floor(Math.random() * maze.height)
        this.visited[i][j] = true
        this.position = [i, j]
    }

    public override update()
    {
        if (this.unvisited <= 0) return void (this.finished = true)

        let maze = this.maze
        let [i, j] = this.position

        let edges = maze.nodes[i][j].edges
        let edge = edges[Math.floor(Math.random() * edges.length)]

        let [k, l] = this.position = edge.node
        if (!this.visited[k][l])
        {
            this.visited[k][l] = true
            this.unvisited--
            maze.enable([i, j], [k, l])
        }
    }

    public override render(c: CanvasRenderingContext2D)
    {
        let maze = this.maze

        let w = c.canvas.width / (2 * maze.width + 1), h = c.canvas.height / (2 * maze.height + 1)
        let [i, j] = this.position

        c.fillStyle = "#0000ff"
        c.fillRect((2 * i + 1) * w, (2 * j + 1) * h, w + 1, h + 1)
    }

}

const enum State { NULL, WALK, MAZE }
export class WilsonsAlgorithm extends MazeProcess
{
    
    public constructor(maze: Maze) { super(maze) }

    private readonly available: [number, number][] = []
    private readonly state: State[][] = []

    private walk: [number, number][] = []

    public override init()
    {
        let maze = this.maze
        maze.reset()

        for (let i = 0; i < maze.width; i++)
        {
            this.state[i] = []
            for (let j = 0; j < maze.height; j++) this.state[i][j] = State.NULL, this.available.push([i, j])
        }

        let [i, j] = this.choose()!

        this.state[i][j] = State.MAZE
        maze.nodes[i][j].enabled = true
        this.reset()
    }

    public override update()
    {
        let maze = this.maze
        let [i, j] = this.walk[this.walk.length - 1]

        let edges = maze.nodes[i][j].edges
        let edge = edges[Math.floor(Math.random() * edges.length)]

        let [k, l] = edge.node
        if (this.state[k][l] === State.WALK) this.removeLoop(edge.node)
        else if (this.state[k][l] === State.MAZE)
        {
            for (let n = 0; n < this.walk.length; n++)
            {
                if (n < this.walk.length - 1) maze.enable(this.walk[n], this.walk[n + 1])

                let [i, j] = this.walk[n]
                this.state[i][j] = State.MAZE
            }

            maze.enable(this.walk[this.walk.length - 1], edge.node)
            this.reset()
        }
        else
        {
            this.walk.push(edge.node)
            this.state[k][l] = State.WALK
        }
    }

    private reset()
    {
        let position = this.choose()
        if (position === null) return void (this.finished = true)

        let [i, j] = position
        if (this.state[i][j] === State.MAZE) return void this.reset()

        this.walk = [position]
        this.state[i][j] = State.WALK
    }

    private choose(): [number, number] | null
    {
        if (this.available.length === 0) return null

        let index = Math.floor(Math.random() * this.available.length)
        let position = this.available[index]

        this.available.splice(index, 1)
        return position
    }

    private removeLoop([i, j]: [number, number])
    {
        let stuff = []
        for (let n = this.walk.length - 1; n >= 0; n--)
        {
            let [k, l] = this.walk[n]
            if (i === k && j === l) break

            this.walk.pop()
            this.state[k][l] = State.NULL

            stuff.push([k, l])
            if (n === 0) console.log([i, j], stuff, this.state[i][j])
        }
    }
    
    public override render(c: CanvasRenderingContext2D)
    {
        if (this.walk.length < 1) return

        let maze = this.maze
        let w = c.canvas.width / (2 * maze.width + 1), h = c.canvas.height / (2 * maze.height + 1)

        c.fillStyle = "#0000ff"
        if (this.walk.length === 1)
        {
            let [i, j] = this.walk[0]
            c.fillRect((2 * i + 1) * w, (2 * j + 1) * h, w + 1, h + 1)
        }
        else for (let n = 0; n < this.walk.length - 1; n++)
        {
            let [i, j] = this.walk[n], [k, l] = this.walk[n + 1]
            if (i === k) c.fillRect((2 * i + 1) * w, (2 * Math.min(j, l) + 1) * h, w + 1, 3 * h + 1)
            else if (j === l) c.fillRect((2 * Math.min(i, k) + 1) * w, (2 * j + 1) * h, 3 * w + 1, h + 1)
        }
    }

}
