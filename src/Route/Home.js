import { React, useEffect, useState } from "react";
import { dbService } from "../mybase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Twitt from "../components/Twitt";
import Twittfactory from "../components/Twittfactory";

const Home = (userObj) => {
  const [twitt, setTwitt] = useState("");
  const [allTwitt, setAllTwitt] = useState([]);
  useEffect(() => {
    const q = query(collection(dbService, "twitts"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTwitt(newArray);
    });
  }, []);
  return (
    <div className="container">
      <Twittfactory userObj={userObj.userObj} />
      <div style={{ marginTop: 30 }}>
        {allTwitt.map((twitt) => (
          <Twitt
            key={twitt.id}
            twitt={twitt}
            isOwner={twitt.creatorId === userObj.userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
