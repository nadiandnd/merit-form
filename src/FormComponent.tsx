// FormComponent.tsx
import React from "react";
import { FormData } from "./types/types";

type FormProps = {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  donationTypes: string[];
  error: Record<string, string>;
};

const FormComponent = ({
  formData,
  handleChange,
  handleSubmit,
  donationTypes,
  error,
}: FormProps) => (
  <form onSubmit={handleSubmit} className="mb-6 space-y-4">
    <div className="form-control">
      <label className="block">
        เลขที่:<span className="text-red-500">*</span>
      </label>

      <input
        name="id"
        value={formData.id}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.id ? "border-red-500" : ""
        }`}
      />
      {error.id && <p className="text-red-500 text-sm">{error.id}</p>}
    </div>
    <div className="form-control">
      <label className="block">
        วันที่:<span className="text-red-500">*</span>
      </label>

      <input
        name="date"
        value={formData.date}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.date ? "border-red-500" : ""
        }`}
      />
      {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
    </div>
    <div className="form-control">
      <label className="block">
        ชื่อ-นามสกุล:<span className="text-red-500">*</span>
      </label>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.name ? "border-red-500" : ""
        }`}
      />
      {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
    </div>
    <div className="form-control">
      <label className="block">
        จำนวนเงิน:<span className="text-red-500">*</span>
      </label>

      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.amount ? "border-red-500" : ""
        }`}
      />
      {error.amount && <p className="text-red-500 text-sm">{error.amount}</p>}
    </div>
    <div className="form-control">
      <label className="block">
        ประเภทบุญ:<span className="text-red-500">*</span>
      </label>

      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.project ? "border-red-500" : ""
        }`}
      >
        <option value="">-- กรุณาเลือกประเภทบุญ --</option>
        {donationTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
        <option value="other">อื่นๆ ระบุ</option>
      </select>
      {error.project && <p className="text-red-500 text-sm">{error.project}</p>}
      {formData.project === "other" && (
        <input
          type="text"
          name="customProject"
          placeholder="กรอกประเภทบุญของคุณ"
          value={formData.customProject || ""}
          onChange={handleChange}
          className="mt-2 p-2 border-b w-full outline-none"
        />
      )}
    </div>
    <div className="flex justify-center">
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded "
      >
        Submit
      </button>
    </div>
  </form>
);

export default FormComponent;
