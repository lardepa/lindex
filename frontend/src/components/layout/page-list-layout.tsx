import React, { ReactNode } from "react";
import { Logo } from "../logo";
import { BurgerMenu } from "./BurgerMenu";
import { HorizontalMenu } from "./horizontal-menu";

interface Props {
  menuSelectedItem?: "selections" | "parcours" | "explorer";
  leftContent: ReactNode;
  rightContent: ReactNode;
  gridLayoutName?: string;
}

export const PageListLayout: React.FC<Props> = (props) => {
  const { menuSelectedItem, leftContent, rightContent } = props;

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters page-list-layout-grid-container">
        <Logo />
        <BurgerMenu />
        <HorizontalMenu selected={menuSelectedItem} />
        <div className="px-0 d-md-flex flex-column justify-content-between context-menu">{leftContent}</div>

        {rightContent && <div className="main-content  px-0">{rightContent}</div>}
      </div>
    </div>
  );
};
