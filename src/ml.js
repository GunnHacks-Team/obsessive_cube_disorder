class Matrix {
	constructor(rows, cols, defaultValue = 0, data = null) {
		if (data == null) {
			this.data = [];
			for (let i = 0; i < rows; i++) {
				this.data.push([]);
				for (let j = 0; j < cols; j++)
					this.data[i][j] = defaultValue;
			}
		} else {
			this.data = data;
		}
		this.rows = this.data.length;
		this.cols = this.data[0].length;
	}
	equalDimensions(other) {
		return this.rows == other.rows && this.cols == other.cols;
	}
	add(other) {
		let result = new Matrix(this.rows, this.cols);
		if (other instanceof Matrix) {
			if (!this.equalDimensions(other))
				throw new Error("Matrix dimensions must be the same when adding: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					result.data[i][j] = this.data[i][j] + other.data[i][j];
			return result;
		} else if (typeof other === "number") {
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					result.data[i][j] = this.data[i][j] + other;
			return result;
		}
		throw new Error("Cannot add matrix and " + typeof other);
	}
	multiply(other) {
		let result = new Matrix(this.rows, this.cols);
		if (other instanceof Matrix) {
			if (!this.equalDimensions(other))
				throw new Error("Matrix dimensions must be the same when multiplying: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					result.data[i][j] = this.data[i][j] * other.data[i][j];
			return result;
		} else if (typeof other === "number") {
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					result.data[i][j] = this.data[i][j] * other;
			return result;
		}
		throw new Error("Cannot multiply matrix and " + typeof other);
	}
	subtract(other) {
		if (other instanceof Matrix) {
			if (!this.equalDimensions(other))
				throw new Error("Matrix dimensions must be the same when subtracting: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
			return this.add(other.multiply(-1));
		} else if (typeof other === "number") {
			return this.add(-other);
		}
		throw new Error("Cannot subtract matrix and " + typeof other);
	}
	divide(other) {
		if (other instanceof Matrix) {
			if (!this.equalDimensions(other))
				throw new Error("Matrix dimensions must be the same when dividing: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
			return this.multiply(other.inverse());
		} else if (typeof other === "number") {
			return this.multiply(1 / other);
		}
		throw new Error("Cannot divide matrix and " + typeof other);
	}
	dot(other) {
		if (other instanceof Matrix) {
			if (this.cols != other.rows)
				throw new Error("Matrix dimensions must be compatible for dot product: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
			let result = new Matrix(this.rows, other.cols);
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < other.cols; j++)
					for (let k = 0; k < this.cols; k++)
						result.data[i][j] += this.data[i][k] * other.data[k][j];
			return result;
		}
		throw new Error("Cannot dot matrix and " + typeof other);
	}
	addVector(other) {
		if (other instanceof Matrix) {
			if (other.rows == 1 && this.cols == other.cols) {
				let result = new Matrix(this.rows, this.cols);
				for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
				result.data[i][j] = this.data[i][j] + other.data[0][j];
				return result;
			} else if (other.cols == 1 && this.rows == other.rows) {
				let result = new Matrix(this.rows, this.cols);
				for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
				result.data[i][j] = this.data[i][j] + other.data[i][0];
				return result;
			}
			throw new Error("Matrix dimensions must be compatible for matrix-vector addition: " + this.rows + "x" + this.cols + " vs " + other.rows + "x" + other.cols);
		}
		throw new Error("Cannot matrix and " + typeof other);
	}
	inverse() {
		let result = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result.data[i][j] = 1 / this.data[i][j];
		return result;
	}
	max() {
		let max = this.data[0][0];
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				if (this.data[i][j] > max) max = this.data[i][j];
		return max;
	}
	oneHot() {
		if (this.rows == 1) {
			let max = this.max();
			let result = new Matrix(max + 1, this.cols);
			for (let i = 0; i < this.cols; i++)
				result.data[this.data[0][i]][i] = 1;
			return result;
		} else if (this.cols == 1) {
			let max = this.max();
			let result = new Matrix(this.rows, max + 1);
			for (let i = 0; i < this.rows; i++)
				result.data[i][this.data[i][0]] = 1;
			return result;
		}
		throw new Error("Cannot convert matrix to one-hot vector");
	}
	sum(axis) {
		if (axis == "row") {
			// collapse all of the rows into a single vector into shape (1, cols)
			let result = new Matrix(1, this.cols);
			for (let i = 0; i < this.cols; i++)
				for (let j = 0; j < this.rows; j++)
					result.data[0][i] += this.data[j][i];
			return result;
		} else if (axis == "col") {
			// collapse all of the columns into a single vector into shape (rows, 1)
			let result = new Matrix(this.rows, 1);
			for (let i = 0; i < this.rows; i++)
				for (let j = 0; j < this.cols; j++)
					result.data[i][0] += this.data[i][j];
			return result;
		}
	}
	T() {
		let result = new Matrix(this.cols, this.rows);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result.data[j][i] = this.data[i][j];
		return result;
	}
	randomize() {
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				this.data[i][j] = Math.random() * 2 - 1;
	}
	sigmoid() {
		let result = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result.data[i][j] = 1 / (1 + Math.exp(-this.data[i][j]));
		return result;
	}
	sigmoidPrime() {
		let part1 = this.sigmoid();
		let part2 = this.sigmoid().multiply(-1).add(1);
		return part1.multiply(part2);
	}
	pow(n) {
		let result = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result.data[i][j] = Math.pow(this.data[i][j], n);
		return result;
	}
	mean() {
		let result = 0;
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result += this.data[i][j];
		return result / (this.rows * this.cols);
	}
	print(name = null) {
		let out = "";
		if (name != null) out += name + " " + this.data.length + "x" + this.data[0].length + ":\n";
		else out += "Matrix " + this.data.length + "x" + this.data[0].length + ":\n";
		for (let i = 0; i < this.data.length; i++) {
			for (let j = 0; j < this.data[i].length; j++) out += this.data[i][j] + " ";
			out += "\n";
		}
		console.log(out);
	}
}

class MulticlassClassifier {
	constructor(X, y, structure) {
		/* Input:
			X: rows: fearures, cols: samples
			y: rows: 1, cols: samples
			y(after): rows: classes, cols: samples
		*/
		this.X = X;
		this.y = y;
		this.structure = structure;
		if (this.structure[this.structure.length - 1] != this.y.rows)
			throw new Error("Last layer size must be equal to number of classes");
		this.A = [];
		this.W = [];
		this.B = [];
		this.D = [];

		// initialize W and B
		for (let i = 0; i < this.structure.length - 1; i++) {
			this.W[i] = new Matrix(this.structure[i + 1], this.structure[i]);
			this.B[i] = new Matrix(this.structure[i + 1], 1);
			this.W[i].randomize();
			this.B[i].randomize();
		}
	}

	forward(X) {
		this.A = [X];
		this.Z = [null];
		for (let i = 0; i < this.W.length; i++) {
			this.Z.push(this.W[i].dot(this.A[i]).addVector(this.B[i]));
			this.A.push(this.Z[i + 1].sigmoid());
		}
		return this.A[this.A.length - 1];
	}

	backward(Y) {
		let d = this.A[this.A.length - 1].subtract(Y);
		d = d.multiply(this.Z[this.Z.length - 1].sigmoidPrime());
		this.D = [d]; // d is the partial derivative of the cost function with respect to the last layer
		for (let i = this.A.length - 2; i >= 1; i--) { // go backwards from the second to last layer (we have the partial derivatives of the cost function with respect to the last layer)
			let wd = this.W[i].T().dot(d);
			d = wd.multiply(this.Z[i].sigmoidPrime());
			this.D.push(d);
		}
		this.D.push('d');
		this.D.reverse();
	}
	update() {
		for (let i = 0; i < this.structure.length - 1; i++) {
			this.W[i] = this.W[i].subtract(this.D[i + 1].dot(this.A[i].T()).multiply(this.learningRate));
			this.B[i] = this.B[i].subtract(this.D[i + 1].sum("col").multiply(this.learningRate));
		}
	}
	train(X, Y, epochs = 10000, learningRate = 0.01) {
		this.learningRate = learningRate;
		for (let i = 0; i < epochs; i++) {
			this.forward(X);
			this.backward(Y);
			this.update();
			if (i % 100 == 0) {
				console.log("Epoch " + i + ": " + this.mse(Y));
			}
		}
	}
	mse(Y) {
		let mse = 0;
		for (let i = 0; i < Y.rows; i++)
			for (let j = 0; j < Y.cols; j++)
				mse += Math.pow(this.A[this.A.length - 1].data[i][j] - Y.data[i][j], 2);
		return mse / (Y.rows * Y.cols);
	}
	printWeights() {
		for (let i = 0; i < this.W.length; i++) {
			this.W[i].print("W" + (i + 1));
			this.B[i].print("B" + (i + 1));
			this.D[i + 1].print("D" + (i + 1));
			this.A[i].print("A" + (i + 1));
		}
	}
	
}

let X = new Matrix(null, null, null, [
	[0, 0],
	[0, 1],
	[1, 0],
	[1, 1]
]);
let y = new Matrix(null, null, null, [
	[0],
	[1],
	[2],
	[3]
]);
X = X.T();
y = y.oneHot();
y = y.T();
let structure = [2, 5, 5, 4];
let classifier = new MulticlassClassifier(X, y, structure);
classifier.train(X, y);

export default Matrix;