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
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyDown);
	}
	// unmount
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyDown);
	}
	handleKeyDown(event) {
		console.log("Key pressed: " + event.key);
		if (event.repeat) return;
		else if (event.key === "Enter") { this.useButton(); }
		else if (event.key === "Shift") { this.captureButton(); }
		else if (event.key === "ArrowLeft" && this.state.focusedSide > 0) this.progressCircleButton(this.state.focusedSide - 1);
		else if (event.key === "ArrowRight" && this.state.focusedSide < 5) this.progressCircleButton(this.state.focusedSide + 1);
	}
	// Getters
	getFilledSides = () => this.state.sides.map(side => side !== null ? 1 : 0).reduce((a, b) => a + b, 0);
	// Video
	ocdVideo() {
		navigator.mediaDevices.getUserMedia({ video: true, audio: false })
			.then(stream => { this.video.srcObject = stream; this.video.play(); })
		return (<video id="video" className="box" ref={(video) => { this.video = video; }}></video>);
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
	createProgressBar() {
		let size = this.getFilledSides();
		let barWidth = Math.min(size + 0.1, 5) / 5 * 100;
		return (
			<div id="progress-bar" className={"h-full absolute rounded-full transition-all duration-500"}
				style={{ width: barWidth + "%", backgroundColor: this.greenColor }}>
			</div>
		);
	}
	createProgressCircles() {
		const circles = ["F", "L", "B", "R", "U", "D"];
		const circlesFull = ["Front", "Left", "Back", "Right", "Up", "Down"];
		const size = this.getFilledSides();
		// Computed values 
		const progressCircleBackgroundColor = (index) => (index < size) ? this.greenColor : "black";
		const progressCircleBorderColor = (index) => (index === this.state.focusedSide) ? this.greenColor : "black";
		const progressCircleLetterColor = (index) => (index < size) ? "black" : "white";
		const progressCircleClickable = (index) => (index <= size) ? "pointer" : "not-allowed";
		const progressCricleName = (index) => (index === this.state.focusedSide) ? circlesFull[index] : circles[index];
		const progressCircleWidth = (index) => (index === this.state.focusedSide) ? "7vw" : "5vw";
		return (
			<div id="progress-circles" className="w-full h-full flex justify-between items-center">
				{circles.map((circle, index) => {
					return (
						<div key={index} className="progress-circle rounded-full flex justify-center items-center border-[0.4vw] z-10 h-[5vw] transition-all duration-100"
							style={{
								backgroundColor: progressCircleBackgroundColor(index), borderColor: progressCircleBorderColor(index), cursor: progressCircleClickable(index),
								width: progressCircleWidth(index)
							}}
							onClick={() => this.progressCircleButton(index)}>
							<div className="progress-circle-letter font-bold text-white text-[2vw] transition-all duration-300"
								style={{ color: progressCircleLetterColor(index), }}>
								{progressCricleName(index)}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
	progressCircleButton(index) {
		if (index > this.getFilledSides() || index === this.state.focusedSide) return;
		this.setState({ focusedSide: index, });
		this.updateOutputImage(this.state.images[index]);
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
		if (imageData === null) context.clearRect(0, 0, ouutputImage.width, ouutputImage.height);
		else context.putImageData(imageData, 0, 0);
	}
	makeSide() {
		let side = this.state.sides[this.state.focusedSide];
		if (side === null) return;
		const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
		const squareToColor = (square) => colors[square];
		return (
			<div className="side">
				{side.map((square, index) => {
					return (
						<div key={index} className="square w-[33.33%] h-[33.33%] border-[0.5vw] cursor-pointer transition-all duration-200 hover:scale-110"
							style={{ backgroundColor: squareToColor(square), }}
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
				{this.getButton("green", "Solve", null, false)}
			</Link>
		);
	}
	getButton(textColor, text, onclick, disabled) {
		// let textColor = "text-" + color;
		return (
			<button
				className={"text-white text-[1.5vw] py-[0.5vw] px-[1vw] m-[1vw] border-[0.3vw] border-emerald-400 rounded bg-transparent hover:bg-emerald-400 transition-colors duration-150"}
				onClick={onclick}
				disabled={disabled}
			>
				{text}
			</button>
		);
	}
	getEdit() {
		return (
			<div className="group text-white text-[1.5vw] py-[0.5vw] px-[1vw] m-[1vw] flex items-center relative mx-[0.5vw] hover:text-gray-300 transition-all duration-200">
				<p className="underline decoration-[0.15vw] hover:decoration-[0.2vw]">Edit</p>
				<p className="absolute text-[1.3vw] left-[5vw] w-[10vw] opacity-0 group-hover:opacity-100 bg-gray-500 transition-opacity duration-100">To edit a square, click on it.</p>
			</div>
		);
	}

	// Render
	render() {
		return (
			<div id="main-content" className="flex flex-col items-center relative m-[1vw]">
				<p className="text-white text-[3vw] m-[1vw]">Cube Data Collection</p>
				<div id="capture-content">
					{/* Capture */}
					<div className="box-holder">
						{this.ocdVideo()}
						{this.getButton('purple', 'Capture', this.captureButton, false)}
					</div>
					{/* Use */}
					<div className="box-holder">
						<canvas id="outputImage" className="box"></canvas>
						{this.getButton('green', 'Use', this.useButton, this.state.focusedSide >= 6)}
					</div>
					{/* Edit */}
					<div className="box-holder">
						<div id="classifiedOutputImage" className="box">
							{this.makeSide()}
						</div>
						{this.getEdit()}
					</div>
				</div>
				<p id="output"></p>
				<div id="progress-container" className="w-[75vw] h-[3vw] m-[2vw] mt-[9vw] bg-zinc-800 rounded-full relative">
					{this.createProgressBar()}
					{this.createProgressCircles()}
				</div>
				{this.getSolveLink()}
			</div>
		);
	}
};

export default Capture;