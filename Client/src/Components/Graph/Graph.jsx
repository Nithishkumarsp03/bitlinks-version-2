import React, { useState } from 'react'
import Fiveyeargraph from './Fiveyeargraph';
import Monthlygraph from './Monthlygraph';
import Yearlygraph from './Yearlygraph';
import Diamond from "../../Assets/Gem.svg";
import "../../Styles/profile.css"

export default function Graph() {

    const [graph, setGraph] = useState('monthly');
    const [totalPoints, setTotalPoints] = useState(0);

    const handleGraph = (period) => {
        setGraph(period);
    }

  return (
    <div style={{height: "100%", width: "100%", display: "flex"}}>
      <div className="graph-output">
        {graph === 'monthly' && <Monthlygraph setTotalPoints={setTotalPoints} totalPoints={totalPoints}/>}
        {graph === 'yearly' && <Yearlygraph setTotalPoints={setTotalPoints} totalPoints={totalPoints}/>}
        {graph === '5years' && <Fiveyeargraph setTotalPoints={setTotalPoints} totalPoints={totalPoints}/>}
      </div>
      <div className="input-navigation-button">
        <div className="diamond-points">
                {/* <p>Total Points: </p> */}
                <div className="total-points-box">
                  <img src={Diamond} className="diamond-img" alt="Diamond" />
                  <button className="total-points-graph">
                    <p>{Math.round(totalPoints)}</p>
                  </button>
                </div>
              </div>
        <button className={`graph-button ${graph==='monthly'? "active": ""}`} onClick={() => handleGraph("monthly")}>Monthly</button>
        <button className={`graph-button ${graph==='yearly'? "active": ""}`} onClick={() => handleGraph("yearly")}>Yearly</button>
        <button className={`graph-button ${graph==='5years'? "active": ""}`} onClick={() => handleGraph("5years")}>5 Years</button>
      </div>
    </div>
  )
}
