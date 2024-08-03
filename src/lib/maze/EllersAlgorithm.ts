import Maze, { MazeProcess } from "./Maze"

export default class EllersAlgorithm extends MazeProcess
{

    public constructor(maze: Maze) { super(maze) }

    private *generate()
    {
        let maze = this.maze
    }

    private generator!: Generator<void, void, void>
    public override init() { this.generator = this.generate() }

    public override update()
    {
        if (this.generator.next().done) this.finished = true
    }

}
