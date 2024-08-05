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

export class WilsonsAlgorithm
{
    
}
