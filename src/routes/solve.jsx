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
		up: sides[4],
		down: sides[5],
	};

	console.log("parsedSides", parsedSides);
	return (
		<div>
			<h1>Solve</h1>
		</div>
	);
};