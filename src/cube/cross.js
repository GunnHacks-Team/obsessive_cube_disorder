const algs = [
  { face: "front", pos: 1, moves: "F D R'" },
  { face: "front", pos: 5, moves: "D R'" },
  { face: "front", pos: 7, moves: "F' D R'" },
  { face: "right", pos: 3, moves: "F" },
  { face: "up", pos: 7, moves: "F2" },
];

class Cross {
  constructor(cube) {
    Object.assign(this, { cube });
    this.dc = this.cube.colors.down[4];
  }

  isSolved() {
    return this.isCross() && this.matches() === 4;
  }

  isCross() {
    let ans = 0;
    for (const pos of [1, 3, 5, 7]) {
      if (this.cube.colors.down[pos] === this.dc) ans++;
    }
    return ans === 4;
  }

  matches() {
    let ans = 0;
    for (let i = 0; i < 4; i++) {
      if (this.cube.colors.front[7] === this.cube.colors.front[4]) ans++;
      this.cube.do('Y');
    }
    return ans;
  }

  solve() {
    while (!this.isCross()) {
      for (const alg of algs) {
        const { face, pos, moves } = alg;
        if (this.cube.colors[face][pos] === this.dc) {
          while (this.cube.colors.down[1] === this.dc) this.cube.do("D");
          this.cube.do(moves);
        }
      }
      this.cube.do('Y');
    }

    while (this.matches() < 2) this.cube.do('D');
    if (this.matches() !== 4) {
      while (this.cube.colors.front[7] === this.cube.colors.front[4]) this.cube.do('Y');
      if (this.cube.colors.back[7] !== this.cube.colors.back[4]) this.cube.do("R2 L2 D2 R2 L2");
      else if (this.cube.colors.right[7] !== this.cube.colors.right[4]) this.cube.do("X2 R U R' U' R X2");
      else this.cube.do("Y' X2 R U R' U' R X2");
    }

    return this.isSolved();
  }
}

export default Cross;