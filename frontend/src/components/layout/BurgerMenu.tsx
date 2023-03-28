import { FC, useState } from "react";
import { VerticalMenu } from "./vertical-menu";

export const BurgerMenu: FC = () => {
  const [opened, open] = useState<boolean>(false);
  return (
    <div className=" navbar navbar-light pt-0" id="burger-menu">
      <div className={`${opened ? "w-100 bg-light text-end" : ""}`}>
        <button
          className={`${opened ? "btn-close" : ""} navbar-toggler end-0`}
          type="button"
          onClick={() => open(!opened)}
          aria-controls="navbarToggleExternalContent"
          aria-expanded={opened}
          aria-label="Toggle navigation"
        >
          {!opened && <span className="navbar-toggler-icon"></span>}
        </button>
      </div>

      {opened && (
        <>
          <VerticalMenu />
        </>
      )}
    </div>
  );
};
