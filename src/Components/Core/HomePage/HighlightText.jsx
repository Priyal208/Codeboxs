import React from "react";

const HighlightText = ({text}) => {
  return (
    <span className="bg-gradient-to-b from-caribbeangreen-50 to-yellow-100 text-transparent bg-clip-text font-bold">
      {" "}
      {text}
    </span>
  );
};

export default HighlightText;