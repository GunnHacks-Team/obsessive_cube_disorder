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
	inverse() {
		let result = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++)
			for (let j = 0; j < this.cols; j++)
				result.data[i][j] = 1 / this.data[i][j];
		return result;
	}
	printData(name = null) {
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

let a = new Matrix(2, 3, 4);
a.divide(2).printData("a");

export default Matrix;