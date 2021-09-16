import React from "react";

export const Loader: React.FC<{ loading: boolean }> = ({ loading }) => (
  <>
    {loading && (
      <div className="spinner-border" role="status" style={{ margin: "auto" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    )}
  </>
);
