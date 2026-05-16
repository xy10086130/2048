import { _decorator, Button, Component, Label, Node, tween, v3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('startContentManager')
export class startContentManager extends Component {

    @property(Button)
    startBtn: Button = null;

    @property(Button)
    continueBtn: Button = null;

    @property(Label)
    maxLabel: Label;

    private callback: Function[] = [];

    start() {
        this.maxLabel.string = DataManager.Instance.maxscore.toString();
        this.startBtn.node.on('click', this.OnStartClick, this);
        this.continueBtn.node.on('click', this.OnContinueClick, this);

    }


    OnStartClick() {
        this.callback.forEach(callback => {
            callback();
        })
        tween(this.node)
            .to(0.3, { position: v3(0, 2000, 0) })
            .delay(0.2)
            .destroySelf()
            .start()
    }

    OnContinueClick() {
        tween(this.node)
            .to(0.3, { position: v3(0, 2000, 0) })
            .delay(0.2)
            .destroySelf()
            .start()
    }

    addResetListener(callback) {
        this.callback.push(callback);
    }

}


