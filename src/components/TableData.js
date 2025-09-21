import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditModal from "./EditModal";

const TableWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  overflow: "auto",
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  borderCollapse: "collapse",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: "#666",
  fontSize: "14px",
  fontWeight: 500,
  padding: "12px 16px",
  borderBottom: "1px solid #ddd",
  borderRight: "1px solid #ddd",
  "&:last-child": {
    borderRight: "none",
  },
  whiteSpace: "nowrap",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "14px",
  fontWeight: 400,
  padding: "12px 16px",
  borderBottom: "1px solid #f0f0f0",
  borderRight: "1px solid #f0f0f0",
  color: "#333",
  "&:last-child": {
    borderRight: "none",
  },
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "200px",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
}));

const ActionCell = styled(TableCell)(({ theme }) => ({
  padding: "8px 16px",
  width: "60px",
  borderBottom: "1px solid #f0f0f0",
  borderRight: "1px solid #f0f0f0",
  textAlign: "center",
}));

const EditIconButton = styled(IconButton)(({ theme }) => ({
  color: "#666",
  padding: "6px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    color: "#1976d2",
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: "#f8f9fa",
  borderTop: "1px solid #ddd",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: "8px",
  },
}));

const PaginationInfo = styled(Typography)(({ theme }) => ({
  color: "#666",
  fontSize: "14px",
  [theme.breakpoints.down("sm")]: {
    marginBottom: "8px",
  },
}));

const PaginationControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}));

const PaginationSelect = styled("select")(({ theme }) => ({
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "4px 8px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#333",
  "&:focus": {
    outline: "none",
    borderColor: "#1976d2",
  },
}));

const PaginationButton = styled(IconButton)(({ theme }) => ({
  padding: "4px",
  color: "#666",
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginLeft: "4px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  "&:disabled": {
    color: "#ccc",
    borderColor: "#eee",
  },
}));

const NoDataContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  color: "#666",
  fontSize: "14px",
  borderBottom: "none",
}));

export default function TableData({ tableData = [], setTableData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const theme = useTheme();

  const handleEdit = (rowData, index) => {
    setSelectedRecord(rowData);
    setEditModalOpen(true);
  };

  const handleUpdateRecord = async (updatedData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/employee/${selectedRecord.id}`,
        updatedData
      );

      const updatedTableData = tableData.map((item) =>
        item.id === selectedRecord.id ? { ...updatedData } : item
      );
      setTableData(updatedTableData);

      console.log("Record updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating record:", error);
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedRecord(null);
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    return tableData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [tableData, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startRecord = page * rowsPerPage + 1;
  const endRecord = Math.min((page + 1) * rowsPerPage, tableData.length);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        minWidth: 300,
      }}
    >
      <EditModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        recordData={selectedRecord}
        onUpdate={handleUpdateRecord}
      />
      <Box
        sx={{
          padding: "16px 0",
          backgroundColor: "transparent",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#333",
            fontSize: "18px",
            fontWeight: 500,
          }}
        >
          Show the List of records
        </Typography>
      </Box>
      <TextField
        placeholder="Search records..."
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(0);
        }}
        sx={{
          mb: 2,
          width: "50%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            backgroundColor: "#fff",
            "& fieldset": {
              borderColor: "#ddd",
            },
            "&:hover fieldset": {
              borderColor: "#bbb",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#35375d",
              borderWidth: 1.5,
            },
          },
          "& input": {
            padding: "8px 14px",
            "&::placeholder": {
              fontSize: "13px",
            },
          },
        }}
      />

      <TableWrapper>
        <StyledTableContainer component={Paper}>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                {[
                  { label: "Action", key: null },
                  { label: "First Name", key: "firstName" },
                  { label: "Last Name", key: "lastName" },
                  { label: "Phone", key: "phone" },
                  { label: "Email", key: "email" },
                  { label: "Address", key: "address" },
                  { label: "City", key: "city" },
                  { label: "Zip", key: "zipCode" },
                ].map((col) => (
                  <StyledHeaderCell
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    {col.label}
                    {col.key &&
                      sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpwardIcon fontSize="small" />
                      ) : (
                        <ArrowDownwardIcon fontSize="small" />
                      ))}
                  </StyledHeaderCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <ActionCell>
                      <EditIconButton
                        onClick={() => handleEdit(row, index)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </EditIconButton>
                    </ActionCell>
                    <StyledTableCell title={row.firstName}>
                      {row.firstName}
                    </StyledTableCell>
                    <StyledTableCell title={row.lastName}>
                      {row.lastName}
                    </StyledTableCell>
                    <StyledTableCell title={row.phone}>
                      {row.phone}
                    </StyledTableCell>
                    <StyledTableCell title={row.email}>
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell
                      title={
                        row.address
                          ? `${row.address}${row.state ? `, ${row.state}` : ""}`
                          : ""
                      }
                    >
                      {row.address
                        ? `${row.address}${row.state ? `, ${row.state}` : ""}`
                        : ""}
                    </StyledTableCell>
                    <StyledTableCell title={row.city}>
                      {row.city}
                    </StyledTableCell>
                    <StyledTableCell title={row.zipCode}>
                      {row.zipCode}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ padding: 0, border: "none" }}>
                    <NoDataContainer>
                      <Typography sx={{ color: "#666", fontSize: "14px" }}>
                        No data available
                      </Typography>
                    </NoDataContainer>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>

        {tableData.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              Show{" "}
              <PaginationSelect
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
              </PaginationSelect>{" "}
              entries per page
            </PaginationInfo>

            <PaginationControls>
              <Typography sx={{ fontSize: "14px", color: "#666" }}>
                {`${startRecord}-${endRecord} of ${tableData.length}`}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PaginationButton
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 0}
                  size="small"
                >
                  <NavigateBeforeIcon fontSize="small" />
                </PaginationButton>
                <PaginationButton
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page >= totalPages - 1}
                  size="small"
                >
                  <NavigateNextIcon fontSize="small" />
                </PaginationButton>
              </Box>
            </PaginationControls>
          </PaginationContainer>
        )}
      </TableWrapper>
    </Box>
  );
}
