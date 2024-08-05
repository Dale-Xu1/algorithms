import Maze, { MazeProcess } from "./Maze"

const enum Direction { HORIZONTAL, VERTICAL }
export class RecursiveDivision extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private *generate(x: number, y: number, w: number, h: number): Generator<void, void, void>
    {
        if (w <= 1 || h <= 1) return
        let maze = this.maze

        let direction: Direction
        if (w < h) direction = Direction.HORIZONTAL
        else if (w > h) direction = Direction.VERTICAL
        else direction = Math.random() < 0.5 ? Direction.HORIZONTAL : Direction.VERTICAL

        yield
        if (direction === Direction.HORIZONTAL)
        {
            let j = y + Math.floor(Math.random() * (h - 1))
            let empty = Math.floor(Math.random() * w)
            for (let i = 0; i < w; i++) if (i !== empty) maze.disable([x + i, j], [x + i, j + 1])

            let z = j - y + 1
            yield *this.generate(x, y, w, z)
            yield *this.generate(x, j + 1, w, h - z)
        }
        else
        {
            let i = x + Math.floor(Math.random() * (w - 1))
            let empty = Math.floor(Math.random() * h)
            for (let j = 0; j < h; j++) if (j !== empty) maze.disable([i, y + j], [i + 1, y + j])

            let z = i - x + 1
            yield *this.generate(x, y, z, h)
            yield *this.generate(i + 1, y, w - z, h)
        }
    }

    private generator!: Generator<void, void, void>
    public override init()
    {
        this.maze.reset()
        this.maze.empty()
        this.generator = this.generate(0, 0, this.maze.width, this.maze.height)
    }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}
