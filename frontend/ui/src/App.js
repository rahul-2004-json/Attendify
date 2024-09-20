import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./component/auth/SignIn";
import SignUp from "./component/auth/SignUp";
import UploadImage from "./component/upload/UploadImage";

function App() {
	return (
		<Router>
			<div>
				<Routes>
					<Route
						path="/"
						element={<UploadImage />}
					/>
					{/* <Route path="/" element={<></>} />   */}
					<Route
						path="/sign_in"
						element={<SignIn />}
					/>
					<Route
						path="/sign_up"
						element={<SignUp />}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
