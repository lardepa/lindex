import React, { ReactNode } from "react";
import { Logo } from "../logo";
import { BurgerMenu } from "./BurgerMenu";
import { HorizontalMenu } from "./horizontal-menu";

interface Props {
  menuSelectedItem?: "selections" | "parcours" | "explorer";
  leftContent: ReactNode;
  rightContent: ReactNode;
  gridLayoutName?: string;
  hideHorizontalMenu?: boolean;
}

export const PageLayout: React.FC<Props> = (props) => {
  const { menuSelectedItem, leftContent, rightContent, gridLayoutName, hideHorizontalMenu } = props;

  return (
    <div className="container-fluid">
      <div className="row full-height no-gutters">
        <div className="col-sd-12 col-md-3  px-0 overflow-auto d-flex flex-column justify-content-between context-menu">
          <BurgerMenu />
          <Logo />
          {leftContent}
        </div>

        {rightContent && (
          <div className="col-sd-12 col-md-9  px-0">
            <div
              className={`page-layout-grid-container ${
                gridLayoutName ? gridLayoutName : "page-layout-default-area"
              } overflow-auto`}
            >
              {!hideHorizontalMenu ? (
                <HorizontalMenu selected={menuSelectedItem} />
              ) : (
                <div className="horizontal-menu">
                  <div className="empty-spacer" />
                </div>
              )}
              {rightContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
