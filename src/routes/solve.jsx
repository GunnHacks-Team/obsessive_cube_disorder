import React from 'react';
import { useLocation } from 'react-router-dom'
import RubiksCube from '../cube/RubiksCube';

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

	const rc = new RubiksCube(parsedSides);
	const solve = rc.getMoves();
	console.log(solve);
	window.onkeydown = e => {
		if (e.key === 'n') rc.next();
		if (e.key === 'p') rc.prev();
	};

	return (
		<div id="solve-content">
			{rc.getCanvas()}
		</div>
	);
};