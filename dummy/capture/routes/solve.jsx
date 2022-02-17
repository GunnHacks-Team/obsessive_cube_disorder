import React from 'react';
import { useLocation } from 'react-router-dom'
import RubiksCubeCanvas from '../cube/RubiksCubeCanvas.js';

export default function Solve() {
	const location = useLocation();
	const { sides } = location.state;
	let parsedSides = {
		front: sides[0],
		left: sides[1],
		back: sides[2],
		right: sides[3],
		up: sides[4],
		down: sides[5],
	};
	const colors = ['r', 'o', 'y', 'g', 'b', 'l', 'w'];
	for (const side in parsedSides) parsedSides[side] = parsedSides[side].map(square => colors[square]);

	const rc = <RubiksCubeCanvas colors={parsedSides} />;
	// const solve = rc.getSolve();
	// console.log(solve);

	console.log("parsedSides", parsedSides);
	return (
		<div>
			{rc}
		</div>
	);
};