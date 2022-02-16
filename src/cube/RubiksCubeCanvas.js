import React from "react";
import Sketch from "react-p5";
import RubiksCube from "./RubiksCube";
import Cross from "./cross";
import F2L from "./F2L";
import OLL from "./OLL";
import PLL from "./PLL";
import RubiksCubeVisual from "./RubiksCubeVisual";
import { COLORS } from "./data/colors";

class RubiksCubeCanvas extends React.Component {
  constructor(props) {
    super(props);
    const colors = (props.colors ? props.colors : COLORS);
    console.log(props.colors);
    console.log()
    this.rc = new RubiksCube(50, colors);
    this.rcv = new RubiksCubeVisual(50, colors);
  }

  async do(move) {
    await this.rcv.do(move);
  }

  getSolve() {
    if (!(new Cross(this.rc)).solve()) return false;
    if (!(new F2L(this.rc)).solve()) return false;
    if (!(new OLL(this.rc)).solve()) return false;
    if (!(new PLL(this.rc)).solve()) return false;
    return this.rc.getMoves();
  }

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(canvasParentRef);

    this.camera = p5.createCamera();
    this.camRadius = 200;
    const a1 = Math.PI / 2, a2 = Math.PI / 2;
    const camX = Math.cos(a2) * Math.cos(a1), camY = Math.sin(a2), camZ = Math.cos(a2) * Math.sin(a1);
    this.camera.setPosition(this.camRadius * camX, this.camRadius * camY, this.camRadius * camZ);
    this.camera.lookAt(0, 0, 0);

    // let safety = 0;
    // while (safety++ < 5000) {

    // let sc = this.rc.scramble(30);
    // console.log(sc);

    const cross = new Cross(this.rc);
    cross.solve();
    const f2l = new F2L(this.rc);
    f2l.solve();
    const oll = new OLL(this.rc);
    oll.solve();
    const pll = new PLL(this.rc);
    pll.solve();

    // if (!pll.isSolved()) {
    //   console.log(this.rc.allMoves.join(' '));
    //   break;
    // }
    // console.log("fdsa");
    // }

    const moves = this.rc.getMoves();
    // for (let i = 0; i < 30; i++) this.rcv.do(sc[i]);

    window.onkeypress = e => {
      if (e.key === "n") this.do(moves.shift());
    }
  };

  draw = (p5) => {
    p5.background(51, 51, 51);
    const rMag = 5;
    const a1 = rMag * Math.PI / 2 * (p5.mouseX + p5.width / 2) / (p5.width / 2);
    const a2 = rMag * -Math.PI / 2 * (p5.mouseY - p5.height / 2) / (p5.height / 2);
    const camX = Math.cos(a2) * Math.cos(a1), camY = Math.sin(a2), camZ = Math.cos(a2) * Math.sin(a1);
    this.camera.setPosition(this.camRadius * camX, this.camRadius * camY, this.camRadius * camZ);
    this.camera.lookAt(0, 0, 0);

    // this.rc.draw(p5);
    this.rcv.draw(p5);
  };

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />;
  }
}

export default RubiksCubeCanvas;
