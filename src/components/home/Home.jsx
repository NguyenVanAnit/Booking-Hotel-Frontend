import React, { useContext, useState } from "react"
import MainHeader from "../layout/MainHeader"
import HotelService from "../common/HotelService"
import Parallax from "../common/Parallax"
import RoomCarousel from "../common/RoomCarousel"
import RoomSearch from "../common/RoomSearch"
import { useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { message } from "antd"

const Home = () => {
  const location = useLocation();

  const message = location.state && location.state.message
  const currentUser = localStorage.getItem("userId")

  return (
    <section>
      {message && <p className="text-warning px-5">{message}</p>}
      {currentUser && (
        <h6 className="text-success text-center"> You are logged-In as {currentUser}</h6>
      )}
      <MainHeader />
      <div className="container">
        <h3 style={{ marginTop: 30 }}>Tìm kiếm phòng phù hợp ở đâyyy</h3>
        <RoomSearch />
        <RoomCarousel />
        <Parallax />
        <RoomCarousel />
        <HotelService />
        <Parallax />
        <RoomCarousel />
      </div>
    </section>
  )
}

export default Home