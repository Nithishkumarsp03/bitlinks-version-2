import React from 'react'
import Image from "../../Assets/amico.png"

export default function Error() {
  return (
    <div style={{height: "100%", width: "100%", justifyContent: "center", alignContent: "center"}}>
      <body class="error">
        <img src={Image} alt="" style={{width: "30%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}/>
        {/* <button class="home">Back to Home</button> */}
    </body>
    </div>
  )
}
