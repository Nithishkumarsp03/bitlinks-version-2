import { motion } from "framer-motion";
import "../../Styles/nodata.css";
import noDataAnimation from "../../Assets/Animation-1741581870586.gif"; // Import the GIF

const NoDataFound = () => {
  return (
    <div className="no-data-container">
      <img src={noDataAnimation} alt="No Data Found" className="no-data-animation" />
      <div className="no-data-message">
        Ooops! No data found <br />
        Try adding data.
      </div>
    </div>
  );
};

export default NoDataFound;
