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
        <div className="col-sm-6 col-lg-4 col-xl-3 px-0 full-responsive-height overflow-auto d-flex flex-column justify-content-between">
          <Logo />
          {leftContent}
        </div>
        <div className="col-sm-6 col-lg-8 col-xl-9 px-0">
          <div
            className={`page-layout-grid-container ${
              gridLayoutName ? gridLayoutName : "page-layout-default-area"
            } full-responsive-height overflow-auto`}
          >
            <HorizontalMenu selected={menuSelectedItem} />
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};
