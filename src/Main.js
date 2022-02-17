import React from 'react';

class Main extends React.Component {
	render() {
		return (
			<div id="main-content">
				<img src={require("./homePage_2.png")}
					sytle={{
						width: "100%",
						position: "fixed",
						top:0
					}}
				>
				</img>
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