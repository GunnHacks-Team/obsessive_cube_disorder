import RubiksCubeCanvas from "./RubiksCubeCanvas";
import RubiksCubeVirtual from "./RubiksCubeVirtual";
import { COLORS } from "./data/colors";
import Cross from "./cross";
import F2L from "./F2L";
import OLL from "./OLL";
import PLL from "./PLL";
class RubiksCube {
  constructor(colors) {
    const c = colors ? colors : COLORS;
    this.rc = new RubiksCubeVirtual(c);
    this.canvas = new RubiksCubeCanvas(50, c);
  }

  getCanvas() { return this.canvas.getCanvas(); }

  getMoves() {
    if (!(new Cross(this.rc)).solve()) return false;
    if (!(new F2L(this.rc)).solve()) return false;
    if (!(new OLL(this.rc)).solve()) return false;
    if (!(new PLL(this.rc)).solve()) return false;
    this.moves = this.rc.getMoves();
    return this.moves;
  }

  async next() {
    const move = this.moves[this.movePos++];
    this.rc.do(move);
    this.rcc.do(move);
  }

  async prev() {
    let move = this.moves[--this.movePos];
    if (move[1] === "'") move = move[0];
    else if (!move[1]) move += "'";
    this.rc.do(move);
    this.rcc.do(move);
  }
}

export default RubiksCube;