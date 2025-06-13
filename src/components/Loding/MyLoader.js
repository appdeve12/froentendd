import React from "react";
import { ScaleLoader } from "react-spinners";

function MyLoader({ loading }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      <ScaleLoader
        color="#36d7b7"
        height={35}
        margin={2}
        loading={loading}
      />
    </div>
  );
}

export default MyLoader;
