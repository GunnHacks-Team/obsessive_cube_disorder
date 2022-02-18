import React from 'react';
import { Matrix } from '../ml/network.js';
import trainedModel from '../ml/training.js';
import { Link } from 'react-router-dom';

class Capture extends React.Component {
	// Constructor
	constructor(props) {
		console.clear();
		super(props);
		this.state = {
			sides: [null, null, null, null, null, null],
			images: [null, null, null, null, null, null],
			focusedSide: 0,
		};
		this.captureButton = this.captureButton.bind(this);
		this.useButton = this.useButton.bind(this);
		this.greenColor = "#00FF75";
	}



	// Getters
	getFilledSides() {
		return this.state.sides.map(side => side !== null ? 1 : 0).reduce((a, b) => a + b, 0)
	}



	// Video
	ocdVideo() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false })
			.then(stream => {
				this.video.srcObject = stream;
				this.video.play();
			})
		return (
			<video id="video" className="box" ref={(video) => { this.video = video; }}></video>
		);
	}



	// Buttons
	captureButton() {
		let video = document.getElementById('video');
		let ouutputImage = document.getElementById('outputImage');
		ouutputImage.width = video.videoHeight;
		ouutputImage.height = video.videoHeight;
		let context = ouutputImage.getContext('2d');
		let w = video.videoWidth;
		let h = video.videoHeight;
		context.drawImage(video, (w - h) / 2, 0, h, h, 0, 0, h, h);
	}
	useButton() {
		let { imageData, size, rawImage } = this.getImage();
		let scaledImage = this.scaleImage(imageData, size);
		let classifiedImage = this.classifyImage(scaledImage);
		let sectionedImage = this.sectionImage(classifiedImage);
		let averagedImage = this.averageData(sectionedImage);
		let parsedData = this.parseData(averagedImage);
		// let sides = ['r', 'o', 'y', 'g', 'b', 'l', 'w'];
		// parsedData = parsedData.map((data) => {
		// 	return sides[data];
		// });

		this.setState({
			sides: this.state.sides.map((side, index) => {
				if (index === this.state.focusedSide) return parsedData;
				else return side;
			}),
			images: this.state.images.map((image, index) => {
				if (index === this.state.focusedSide) return rawImage;
				else return image;
			}),
		});
	}



	// Progress
	progressCircleButton(index) {
		if (index > this.getFilledSides() || index === this.state.focusedSide) return;
		this.setState({
			focusedSide: index,
		});
		this.updateOutputImage(this.state.images[index]);
		// update output squares
	}
	createProgressBar() {
		let size = this.getFilledSides();
		return (
			<div id="progress-bar" style={{
				width: `${Math.min(size, 5) / 5 * 100}%`,
				height: "50px",
				backgroundColor: this.greenColor,
				position: "absolute",
			}}></div>
		);
	}
	createProgressCircles() {
		const circles = ["F", "L", "B", "R", "U", "D"];
		const size = this.getFilledSides();
		const progressCircleBackgroundColor = (index) => (index < size) ? this.greenColor : "black";
		const progressCircleBorderColor = (index) => (index === this.state.focusedSide) ? "yellow" : "black";
		const progressCircleLetterColor = (index) => (index < size) ? "black" : "white";
		return (
			<div id="progress-circles">
				{circles.map((circle, index) => {
					return (
						<div key={index} className="progress-circle"
							style={{
								backgroundColor: progressCircleBackgroundColor(index),
								borderColor: progressCircleBorderColor(index),
							}}
							onClick={() => this.progressCircleButton(index)}
						>
							<div className="progress-circle-letter"
								style={{
									color: progressCircleLetterColor(index),
								}}
							>
								{circle}
							</div>
						</div>
					);
				})}
			</div>
		);
	}



	// Image Collection Methods
	getImage() {
		let ouutputImage = document.getElementById('outputImage');
		let context = ouutputImage.getContext('2d');
		let size = ouutputImage.width;
		let rawImage = context.getImageData(0, 0, size, size);
		let imageData = rawImage.data;
		return { imageData, size, rawImage };
	}
	scaleImage(imageData, size) {
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
	printImage(imageData) {
		let output = document.getElementById('output');
		let outPutString = "";
		for (let i = 0; i < imageData.length; i++) {
			for (let j = 0; j < imageData[i].length; j++)
				outPutString += `<span style="color:rgb(${imageData[i][j][0]},${imageData[i][j][1]},${imageData[i][j][2]})">█</span>`;
			outPutString += "<br/>";
		}
		output.innerHTML = outPutString;
	}
	classifyImage(imageData) {
		let X = this.imageToX(imageData);
		let y = trainedModel.predict(X);
		let { result, index } = y.maxDim("row");
		return index;
	}
	imageToX(imageData) {
		let X = new Matrix(imageData.length, imageData[0].length);
		X.data = imageData;
		X = X.unravel();
		X.data = X.data.map(pixel => [pixel[0][0], pixel[0][1], pixel[0][2]]);
		X.cols = 3;
		return X.T();
	}
	printClassifiedImage(imageData) {
		let output = document.getElementById('output');
		let outPutString = "<br/><br/>";
		let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
		let size = Math.sqrt(imageData.data[0].length);
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++)
				outPutString += `<span style="color:${colors[imageData.get(i * size + j)]}">█</span>`;
			outPutString += "<br/>";
		}
		output.innerHTML = outPutString;
	}
	sectionImage(classifiedImage) {
		let size = Math.sqrt(classifiedImage.data[0].length);
		classifiedImage = classifiedImage.reshape(size, size); // Turn into square
		let sliced = []; // List of the squares
		let squareSize = size / 3;
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
			sliced.push(classifiedImage.slice(i * squareSize, (i + 1) * squareSize, j * squareSize, (j + 1) * squareSize));
		return sliced;
	}
	averageData(sectionedImage) {
		let averagedImage = [];
		for (let i = 0; i < sectionedImage.length; i++)
			averagedImage.push(sectionedImage[i].maxFrequency());
		return averagedImage;
	}
	parseData(averagedImage) {
		let parsedData = new Matrix(3, 3);
		for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
			parsedData.data[i][j] = averagedImage[i * 3 + j].data[0][0];
		return parsedData.reshape(1, 9).data[0];
	}



	// Images
	updateOutputImage(imageData) {
		let ouutputImage = document.getElementById('outputImage');
		let context = ouutputImage.getContext('2d');
		if (imageData === null) {
			context.clearRect(0, 0, ouutputImage.width, ouutputImage.height);
		} else {
			context.putImageData(imageData, 0, 0);
		}
	}
	makeSide() {
		const side = this.state.sides[this.state.focusedSide];
		if (side === null) return;
		const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
		const squareToColor = (square) => colors[square];
		return (
			<div className="side">
				{side.map((square, index) => {
					return (
						<div key={index} className="square"
							style={{
								backgroundColor: squareToColor(square),
							}}
							onClick={() => this.changeSquareColor(this.state.focusedSide, index)}
						></div>
					);
				})}
			</div>
		);
	}

	changeSquareColor(sideIndex, squqareIndex) {
		let newSides = this.state.sides;
		newSides[sideIndex][squqareIndex] = "" + (Number(newSides[sideIndex][squqareIndex]) + 1) % 7;
		this.setState({ sides: newSides, });
	}


	getSolveLink() {
		const size = this.getFilledSides();
		const linkPointerEvents = size < 6 ? 'none' : 'auto';
		const linkTextDecoration = size < 6 ? 'line-through' : 'none';
		const linkOpacity = size < 6 ? 0.5 : 1;
		return (
			<Link to={{ pathname: "/solve", }} state={{ sides: this.state.sides, }}
				style={{
					pointerEvents: linkPointerEvents,
					textDecoration: linkTextDecoration,
					opacity: linkOpacity,
					color: '#fff'
				}}
			>
				<button className="ocd-button">
					Solve
				</button>
			</Link>
		);
	}

	makeEdit() {
		const showEdit = (showing) => {
			console.log(showing);
			document.getElementById('showEdit').style.display = showing ? 'block' : 'none';
		}
		return (
			<div id="edit">
				Edit
				<div id="edit-popup"
					onMouseEnter={() => showEdit(true)}
					onMouseLeave={() => showEdit(false)}
				>
					To edit a side, click on the squares.
				</div>
			</div>
		);
	}

	// Render
	render() {
		return (
			<div id="main-content">
				<div id="capture-content">
					{/* Capture */}
					<div className="box-holder">
						{this.ocdVideo()}
						<button className="ocd-button" onClick={this.captureButton}>Capture</button>
					</div>
					{/* Use */}
					<div className="box-holder">
						<canvas id="outputImage" className="box"></canvas>
						<button className="ocd-button" onClick={this.useButton} disabled={this.state.focusedSide >= 6}>Use</button>
					</div>
					{/* Edit */}
					<div className="box-holder">
						<div id="classifiedOutputImage" className="box">
							{this.makeSide()}
						</div>
						{this.makeEdit()}
					</div>
				</div>
				<p id="output"></p>
				<div id="progress-container">
					{this.createProgressBar()}
					{this.createProgressCircles()}
				</div>
				{/* <div id="dropdown"></div> */}
				{/* <Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic">
						Dropdown Button
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">Action1</Dropdown.Item>
						<Dropdown.Item href="#/action-2">Action2</Dropdown.Item>
						<Dropdown.Item href="#/action-3">Action3</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown> */}
				{this.getSolveLink()}
			</div>
		);
	}
};

export default Capture;