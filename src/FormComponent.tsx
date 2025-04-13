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
};

const FormComponent = ({
  formData,
  handleChange,
  handleSubmit,
  donationTypes,
}: FormProps) => (
  <form onSubmit={handleSubmit} className="mb-6 space-y-4">
    <div className="form-control">
      <label className="block">เลขที่:</label>
      <input
        name="id"
        value={formData.id}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="form-control">
      <label className="block">วันที่:</label>
      <input
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="form-control">
      <label className="block">ชื่อ-นามสกุล:</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="form-control">
      <label className="block">จำนวนเงิน:</label>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>
    <div className="form-control">
      <label className="block">ประเภทบุญ:</label>
      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      >
        <option value="">-- กรุณาเลือกประเภทบุญ --</option>
        {donationTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
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
