// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-press">

      <div onClick={openMenu}>
        <i class="fa-solid fa-bars"></i>
        <i className="fas fa-user-circle" />
      </div>
      <div className={ulClassName} ref={ulRef}>
        <div>{user.username}</div>
        <div>{user.firstName} {user.lastName}</div>
        <div>{user.email}</div>
        <hr></hr>
        <div><NavLink exact to="/spots/current">Manage Spots</NavLink></div>
        <hr></hr>
        <div>
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileButton;
