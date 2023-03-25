export class gameResult {
    constructor(
        private _opponent: string,
        private _isWinner: boolean,
        private _myScore: number,
        private _opScore: number,
        private _description: string,
    ) {
        this._opponent = _opponent
        this._isWinner = _isWinner
        this._myScore = _myScore
        this._opScore = _opScore
        this._description = _description
    }
    public get opponent(): string {
        return this._opponent
    }
    public set opponent(value: string) {
        this._opponent = value
    }
    public get isWinner(): boolean {
        return this._isWinner
    }
    public set isWinner(value: boolean) {
        this._isWinner = value
    }
    public get myScore(): number {
        return this._myScore
    }
    public set myScore(value: number) {
        this._myScore = value
    }
    public get opScore(): number {
        return this._opScore
    }
    public set opScore(value: number) {
        this._opScore = value
    }
    public get description(): string {
        return this._description
    }
    public set description(value: string) {
        this._description = value
    }
}
