import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Form from "./Form";
import TableData from "./TableData";
import axios from "axios";

export const RecordsDashboard = () => {
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getAllEmployee = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/employee`
        );
        console.log(response.data);
        if (response?.data?.data?.length) {
          console.log(response.data?.data);
          setTableData(response.data?.data);
        }
      } catch (error) {
        console.error("Error creating user:", error);
        alert(
          error.response?.data?.message ||
            "Something went wrong while saving user!"
        );
      }
    };
    getAllEmployee();
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
          height: "80%",
          borderRadius: 4,
          p: 3,
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        }}
        gap={3}
      >
        <Form
          setFormData={setFormData}
          formData={formData}
          setTableData={setTableData}
          tableData={tableData}
        />
        <TableData tableData={tableData} setTableData={setTableData} />
      </Box>
    </Box>
  );
};
