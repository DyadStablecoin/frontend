import NoteCardsContainer from "@/components/reusable/NoteCardsContainer";
import TableComponent from "@/components/reusable/TableComponent";
import { columns, rows } from "@/mockData/tabsMockData";
import React from "react";

function AddVaultModal() {
  return (
    <div>
      <NoteCardsContainer>
        <>
          <div className="text-2xl font-semibold">
            Add new collateral type to your Note
          </div>
          <div className="h-[191px] overflow-scroll mt-[20px] ">
            <TableComponent columns={columns} rows={rows} />
          </div>
        </>
      </NoteCardsContainer>
    </div>
  );
}

export default AddVaultModal;
