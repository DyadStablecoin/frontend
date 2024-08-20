import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Table,
} from "@nextui-org/react";
import React, { useState } from "react";

interface TableComponentProps {
  columns: any;
  rows: any;
  size?: "default" | "compact";
  onRowClick?: (key: string) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  rows,
  onRowClick,
  size = "default",
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const parseValue = (value: string) => {
    if (value === undefined || value === "") return 0;
    value = String(value);
    // Remove any non-numeric characters except for '.' and '-'
    const numericValue = value.replace(/[^\d.-]/g, "");
    return parseFloat(numericValue);
  };

  const sortedRows = React.useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig !== null) {
      sortableRows.sort((a, b) => {
        const aValue = parseValue(getKeyValue(a, sortConfig.key));
        const bValue = parseValue(getKeyValue(b, sortConfig.key));

        if (!aValue) return 1;
        if (!bValue) return -1;

        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRows;
  }, [rows, sortConfig]);

  const requestSort = (key: string) => {
    setSortConfig((oldValue) => {
      let direction = "ascending";
      if (
        oldValue 
        && oldValue.key === key 
        && oldValue.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    })
  };

  return (
    <div className="h-full overflow-scroll">
      <div className={`grid grid-cols-${columns.length} auto-cols-min`}>
        {columns.map((column: any) => (
          <div
          onClick={() => requestSort(column.sortKey || column.key)}
              style={{ cursor: "pointer" }}
            key={column.key}
            className={`${
              size === "compact" ? "h-[35px]" : "h-[50px]"
            } flex items-center justify-start pl-2`}
          >
            {column.label}
          </div>
        ))}
        {sortedRows.map((row: any, idx: number) => (
          columns.map((column: any) => (
            <div
              key={`${idx}-${column.key}`}
              className={`${
                size === "compact" ? "h-[35px]" : "h-[50px]"
              } flex items-center justify-start pl-2`}
            >
              {getKeyValue(row, column.key)}
            </div>
          ))))}
      </div>
    </div>
  );
};
export default TableComponent;
