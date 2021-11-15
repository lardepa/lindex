import React, { ReactNode } from "react";
import { Logo } from "../logo";
import { HorizontalMenu } from "./horizontal-menu";

interface Props {
  menuSelectedItem?: "selections" | "parcours" | "explorer";
  leftContent: ReactNode;
  rightContent: ReactNode;
  gridLayoutName?: string;
}

export const PageLayout: React.FC<Props> = (props) => {
  const { menuSelectedItem, leftContent, rightContent, gridLayoutName } = props;

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters">
        <div className="col-md-3  px-0 overflow-auto d-flex flex-column justify-content-between context-menu">
          <Logo />
          {leftContent}
        </div>
        <div className="col-md-9  px-0">
          <div
            className={`page-layout-grid-container ${
              gridLayoutName ? gridLayoutName : "page-layout-default-area"
            } overflow-auto`}
          >
            <HorizontalMenu selected={menuSelectedItem} />
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};
