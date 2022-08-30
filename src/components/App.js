import { useEffect, useState } from "react";
import AppRouter from "../Route/AppRouter";
import { authService } from "../mybase";
import { updateProfile } from "firebase/auth";
function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => {
            updateProfile(user, { displayName: user.displayName });
          },
          email: user.email,
        });
      } else setIsLoggedIn(false);
      setInit(true);
    });
  }, []);
  const refresh = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => {
        updateProfile(user, { displayName: user.displayName });
      },
      email: user.email,
    });
  };
  return (
    <div>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refresh={refresh}
        />
      ) : (
        "Initializing"
      )}
    </div>
  );
}

export default App;
