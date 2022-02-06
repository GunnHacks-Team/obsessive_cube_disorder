import React from 'react';
import { useLocation } from 'react-router-dom'

export default function Solve() {
	const location = useLocation();
	const { sides } = location.state;

	const parsedSides = {
		front: sides[0],
		left: sides[1],
		back: sides[2],
		right: sides[3],
		top: sides[4],
		bottom: sides[5],
	};

	console.log("parsedSides", parsedSides.front);

	// const test = () => {
	// 	let outputString = '';
	// 	let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
	// 	for (let i = 0; i < 3; i++) {
	// 		for (let j = 0; j < 3; j++) {
	// 			outputString += colors[parsedSides.front[0][i * 3 + j]] + ' ';
	// 		}
	// 		outputString += '\n';
	// 	}
	// 	console.log(outputString);
	// }
	return (
		<div>
			<h1>Solve</h1>
		</div>
	);
};