import React from "react";
import { Composition, registerRoot } from "remotion";
import { Effect, EFFECTS } from "./Effect";
import { defaultProps } from "./kit";

const Root: React.FC = () => (
  <>
    {Object.keys(EFFECTS).map((id) => (
      <Composition
        key={id}
        id={id}
        component={Effect}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={150}
        defaultProps={{ ...defaultProps, effect: id }}
        calculateMetadata={({ props }) => ({ durationInFrames: props.durationInFrames })}
      />
    ))}
  </>
);

registerRoot(Root);
