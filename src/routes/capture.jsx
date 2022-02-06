import React from 'react';
import { Matrix, MulticlassClassifier } from '../ml.js';

class Capture extends React.Component {
	constructor(props) {
		console.clear();
		super(props);
		this.state = {
			classifier: new MulticlassClassifier(null, null, [3, 16, 16, 3]),
		};
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
		// Get the Image
		let video = document.getElementById('video');
		let canvas = document.getElementById('canvas');
		canvas.width = video.videoHeight;
		canvas.height = video.videoHeight;
		let context = canvas.getContext('2d');
		let w = video.videoWidth;
		let h = video.videoHeight;
		context.drawImage(video, (w-h)/2,0,h,h,  0,0,h,h);
		let size = canvas.width;
		let image = context.getImageData(0, 0, size, size);
		let imageData = image.data;
		
		// Parse the data
		let data = [];
		for (let i = 0; i < size; i++) {
			data.push([]);
			for (let j = 0; j < size; j++) {
				let index = (i * size + j) * 4;
				data[i].push([imageData[index], imageData[index+1], imageData[index+2]]);
			}
		}
		// scale
		let scaled = [];
		let resolusion = 16;
		for (let i = 0; i < size; i += resolusion) {
			let row = [];
			for (let j = 0; j < size; j += resolusion) {
				row.push(data[i][j]);
			}
			scaled.push(row);
		}
		// print to output
		let output = document.getElementById('output');
		let outPutString = "";
		for (let i = 0; i < scaled.length; i++) {
			for (let j = 0; j < scaled[i].length; j++) {
				outPutString += `<span style="color:rgb(${scaled[i][j][0]},${scaled[i][j][1]},${scaled[i][j][2]})">█</span>`;
			}
			outPutString += "<br/>";
		}
		output.innerHTML = outPutString;

		// Classify

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