import React from 'react';
import classNames from '../util/classNames.jsx';

export default function Button({ classes, textColor, bgColor, size, onclick, children }) {
	const TEXT_COLOR = {
		red:	'text-red-400',
		orange:	'text-orange-400',
		yellow:	'text-yellow-400',
		green:	'text-green-400',
		blue:	'text-blue-400',
		purple:	'text-purple-400',
		white:	'text-white',
		black:	'text-black',
	};
	const BG_COLOR = {
		red: 	'border-red-400		hover:bg-red-400',
		orange: 'border-orange-400	hover:bg-orange-400',
		yellow: 'border-yellow-400	hover:bg-yellow-400',
		green: 	'border-green-400	hover:bg-green-400',
		blue: 	'border-blue-400	hover:bg-blue-400',
		purple: 'border-purple-400	hover:bg-purple-400',
		white: 	'border-white		hover:bg-white',
		black: 	'border-black		hover:bg-black',
		none: 	'border-transparent	hover:bg-transparent',
	};
	const SIZE = {
		small:	'text-[0.75vw]	px-[0.5vw]	py-[0.25vw]',
		medium: 'text-[1.5vw]	px-[1vw]	py-[0.5vw]',
		large:	'text-[3vw]		px-[2vw]	py-[1vw]',
	};

	return (
		<button
			className={classNames([
				`py-[0.5vw] px-[1vw] m-[1vw] border-[0.2vw] rounded-[0.5vw] select-none transition-colors duration-150`,
				TEXT_COLOR[textColor],
				BG_COLOR[bgColor],
				SIZE[size],
				classes,
			])}
			onClick={onclick}
		>
			{children}
		</button>
	)
}