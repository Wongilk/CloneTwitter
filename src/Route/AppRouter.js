import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Authentication";
import Home from "./Home";
import Navigator from "../components/Navigator";
import Profile from "../components/Profile";
const AppRouter = ({ isLoggedIn, userObj, refresh }) => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {isLoggedIn && <Navigator userObj={userObj} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route
                exact
                path="/"
                element={<Home userObj={userObj} />}
              ></Route>
              <Route
                exact
                path="/profile"
                element={<Profile userObj={userObj} refresh={refresh} />}
              ></Route>
            </>
          ) : (
            <>
              <Route exact path="/" element={<Auth />}></Route>
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};
export default AppRouter;
