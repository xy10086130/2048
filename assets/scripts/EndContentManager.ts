import { _decorator, Button, Component, instantiate, Label, Node, Prefab, tween, v3 } from 'cc';
import { BUILD } from 'cc/env';
import { startContentManager } from './startContentManager';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('EndContentManager')
export class EndContentManager extends Component {

    @property(Prefab)
    StartContent: Prefab;

    @property(Button)
    continueBtn: Button;

    @property(Button)
    gameOver: Button;

    @property(Button)
    startBtn: Button;

    @property(Label)
    curLabel: Label;

    @property(Label)
    maxLabel: Label;

    private callback: Function[] = [];

    start() {
        this.curLabel.string = DataManager.Instance.curscore.toString();
        this.maxLabel.string = DataManager.Instance.maxscore.toString();
        this.startBtn.node.on('click', this.OnStartClick, this);
        this.continueBtn.node.on('click', this.OnContinueClick, this);
        this.gameOver.node.on('click', this.OnGameOverClick, this);
    }

    OnStartClick() {
        const startContent = instantiate(this.StartContent);
        startContent.setParent(this.node.parent);
        startContent.setPosition(0, -2000);
        startContent.getComponent(startContentManager).addResetListener(this.callback[0]);

        tween(this.node)
            .to(0.3, { position: v3(0, 2000, 0) })
            .delay(0.2)
            .destroySelf()
            .start()

        tween(startContent)
            .to(0.3, { position: v3(0, 0, 0) })
            .delay(0.2)
            .start();



    }

    OnContinueClick() {
        tween(this.node)
            .to(0.3, { position: v3(0, 2000, 0) })
            .delay(0.2)
            .destroySelf()
            .start()
    }

    OnGameOverClick() {
        this.callback.forEach(callback => {
            callback();
        })

        tween(this.node)
            .to(0.3, { position: v3(0, 2000, 0) })
            .delay(0.2)
            .destroySelf()
            .start()
    }

    addResetListener(callback: Function) {
        this.callback.push(callback);
    }





}


