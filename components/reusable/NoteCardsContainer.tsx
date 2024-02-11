import React from "react";

interface NoteCardsContainerPropsInterface {
  children: JSX.Element;
}

function NoteCardsContainer({ children }: NoteCardsContainerPropsInterface) {
  return (
    <div
      className="flex-1 max-w-screen-md p-7  bg-[#1A1A1A] w-[300px] h-[700px]"
      style={{ height: "300px", width: "700px", borderRadius: "10px" }}
    >
      {children}
    </div>
  );
}

export default NoteCardsContainer;
