import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import axios from "axios";

const SmallTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    "& input": {
      borderColor: "black",
      fontSize: 13,
    },
    "& label": {
      fontSize: 13,
    },
    "& .MuiSelect-select": {
      fontSize: 13,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: 13,
  },
}));

export default function Form({
  setFormData,
  formData,
  setTableData,
  tableData,
}) {
  const stateOptions = [
    "California",
    "New York",
    "Texas",
    "Florida",
    "Washington",
  ];

  const districtMap = {
    California: ["Los Angeles", "San Diego", "San Francisco", "Sacramento"],
    "New York": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio"],
    Florida: ["Miami-Dade", "Broward", "Palm Beach", "Orlando"],
    Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    city: "",
    zipCode: "",
  });
  const [availableDistricts, setAvailableDistricts] = useState(
    formData?.state ? districtMap[formData?.state] : []
  );

  const handleInputChange = (field) => (event) => {
    let value = event.target.value;

    if (field === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 0) value = "(" + value;
      if (value.length > 4) value = value.slice(0, 4) + ")-" + value.slice(4);
      if (value.length > 9)
        value = value.slice(0, 9) + "-" + value.slice(9, 13);
      if (value.length > 14) value = value.slice(0, 14);
    }

    if (field === "state") {
      setAvailableDistricts(districtMap[value] || []);
      setFormData((prev) => ({
        ...prev,
        state: value,
        district: "",
      }));
      setErrors((prev) => ({ ...prev, state: "", district: "" }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      district: "",
      city: "",
      zipCode: "",
    };

    if (!formData?.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData?.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    const phoneDigits = formData?.phone?.replace(/\D/g, "");
    if (!formData?.phone) {
      newErrors.phone = "Phone is required";
      valid = false;
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
      valid = false;
    }

    if (!formData?.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !formData?.email?.includes("@") ||
      !formData?.email?.includes(".")
    ) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formData?.address?.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    if (!formData?.state) {
      newErrors.state = "State is required";
      valid = false;
    }

    if (!formData?.district) {
      newErrors.district = "District is required";
      valid = false;
    }

    if (!formData?.city?.trim()) {
      newErrors.city = "City is required";
      valid = false;
    }

    if (!formData?.zipCode?.trim()) {
      newErrors.zipCode = "Zip code is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const clearFormData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      district: "",
      city: "",
      zipCode: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      district: "",
      city: "",
      zipCode: "",
    });
    setAvailableDistricts([]);
  };

  const handleSubmit = async () => {
    if (validate()) {
      setTableData([...tableData, formData]);
      const userData = formData;
      try {
        const response = await axios.post(
          "http://localhost:8000/employee",
          userData
        );
        console.log("User created successfully:", response.data);
      } catch (error) {
        console.error("Error creating user:", error);
        alert(
          error.response?.data?.message ||
            "Something went wrong while saving user!"
        );
      }
      clearFormData();
    }
  };

  return (
    <Box sx={{ height: "100%", width: "30%", minWidth: 300, padding: "20px" }}>
      <Box
        sx={{ padding: "16px 0", textAlign: "center", marginBottom: "16px" }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#333", fontSize: "18px", fontWeight: 500 }}
        >
          Add / Edit the single record Here
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SmallTextField
          label="First Name"
          value={formData?.firstName}
          onChange={handleInputChange("firstName")}
          size="small"
          error={!!errors.firstName}
          helperText={errors.firstName}
        />

        <SmallTextField
          label="Last Name"
          value={formData?.lastName}
          onChange={handleInputChange("lastName")}
          size="small"
          error={!!errors.lastName}
          helperText={errors.lastName}
        />

        <SmallTextField
          label="Phone (Primary)"
          value={formData?.phone}
          onChange={handleInputChange("phone")}
          size="small"
          type="tel"
          error={!!errors.phone}
          helperText={errors.phone}
        />

        <SmallTextField
          label="Email"
          value={formData?.email}
          onChange={handleInputChange("email")}
          size="small"
          type="email"
          error={!!errors.email}
          helperText={errors.email}
        />

        <SmallTextField
          label="Address"
          value={formData?.address}
          onChange={handleInputChange("address")}
          size="small"
          error={!!errors.address}
          helperText={errors.address}
        />

        <Box display="flex" gap={1}>
          <SmallTextField
            select
            label="State"
            value={formData?.state}
            onChange={handleInputChange("state")}
            size="small"
            error={!!errors.state}
            helperText={errors.state}
          >
            {stateOptions.map((opt, index) => (
              <MenuItem key={index} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </SmallTextField>

          <SmallTextField
            select
            label="District"
            value={formData?.district}
            onChange={handleInputChange("district")}
            size="small"
            disabled={!availableDistricts?.length}
            error={!!errors.district}
            helperText={errors.district}
          >
            {availableDistricts?.map((opt, index) => (
              <MenuItem key={index} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </SmallTextField>
        </Box>

        <Box display="flex" gap={1}>
          <SmallTextField
            label="City"
            value={formData?.city}
            onChange={handleInputChange("city")}
            size="small"
            error={!!errors.city}
            helperText={errors.city}
          />

          <SmallTextField
            label="Zip Code"
            value={formData?.zipCode}
            onChange={handleInputChange("zipCode")}
            size="small"
            error={!!errors.zipCode}
            helperText={errors.zipCode}
          />
        </Box>
      </Box>

      <Box display="flex" mt={3} gap={1}>
        <Button
          variant="outlined"
          sx={{
            color: "#e74c3c",
            fontSize: "13px",
            borderColor: "#e74c3c",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { borderColor: "#c0392b", backgroundColor: "#fdf2f2" },
          }}
          onClick={clearFormData}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#3f406c",
            fontSize: "13px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#35375d" },
          }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
