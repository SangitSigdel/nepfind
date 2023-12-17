import { InitialScreen } from "./InitialScreen";
import { Meta } from "@storybook/react";

const Component = () => {
  return (
    <div style={{ background: "#202c33" }}>
      <InitialScreen />
      );
    </div>
  );
};

export default {
  component: Component,
  title: "ChatScreen/InitialScreen",
} as Meta;

export const Default = {
  args: {},
};
