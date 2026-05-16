import { Grid_Size } from "./Data";
import { Node } from "cc";

export class DataManager {
    public static _instance: DataManager = null;
    public static get Instance(): DataManager {
        if (this._instance == null) {
            this._instance = new DataManager();
        }
        return this._instance;
    }


    tile_Value: number[][] = [];

    tile: Node[][] = [];

    curscore: number = 0;
    maxscore: number = 0;

    rset() {
        for (let i = 0; i < Grid_Size; i++) {
            this.tile_Value[i] = [];
            this.tile[i] = [];
            for (let j = 0; j < 4; j++) {
                this.tile_Value[i][j] = 0;
                this.tile[i][j] = null;
            }
        }
        this.curscore = 0;
    }

}


