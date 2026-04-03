"use client";

import { useState } from "react";
import { BRANCH_OPTIONS, ROLE_OPTIONS, CONTRACT_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";

interface RegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function RegistrationForm({
  onSuccess,
  onCancel,
  isLoading = false,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "MALE",
    nickName: "",
    email: "",
    phone: "",
    nric: "",
    dob: "",
    homeAddress: "",
    branch: "HQ",
    role: "EMPLOYEE",
    contract: "PERMANENT",
    startDate: "",
    probation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!isValidEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!isValidPhone(formData.phone)) newErrors.phone = "Invalid phone format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9\s\-\+\(\)]{10,}$/.test(phone);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register employee");
      }

      const data = await response.json();
      const employeeId = data.data?.employeeId || "Generated";

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        gender: "MALE",
        nickName: "",
        email: "",
        phone: "",
        nric: "",
        dob: "",
        homeAddress: "",
        branch: "HQ",
        role: "EMPLOYEE",
        contract: "PERMANENT",
        startDate: "",
        probation: "",
      });

      // Show success message with employee ID
      setSuccessMessage(`✓ Employee registered successfully! Employee ID: ${employeeId}`);
      setTimeout(() => {
        setSuccessMessage(null);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add User</h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter first name"
              disabled={submitting || isLoading}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter last name"
              disabled={submitting || isLoading}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            >
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nick Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nick Name
            </label>
            <input
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter nick name"
              disabled={submitting || isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email address"
              disabled={submitting || isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter phone number"
              disabled={submitting || isLoading}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            >
              {BRANCH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contract */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract
            </label>
            <select
              name="contract"
              value={formData.contract}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            >
              {CONTRACT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            />
          </div>

          {/* Probation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Probation
            </label>
            <input
              type="date"
              name="probation"
              value={formData.probation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            />
          </div>

          {/* NRIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NRIC
            </label>
            <input
              type="text"
              name="nric"
              value={formData.nric}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter NRIC"
              disabled={submitting || isLoading}
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={submitting || isLoading}
            />
          </div>

          {/* Home Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Address
            </label>
            <input
              type="text"
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter home address"
              disabled={submitting || isLoading}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting || isLoading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {submitting ? "Registering..." : "Register Employee"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting || isLoading}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
