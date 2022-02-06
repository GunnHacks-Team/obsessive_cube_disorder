import React from 'react';
import { Matrix, MulticlassClassifier } from '../ml.js';
import trainedModel from '../training.js';

class Capture extends React.Component {
	constructor(props) {
		console.clear();
		super(props);
		// this.state = {
		// 	// classifier: new MulticlassClassifier(null, null, [3, 16, 16, 3]),
		// };
		this.captureImage = this.captureImage.bind(this);
	}
	makeVideo() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false })
			.then(stream => {
				this.video.srcObject = stream;
				this.video.play();
			})
			.catch(err => {
				console.log(err);
			});
		return (
			<div id="video-container">
				<video id="video" ref={(video) => { this.video = video; }}></video>
			</div>
		);
	}
	captureImage() {
		let { imageData, size } = this.getImageData();
		let scaledImageData = this.getScaledImageData(imageData, size);
		this.printImageData(scaledImageData);
		let classifiedImageData = this.getClassifiedImageData(scaledImageData);
		this.printClassifiedImageData(classifiedImageData);
		let slicedClassifiedImageData = this.getSlicedClassifiedImageData(classifiedImageData);
		let averagedClassifiedImageData = this.getAveragedClassifiedImageData(slicedClassifiedImageData);
		let side = this.getSide(averagedClassifiedImageData);
		console.log(side);
	}
	getSide(averagedClassifiedImageData) {
		let side = new Matrix(3, 3);
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				side.data[i][j] = averagedClassifiedImageData[i * 3 + j].data[0][0];
			}
		}
		return side.reshape(1, 9).data;
	}
	getAveragedClassifiedImageData(slicedClassifiedImageData) {
		let averagedClassifiedImageData = [];
		for (let i = 0; i < slicedClassifiedImageData.length; i++) {
			// get the most frequent class
			let frequency = slicedClassifiedImageData[i].maxFrequency();
			averagedClassifiedImageData.push(frequency);
		}
		return averagedClassifiedImageData;
	}
	getSlicedClassifiedImageData(classifiedImageData) {
		// reshape into a square
		let size = Math.sqrt(classifiedImageData.data[0].length);
		console.log("size", size);
		classifiedImageData = classifiedImageData.reshape(size, size);
		// slice
		let sliced = [];
		let squareSize = size / 3;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				sliced.push(classifiedImageData.slice(i * squareSize, (i + 1) * squareSize, j * squareSize, (j + 1) * squareSize));	
			}
		}
		return sliced;
	}
	getImageData() {
		// Get the Image
		let video = document.getElementById('video');
		let canvas = document.getElementById('canvas');
		canvas.width = video.videoHeight;
		canvas.height = video.videoHeight;
		let context = canvas.getContext('2d');
		let w = video.videoWidth;
		let h = video.videoHeight;
		context.drawImage(video, (w - h) / 2, 0, h, h, 0, 0, h, h);
		let size = canvas.width;
		let image = context.getImageData(0, 0, size, size);
		let imageData = image.data;
		return { imageData, size };
	}
	printImageData(imageData) {
		// print to output
		let output = document.getElementById('output');
		let outPutString = "";
		for (let i = 0; i < imageData.length; i++) {
			for (let j = 0; j < imageData[i].length; j++) {
				outPutString += `<span style="color:rgb(${imageData[i][j][0]},${imageData[i][j][1]},${imageData[i][j][2]})">█</span>`;
			}
			outPutString += "<br/>";
		}
		output.innerHTML = outPutString;
	}
	getClassifiedImageData(imageData) {
		let X = this.imageDataToX(imageData);
		let y = trainedModel.predict(X);
		let {result, index} = y.maxDim("row");
		return index;
	}
	printClassifiedImageData(imageData) {
		let output = document.getElementById('output');
		let outPutString = "<br/><br/>";
		let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
		let size = Math.sqrt(imageData.data[0].length);
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				outPutString += `<span style="color:${colors[imageData.get(i * size + j)]}">█</span>`;
			}
			outPutString += "<br/>";
		}
		output.innerHTML = outPutString;
	}
	imageDataToX(imageData) {
		let X = new Matrix(imageData.length, imageData[0].length);
		X.data = imageData;
		X = X.unravel();
		X.data = X.data.map(pixel => [pixel[0][0], pixel[0][1], pixel[0][2]]);
		X.cols = 3;
		return X.T();
	}
	getScaledImageData(imageData, size) {
		let data = [];
		for (let i = 0; i < size; i++) {
			data.push([]);
			for (let j = 0; j < size; j++) {
				let index = (i * size + j) * 4;
				data[i].push([imageData[index], imageData[index + 1], imageData[index + 2]]);
			}
		}
		// scale
		let scaled = [];
		let resolusion = 16;
		for (let i = 0; i < size; i += resolusion) {
			let row = [];
			for (let j = 0; j < size; j += resolusion)
				row.push(data[i][j]);
			scaled.push(row);
		}
		return scaled;
	}

	render() {
		return (
			<div id="main-content">
				{this.makeVideo()}
				<button id="capture-button" onClick={this.captureImage}>Capture</button>
				<br></br>
				<canvas id="canvas"></canvas>
				<p id="output"></p>
			</div>
		);
	}
};

export default Capture;