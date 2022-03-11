import React from 'react';
import Button from '../components/Button';
import { Link } from "react-router-dom";

class Main extends React.Component {
	render() {
		return (
			<div className="text-[1vw] relative text-white bg-gradient-to-b from-zinc-700 to-zinc-900">
				{/* BG IMAGE */}
				<img src={require("../images/cubes.png")} className="w-[100vw] absolute select-none"></img>

				{/* TITLE */}
				<div className="p-[5vw] pl-[9vw]">
					<p className="text-blue-400 -ml-[2vw]">
						GunnHacks-Team Presents
					</p>
					<p className="text-white text-[5vw] font-mono font-light select-none">
						Obsessive <br />
						Cube <br />
						Disorder
					</p>
					<div className="text-gray-400 w-[35vw]">
						The pain of not being able to solve a Rubik's cube affects roughly 180 million people worldwide(No, this statistic was not purely made up). It might not be the most intense issue facing humanity in the modern age, but it certainly is both extremely widespread and very annoying.
					</div>
				</div>

				{/* START */}
				<Button classes="absolute top-[24vw] right-[4vw]" textColor="white" bgColor="blue" size="medium"><Link to="/capture">Get Started</Link></Button>

				{/* LAMBDA */}
				<img src={require("../images/lambda.png")} className="absolute w-[45vw] top-[40vw] right-[1vw] hover:skew-y-2 hover:-skew-x-2 hover:scale-[1.03] select-none transition-all duration-1000"></img>

				{/* IN THE MAKING OF */}
				<div className="w-[30vw] h-[35vw] m-[10vw] bg-black rounded-[2vw] bg-opacity-30 backdrop-blur-2xl">
					<p className="text-[2vw] p-[2vw] ">In the Making of...</p>
					<p className="text-white text-opacity-50 text-[1.4vw] p-[2vw] ">
						The goal was for it to do this: Given user-provided pictures of faces of their unsolved rubik's cubes, it uses machine learning to analyze and identify the colors on each of the squares and then shows the user the moves they need to perform on the cube to solve it.
					</p>
				</div>

				{/* ABOUT THE CREATORS */}
				<div className="flex">
					{/* <div className="flex">
						<div className="w-[15vw] h-[15vw] bg-gray-300 rounded-[2vw] bg-opacity-30 backdrop-blur-2xl">
							<p className="text-white text-opacity-50 text-[1.4vw] p-[2vw] ">
								We're proud
							</p>
						</div>
					</div> */}
					<div className="w-[30vw] h-[35vw] mt-[15vw] ml-[60vw] bg-black rounded-[2vw] bg-opacity-30 backdrop-blur-2xl">
						<p className="text-[2vw] p-[2vw] ">About the Creators...</p>
						<p className="text-white text-opacity-50 text-[1.4vw] p-[2vw] ">
							We're proud that we were each able to uphold our ends of the product, and come together at the end to have a mostly complete app despite its overall enormous complexity.
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Main;