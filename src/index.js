import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './routes/Main';
import Capture from './routes/Capture';
import Solve from './routes/Solve';
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