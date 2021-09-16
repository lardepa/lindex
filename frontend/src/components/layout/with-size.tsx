import React, { Component, ComponentType } from "react";

export type SizeState = {
  width: number;
  height: number;
  isMounted: boolean;
};

export default function withSize<T>(WrappedComponent: ComponentType<T & SizeState>) {
  return class WithSize extends Component<T> {
    state = {
      width: 0,
      height: 0,
      isMounted: false,
    };
    wrapper: React.RefObject<HTMLDivElement> = React.createRef();

    handleResize = () => {
      this.setState({
        isMounted: true,
        width: this.wrapper.current?.offsetWidth,
        height: this.wrapper.current?.offsetHeight,
      });
    };

    componentDidMount() {
      window.addEventListener("resize", this.handleResize);
      this.handleResize();
    }
    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }

    render() {
      return (
        <div ref={this.wrapper}>
          <WrappedComponent {...(this.props as T)} {...this.state} />
        </div>
      );
    }
  };
}
