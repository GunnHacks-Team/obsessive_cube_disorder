import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './output.css';
import Main from './routes/main';
import Capture from './routes/capture';
import Solve from './routes/solve';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/capture" element={<Capture />} />
			<Route path="/solve" element={<Solve />} />
		</Routes>
	</BrowserRouter>,
	document.getElementById('root')
);