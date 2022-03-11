import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import RubiksCube from '../cube/RubiksCube';

export default function Solve() {
	// Get sides
	const location = useLocation();
	const { sides } = location.state;
	let parsedSides = { front: sides[0], left: sides[1], back: sides[2], right: sides[3], up: sides[4], down: sides[5], };
	const colors = ['r', 'o', 'y', 'g', 'b', 'l', 'w'];
	for (const side in parsedSides)
		parsedSides[side] = parsedSides[side].map(square => colors[square]);

	// Rubiks cube
	const [cube, setCube] = useState(new RubiksCube(parsedSides));
	const moves = cube.solve();
	let [moveIndex, setMoveIndex] = useState(0);

	// Render Functions
	const showMoves = () => {
		console.log("showing moves");
		const moveColor = (index) => (index == moveIndex ? '#ffffff' : '#000000');
		const moveAlpha = (index) => (Math.abs(index - moveIndex) < 3 ? 1 : 0);
		return (
			<div className="absolute m-[5vw]">
				<div className="flex flex-row text-white text-[5vw]   transition-all duration-500 ease-in-out"
					style={{ transform: `translateX(calc(50% - calc(5vw + calc(14vw * ${moveIndex}))))`, overflow: 'clip' }}>
					{moves.map((move, index) => {
						return (
							<div key={index} className="m-[2vw] w-[10vw] font-bold   transition-all duration-300 ease-in-out"
								style={{ color: moveColor(index), opacity: moveAlpha(index) }}>
								{move}
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	// Event Functions
	const progressMoves = (amount) => {
		if (moveIndex + amount >= 0 && moveIndex + amount <= moves.length) {
			if (amount == 1) cube.next();
			else if (amount == -1) cube.prev();
			setMoveIndex(moveIndex + amount);
		}
	}

	// Event handlers
	window.onkeydown = e => {
		if (e.key === 'n') progressMoves(1);
		if (e.key === 'p') progressMoves(-1);
	};

	// Render
	return (
		<div className="flex justify-center relative" style={{ overflow: "hidden" }}>
			{showMoves()}
			{cube.getCanvas()}
		</div>
	);
};