import React, { useEffect, useState } from "react";
import { authService, dbService } from "../mybase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import MyTwitt from "./MyTwitt";
const Profile = ({ userObj, refresh }) => {
  const [displayname, setDisplayname] = useState(userObj.displayName);
  const [myTwitts, setMyTwitts] = useState([]);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  let gettedTwitts;
  const getMyTwitts = async () => {
    const twitts = query(
      collection(dbService, "twitts"),
      where("creatorId", "==", `${userObj.uid}`),
      orderBy("createdAt")
    );
    await getDocs(twitts);
    const unsubscribe = onSnapshot(twitts, (querySnapshot) => {
      const newArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTwitts(newArray);
    });

    /*gettedTwitts.forEach((doc) => {
      setMyTwitts((myTwitts) => [...myTwitts, doc.data()]);
    });
    const newArray = myTwitts.map((twitt) => ({
      id: twitt.id,
      ...twitt.data(),
    }));
    setMyTwitts(newArray);*/
  };
  const onChange = (e) => {
    setDisplayname(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== displayname) {
      await updateProfile(authService.currentUser, {
        displayName: displayname,
      });
    }
    refresh();
  };
  useEffect(() => {
    getMyTwitts();
  }, []);
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          onChange={onChange}
          value={displayname}
          placeholder="Display Name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <div style={{ marginTop: 30 }}>
        {myTwitts.map((twitt) => (
          <MyTwitt
            key={twitt.id}
            twitt={twitt}
            isOwner={twitt.creatorId === userObj.uid}
          />
        ))}
      </div>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
export default Profile;
