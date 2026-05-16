import { _decorator, Component, Label, Node, resources, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { Grid_Size, margin_Width, Pannel_Width, Tile, tile_Width } from './Data';
const { ccclass, property } = _decorator;

@ccclass('TileManager')
export class TileManager extends Component {

    @property(Label)
    valueLabel: Label = null;

    @property(Sprite)
    bgSprite: Sprite = null;

    start() {

    }

    generateTile(value: number, x: number, y: number) {
        this.node.setPosition(this.getPos(x, y));
        this.CreateAnim();
        this.initTile(value);

    }


    initTile(value: number) {
        value == 0 ? this.valueLabel.string = "" : this.valueLabel.string = value.toString();
        resources.load(Tile[value] + "/spriteFrame", SpriteFrame, (err: any, spriteFrame: SpriteFrame) => {
            this.bgSprite.spriteFrame = spriteFrame;
        })
    }

    getPos(x: number, y: number) {
        let TileWidth = (Pannel_Width - margin_Width * 2) / Grid_Size;
        let startPos = margin_Width + tile_Width / 2;
        return v3(startPos + TileWidth * x, startPos + TileWidth * y);
    }

    CreateAnim() {
        this.node.scale = v3(0, 0, 0);
        tween(this.node)
            .delay(0.2)
            .to(0.3, { scale: v3(1, 1, 1) })
            .start();
    }

    moveTile(x: number, y: number) {
        tween(this.node).to(0.3, { position: this.getPos(x, y) }).start();
    }

    destroyTile() {
        tween(this.node)
            .delay(0.3)
            .call(() => {
                this.node.destroy()
            })
            .start()
    }

}


