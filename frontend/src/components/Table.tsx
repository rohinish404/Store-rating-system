import React from 'react';
import type { SortConfig } from '../types';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortConfig,
  onSort,
  emptyMessage = 'No data available',
}) => {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return '⇅';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`bg-slate-50 px-3 py-3 text-left font-semibold border-b-2 border-slate-200 whitespace-nowrap ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-slate-200' : ''
                }`}
                onClick={() => column.sortable && onSort && onSort(column.key)}
              >
                {column.label}
                {column.sortable && (
                  <span className="ml-2 opacity-50">{getSortIcon(column.key)}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center px-8 py-8 text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-3 py-3 border-b border-slate-200">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] || '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
