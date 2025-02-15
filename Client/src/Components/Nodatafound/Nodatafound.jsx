import { motion } from "framer-motion";
import "../../Styles/nodata.css";

const NoDataFound = () => {
  return (
    <div className="no-data-message">
      Ooops! No data found <br/>
      Try adding data.
    </div>
  );
};

export default NoDataFound;
