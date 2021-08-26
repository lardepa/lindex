import React from "react";
import get from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Lieu } from "../types";

export const Home: React.FC<{}> = () => {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  //   useEffect(() => {
  //     get(``);
  //   }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h1>L'Ardepa : cartographie</h1>
          <div>menu 1</div>
          <div>menu 2</div>
          <div>menu 3</div>
        </div>
        <div className="col-6">TODO: cartographie</div>
      </div>
    </div>
  );
};
