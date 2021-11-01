import React from "react";
import { BurgerMenu } from "./BurgerMenu";
export const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <BurgerMenu />
      <main>{children}</main>
    </>
  );
};
