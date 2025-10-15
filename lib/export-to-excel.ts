import axios from "axios";
import * as XLSX from "xlsx";

type ExportToExcelOptions<T> = {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  mapRow: (row: T) => Record<string, unknown>;
  sheetName?: string;
  filename?: string; // without extension
};

export async function exportToExcel<T>({
  url,
  headers,
  params,
  mapRow,
  sheetName = "Data",
  filename = `export_${new Date().toISOString().slice(0,10)}`,
}: ExportToExcelOptions<T>) {
  const response = await axios.get(url, {
    headers,
    params,
  });

  //const rows = (response.data?.result?.data ?? []) as T[];
  const rows = (response.data?.result?.data || response.data?.result?.[0]?.data || response.data?.result || []) as T[];
  if (!rows.length) {
    return { count: 0 };
  }

  const exportRows = rows.map(mapRow);
  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
  return { count: rows.length };
}


