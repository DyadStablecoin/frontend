import React from "react";

interface NoteCardsContainerPropsInterface {
  children: JSX.Element;
  className?: string;
}

function NoteCardsContainer({
  children,
  className,
}: NoteCardsContainerPropsInterface) {
  return (
    <div
      className={`[box-shadow:10px_10px_0px_0px_#00000045] md:[box-shadow:15px_15px_0px_0px_#00000045] flex-1 max-w-screen-lg p-7 bg-[#242424] w-full ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default NoteCardsContainer;
