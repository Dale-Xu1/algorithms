import Maze, { MazeProcess } from "./Maze"

export class SidewinderAlgorithm extends MazeProcess
{

    public constructor(maze: Maze, private readonly bias: number = 0.5) { super(maze) }

    private *generate()
    {
        let maze = this.maze
        for (let i = 0; i < maze.width - 1; i++) maze.enable([i, 0], [i + 1, 0]), yield

        for (let j = 1; j < maze.height; j++)
        {
            let start = 0
            for (let i = 0; i < maze.width; i++)
            {
                if (Math.random() < this.bias || i >= maze.width - 1)
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

export class BinaryTreeAlgorithm extends MazeProcess
{

    public constructor(maze: Maze, private readonly bias: number = 0.5) { super(maze) }

    private *generate()
    {
        let maze = this.maze
        for (let j = 0; j < maze.height; j++) for (let i = 0; i < maze.width; i++)
        {
            if (i === 0 && j === 0) continue

            if (i === 0) maze.enable([i, j], [i, j - 1])
            else if (j === 0) maze.enable([i, j], [i - 1, j])
            else maze.enable([i, j], Math.random() < this.bias ? [i, j - 1] : [i - 1, j])

            yield
        }
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.generate() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}
