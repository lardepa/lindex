import React from "react";
import { Logo } from "../logo";

export const Layout: React.FC<{}> = ({ children }) => {
  return (
    <>
      <main>
        <>
          <Logo />
          {children}
        </>
      </main>
    </>
  );
};
