import { _decorator, Button, Component, EventTouch, instantiate, Label, Node, Prefab, tween, v2, v3, Vec2 } from 'cc';
import { DataManager } from './DataManager';
import { Grid_Size } from './Data';
import { TileManager } from './TileManager';
import { EndContentManager } from './EndContentManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab)
    tilePrefab: Prefab = null;

    @property(Prefab)
    startContentPrefab: Prefab = null;

    @property(Prefab)
    endContentPrefab: Prefab = null;

    @property(Node)
    gridNode: Node = null;

    @property(Node)
    PannelNode: Node = null;

    @property(Label)
    curLabel: Label = null;

    @property(Label)
    maxLabel: Label = null;

    @property(Button)
    endBtn: Button = null;

    moveDistance: number = 40;

    isMove: boolean = false;

    onLoad() {
        this.endBtn.node.on('click', this.CreateEndContent, this);
        this.PannelNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.PannelNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    start() {
        this.resetGame();
    }

    resetGame() {
        this.gridNode.removeAllChildren();
        this.initData();
        this.initGrid();
        this.generateRandomTile();
        this.generateRandomTile();
    }

    initData() {
        DataManager.Instance.rset();
        this.curLabel.string = '0';
    }

    initGrid() {
        for (let i = 0; i < Grid_Size; i++) {
            for (let j = 0; j < Grid_Size; j++) {
                this.generateTile(0, i, j);
            }
        }
    }

    generateTile(value: number, x: number, y: number) {
        const tile = instantiate(this.tilePrefab);
        tile.getComponent(TileManager).generateTile(value, x, y);
        tile.setParent(this.gridNode);
        DataManager.Instance.tile[x][y] = tile;
        DataManager.Instance.tile_Value[x][y] = value;
    }

    generateRandomTile() {
        const value = Math.random() < 0.6 ? 2 : 4;

        const emptyArr: Vec2[] = [];

        for (let i = 0; i < Grid_Size; i++) {
            for (let j = 0; j < Grid_Size; j++) {
                if (DataManager.Instance.tile_Value[i][j] == 0) {
                    emptyArr.push(v2(i, j));
                }
            }
        }
        const tilePos = emptyArr[Math.floor(Math.random() * emptyArr.length)];
        this.generateTile(value, tilePos.x, tilePos.y);
    }

    onTouchStart(event: EventTouch) {
        this.isMove = false;
    }

    onTouchMove(event: EventTouch) {
        if (this.isMove) return;
        let moveDir = event.getLocation().subtract(event.getStartLocation());
        if (Math.abs(moveDir.x) > this.moveDistance) {
            if (moveDir.x > 0) {
                this.MoveRight();
            }
            else {
                this.MoveLeft();
            }
            this.isMove = true;
        }
        else if (Math.abs(moveDir.y) > this.moveDistance) {
            if (moveDir.y > 0) {
                this.MoveUp();
            }
            else {
                this.MoveDown();
            }
            this.isMove = true;
        }

    }

    MoveRight() {
        let moved = false;
        for (let j = 0; j < Grid_Size; j++) {
            let lastIndex = Grid_Size - 1;
            for (let i = Grid_Size - 1; i >= 0; i--) {
                let value = DataManager.Instance.tile_Value[i][j];
                if (i == lastIndex || value == 0) {
                    continue;
                }

                if (DataManager.Instance.tile_Value[lastIndex][j] == 0) {
                    this.moveTile(i, j, lastIndex, j);
                    moved = true;
                }
                else {
                    if (value == DataManager.Instance.tile_Value[lastIndex][j]) {
                        this.mergeTile(i, j, lastIndex, j);
                        lastIndex--;
                        moved = true;
                    }
                    else {
                        if (i + 1 == lastIndex) {
                            lastIndex--;
                        } else {
                            lastIndex--;
                            this.moveTile(i, j, lastIndex, j);
                            moved = true;
                        }
                    }
                }
            }
        }
        if (moved) {
            this.generateRandomTile();
        }

    }

    MoveLeft() {
        let moved = false;
        for (let j = 0; j < Grid_Size; j++) {
            let lastIndex = 0;
            for (let i = 0; i < Grid_Size; i++) {
                let value = DataManager.Instance.tile_Value[i][j];
                if (i == lastIndex || value == 0) {
                    continue;
                }

                if (DataManager.Instance.tile_Value[lastIndex][j] == 0) {
                    this.moveTile(i, j, lastIndex, j);
                    moved = true;
                }
                else {
                    if (value == DataManager.Instance.tile_Value[lastIndex][j]) {
                        this.mergeTile(i, j, lastIndex, j);
                        lastIndex++;
                        moved = true;
                    } else {
                        if (i - 1 == lastIndex) {
                            lastIndex++;
                        } else {
                            lastIndex++;
                            this.moveTile(i, j, lastIndex, j);
                            moved = true;
                        }
                    }
                }
            }
        }
        if (moved) {
            this.generateRandomTile();
        }

    }

    MoveUp() {
        let moved = false;
        for (let i = 0; i < Grid_Size; i++) {
            let lastIndex = Grid_Size - 1;
            for (let j = Grid_Size - 1; j >= 0; j--) {
                let value = DataManager.Instance.tile_Value[i][j];
                if (j == lastIndex || value == 0) {
                    continue;
                }

                if (DataManager.Instance.tile_Value[i][lastIndex] == 0) {
                    this.moveTile(i, j, i, lastIndex);
                    moved = true;
                } else {
                    if (value == DataManager.Instance.tile_Value[i][lastIndex]) {
                        this.mergeTile(i, j, i, lastIndex);
                        lastIndex--;
                        moved = true;
                    } else {
                        if (j + 1 == lastIndex) {
                            lastIndex--;
                        } else {
                            lastIndex--;
                            this.moveTile(i, j, i, lastIndex);
                            moved = true;
                        }
                    }
                }
            }
        }
        if (moved) {
            this.generateRandomTile();
        }
    }

    MoveDown() {
        let moved = false;
        for (let i = 0; i < Grid_Size; i++) {
            let lastIndex = 0;
            for (let j = 0; j < Grid_Size; j++) {
                let value = DataManager.Instance.tile_Value[i][j];
                if (j == lastIndex || value == 0) {
                    continue;
                }

                if (DataManager.Instance.tile_Value[i][lastIndex] == 0) {
                    this.moveTile(i, j, i, lastIndex);
                    moved = true;
                } else {
                    if (value == DataManager.Instance.tile_Value[i][lastIndex]) {
                        this.mergeTile(i, j, i, lastIndex);
                        lastIndex++;
                        moved = true;
                    } else {
                        if (j - 1 == lastIndex) {
                            lastIndex++;
                        } else {
                            lastIndex++;
                            this.moveTile(i, j, i, lastIndex);
                            moved = true;
                        }
                    }
                }
            }
        }
        if (moved) {
            this.generateRandomTile();
        }
    }

    moveTile(x: number, y: number, targetX: number, targetY: number) {
        DataManager.Instance.tile[targetX][targetY] = DataManager.Instance.tile[x][y];
        DataManager.Instance.tile[x][y] = null;
        DataManager.Instance.tile_Value[targetX][targetY] = DataManager.Instance.tile_Value[x][y];

        DataManager.Instance.tile_Value[x][y] = 0;

        const tile = DataManager.Instance.tile[targetX][targetY];
        tile.getComponent(TileManager).moveTile(targetX, targetY);
    }

    mergeTile(x: number, y: number, targetX: number, targetY: number) {
        const value = DataManager.Instance.tile_Value[x][y];
        DataManager.Instance.tile[x][y].getComponent(TileManager).moveTile(targetX, targetY);
        DataManager.Instance.tile[x][y].getComponent(TileManager).destroyTile();
        //所有的数据重置后需要重新赋空 不然会报错
        DataManager.Instance.tile[x][y] = null;
        DataManager.Instance.tile_Value[x][y] = 0;

        DataManager.Instance.tile[targetX][targetY].getComponent(TileManager).destroyTile();
        DataManager.Instance.tile[targetX][targetY] = null;
        DataManager.Instance.tile_Value[targetX][targetY] = 0;

        this.generateTile(value * 2, targetX, targetY);
        this.updataScore(value * 2);
    }

    updataScore(score) {
        DataManager.Instance.curscore += score;
        if (DataManager.Instance.curscore >= DataManager.Instance.maxscore) {
            DataManager.Instance.maxscore = DataManager.Instance.curscore;
        }
        this.curLabel.string = DataManager.Instance.curscore.toString();
        this.maxLabel.string = DataManager.Instance.maxscore.toString();
    }

    CreateEndContent() {
        const endContent = instantiate(this.endContentPrefab);
        endContent.setParent(this.node);
        endContent.setPosition(0, -2000);
        tween(endContent)
            .to(0.3, { position: v3(0, 0, 0) })
            .start();


        // endContent.getComponent(EndContentManager).addListener( this.resetGame );  这样不行
        endContent.getComponent(EndContentManager).addResetListener(() => { this.resetGame() });
    }

    CreateStartContent() {
        const startContent = instantiate(this.startContentPrefab);
        startContent.setParent(this.node);

    }



}


