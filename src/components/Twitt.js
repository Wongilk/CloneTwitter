import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storage } from "../mybase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import MyTwitt from "./MyTwitt";

const Twitt = ({ twitt, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTwitt, setNewTwitt] = useState(twitt.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure to delete it?");
    if (ok) {
      await deleteDoc(doc(dbService, "twitts", `${twitt.id}`));
      if (twitt.attachmentUrl)
        await deleteObject(ref(storage, `${twitt.attachmentUrl}`));
    }
  };
  const changeEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, "twitts", `${twitt.id}`), {
      text: newTwitt,
    });
    setEditing((prev) => !prev);
  };
  const onChange = (e) => {
    setNewTwitt(e.target.value);
  };
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              onChange={onChange}
              value={newTwitt}
              placeholder="edit your twitt"
              autoFocus
              required
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={changeEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{twitt.text}</h4>
          {twitt.attachmentUrl && <img src={twitt.attachmentUrl} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={changeEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Twitt;
