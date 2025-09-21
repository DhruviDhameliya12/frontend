import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 8,
    minWidth: "500px",
    maxWidth: "600px",
    width: "90%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "8px",
  borderBottom: "1px solid #e0e0e0",
}));

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

const INITIAL_FORM_STATE = {
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

const INITIAL_ERROR_STATE = {
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

const EditModal = ({ open, onClose, recordData, onUpdate }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && recordData) {
      setFormData({ ...recordData });
      setAvailableDistricts(districtMap[recordData.state] || []);
      setErrors(INITIAL_ERROR_STATE);
    }
  }, [open, recordData]);

  useEffect(() => {
    if (!open) {
      setFormData(INITIAL_FORM_STATE);
      setErrors(INITIAL_ERROR_STATE);
      setAvailableDistricts([]);
      setIsSubmitting(false);
    }
  }, [open]);

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

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Typography variant="h6" sx={{ fontSize: "18px", fontWeight: 500 }}>
          Edit the single record Here
        </Typography>
        <IconButton onClick={handleClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent
        sx={{
          padding: "24px",
          "&.MuiDialogContent-root": {
            paddingTop: "24px",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SmallTextField
            label="First Name"
            value={formData?.firstName}
            onChange={handleInputChange("firstName")}
            size="small"
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={isSubmitting}
          />

          <SmallTextField
            label="Last Name"
            value={formData?.lastName}
            onChange={handleInputChange("lastName")}
            size="small"
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={isSubmitting}
          />

          <SmallTextField
            label="Phone (Primary)"
            value={formData?.phone}
            onChange={handleInputChange("phone")}
            size="small"
            type="tel"
            error={!!errors.phone}
            helperText={errors.phone}
            disabled={isSubmitting}
          />

          <SmallTextField
            label="Email"
            value={formData?.email}
            onChange={handleInputChange("email")}
            size="small"
            type="email"
            error={!!errors.email}
            helperText={errors.email}
            disabled={isSubmitting}
          />

          <SmallTextField
            label="Address"
            value={formData?.address}
            onChange={handleInputChange("address")}
            size="small"
            error={!!errors.address}
            helperText={errors.address}
            disabled={isSubmitting}
          />

          <Box display="flex" gap={1}>
            <SmallTextField
              label="City"
              value={formData?.city}
              onChange={handleInputChange("city")}
              size="small"
              error={!!errors.city}
              helperText={errors.city}
              disabled={isSubmitting}
            />

            <SmallTextField
              label="Zip Code"
              value={formData?.zipCode}
              onChange={handleInputChange("zipCode")}
              size="small"
              error={!!errors.zipCode}
              helperText={errors.zipCode}
              disabled={isSubmitting}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px 24px", gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            color: "#e74c3c",
            fontSize: "13px",
            borderColor: "#e74c3c",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              borderColor: "#c0392b",
              backgroundColor: "#fdf2f2",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#3f406c",
            fontSize: "13px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": { backgroundColor: "#35375d" },
          }}
        >
          {isSubmitting ? "Updating..." : "Save"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default EditModal;
