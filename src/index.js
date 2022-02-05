import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import Cube from './routes/cube/cube';
import Capture from './routes/capture';
import Gallery from './routes/gallery';
import Solve from './routes/solve';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="cube" element={<Cube />} />
			<Route path="capture" element={<Capture />} />
			<Route path="galler" element={<Gallery />} />
			<Route path="solve" element={<Solve />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById('root')
);