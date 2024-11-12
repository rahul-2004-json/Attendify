import { createContext, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const notifySuccess = () => {
    toast.success(
      inputMethod === "database"
        ? "Selected from database successfully"
        : "Uploaded csv successfully"
    );
  };

  const notifyError = () => {
    toast.error(
      inputMethod === "database"
        ? "Error in selecting from database"
        : "Error in uploading csv"
    );
  };

  const notifyMessage = () => {
    toast.warning("File selected is not in csv format");
  };

  const notifyNofile = () => {
    toast.warning("File Not selected");
  };

  const sleep = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleCsvChange = (e) => {
    setLoading(true);
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
            // notifySuccess();
          },
          error: (error) => {
            notifyError();
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
          // notifySuccess();
        };
        reader.onerror = (error) => {
          notifyError();
          console.error("Error reading Excel file:", error);
        };
        reader.readAsArrayBuffer(file);
      } else {
        notifyMessage();
        console.error("Unsupported file format");
      }
    } else {
      notifyNofile();
      console.error("No files selected");
    }
    setLoading(false);
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
      await sleep();
      setStudents(response.data.students);
      notifySuccess();
    } catch (error) {
      console.error("Error Fetching students:", error);
      // alert("Failed to Fetch students");
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const handleNextCSV = () => {
    if (parsedData.length === 0) {
      notifyNofile();
    } else {
      notifySuccess();
    }
    setStudents(parsedData);
    setCsvFile([]);
  };

  console.log("from context:",students);

  return (
    <StudentsContext.Provider
      value={{
        students,
        handleCsvChange,
        handleNextform,
        handleNextCSV,
        setLoading,
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
        parsedData,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
