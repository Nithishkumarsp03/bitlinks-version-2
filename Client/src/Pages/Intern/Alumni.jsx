import React from 'react'
import Leftside from '../Admin/Leftside'
import "../../Styles/alumni.css"
import { Outlet } from 'react-router-dom'

export default function Alumni() {
  return (
    <div style={{height: "99%", width: "100%", margin: "0", padding: "0 10px", display: "flex", gap: "10px"}}>
      <div className="left-alumni"><Leftside role={"alumni"}/></div>
      <div className="right-alumni"><Outlet /></div>
    </div>
  )
}
