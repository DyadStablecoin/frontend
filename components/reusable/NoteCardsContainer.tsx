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
      className={`flex-1 max-w-screen-lg p-7 bg-[#1A1A1A] w-full ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default NoteCardsContainer;
