import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
// import "./LoginForm.css";

const DeleteSpotModal = ({spotId}) => {
  const dispatch = useDispatch();
  // console.log(spotId)
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});

  const { closeModal } = useModal();
  const handleDelete = async() => {
    // e.preventDefault()
    // console.log("check")
    // console.log("check", spotId)
    // return dispatch(deleteSpotThunk(spotId)).then(closeModal).catch(async (res) => {
    //     const data = await res.json();
    //     if (data && data.errors) {
    //       console.log(data.errors);
    //     }
    //   });
    const response = await dispatch(deleteSpotThunk(spotId))
    closeModal()

  }
  const handleCancel = (e) =>{
    // console.log('check')
    closeModal()
  }


  return (
    <>
        <h1 className="confirm-header">Confirm Delete</h1>
        <p className="confirm-p">Are you sure you want to remove this spot from the listings?</p>
        <button onClick={handleDelete}className="delete-button">Yes (Delete Spot)</button>
        <button id="cancel-delete"onClick={handleCancel}className="cancel-button">No (Keep Spot)</button>
    </>
  );
}

export default DeleteSpotModal;
