import { createContext, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";

export const StudentsContext = createContext(null);

export default function StudentState({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [inputMethod, setInputMethod] = useState("database");

  const handleCsvChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop().toLowerCase();
      setCsvFile([file]);

      if (fileType === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data.map((row) => ({
              name: row.Name,
              enrollment: row.Enrollment,
              year: row.Year,
              batch: row.Batch,
              present: row.Present,
            }));
            setParsedData(data);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      } else if (fileType === "xls" || fileType === "xlsx") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          const formattedData = jsonData.map((row) => ({
            name: row.Name,
            enrollment: row.Enrollment,
            year: row.Year,
            batch: row.Batch,
            present: row.Present,
          }));
          setParsedData(formattedData);
        };
        reader.onerror = (error) => {
          console.error("Error reading Excel file:", error);
        };
        reader.readAsArrayBuffer(file);
      } else {
        console.error("Unsupported file format");
      }
    } else {
      console.error("No files selected");
    }
  };

  const handleNextform = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/getAttendanceList/fetch_students/",
        {
          params: {
            year: selectedYear,
            branch: selectedBranch,
            batch: selectedBatches,
          },
          paramsSerializer: (params) => {
            const query = new URLSearchParams();
            Object.keys(params).forEach((key) => {
              if (Array.isArray(params[key])) {
                params[key].forEach((value) => query.append(key, value));
              } else {
                query.append(key, params[key]);
              }
            });
            return query.toString();
          },
        }
      );
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error Fetching students:", error);
      alert("Failed to Fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleNextCSV = () => {
    setStudents(parsedData);
  };

  return (
    <StudentsContext.Provider
      value={{
        students,
        handleCsvChange,
        handleNextform,
        handleNextCSV,
        loading,
        csvFile,
        setCsvFile,
        selectedBatches,
        setSelectedBatches,
        selectedYear,
        setSelectedYear,
        selectedBranch,
        setSelectedBranch,
        inputMethod,
        setInputMethod,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
