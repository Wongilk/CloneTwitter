import React from "react";
import { useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage, dbService } from "../mybase";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Twittfactory = (userObj) => {
  const [attachment, setAttachment] = useState("");
  const [twitt, setTwitt] = useState("");
  const onChange = (e) => {
    setTwitt(e.target.value);
  };

  const onSubmit = async (e) => {
    if (twitt === "") {
      return;
    }
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.userObj.uid}/${uuidv4()}`);
      await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(attachmentRef);
    }
    try {
      await addDoc(collection(dbService, "twitts"), {
        text: twitt,
        createdAt: new Date(),
        creatorId: userObj.userObj.uid,
        attachmentUrl,
      });
      setTwitt("");
      setAttachment("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const onImageChange = (e) => {
    const imgFile = e.target.files;
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setAttachment(e.target.result);
    };
    reader.readAsDataURL(imgFile[0]);
  };
  const onClearAttachment = () => {
    setAttachment("");
  };
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={twitt}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          onChange={onChange}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default Twittfactory;
