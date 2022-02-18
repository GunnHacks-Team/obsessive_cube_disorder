import React from 'react';

class Main extends React.Component {
	render() {
		return (
			<div id="main-content">
				<img src={require("./cubes.png")}
					style={{
						width: "100%",
						position: "absolute",
						top: "-100px"
					}}
				></img>
				<img src={require("./lambda.png")}
					style={{
						width: "50%",
						position: "absolute",
						top: "750px",
						right: "-100px"
					}}
				></img>
				<a className="main-text" href="/capture"
					style={{
						position: 'absolute',
						top: '300px',
						right: '50px',
					}}
				>
					Get Started
				</a>
			</div>
		);
	}
}

export default Main;