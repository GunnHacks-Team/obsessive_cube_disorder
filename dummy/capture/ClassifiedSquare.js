import React from 'react';

export default class ClassifiedSquare extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			colorPossibilities: props.colorPossibilities,
			currentColorIndex: 0,
		};
	}
	changeColor() {
		console.log('changeColor');
	}
	render() {
		return (
			<div className="classified-square" onclick={this.changeColor}>
				<p>Square</p>
			</div>
		);
	}
};