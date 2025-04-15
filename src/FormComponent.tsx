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
    {/* เข้าบัญชีใด */}
    <div className="form-control">
      <label className="block">
        เข้าบัญชีใด:<span className="text-red-500">*</span>
      </label>
      <select
        name="account"
        value={formData.account}
        onChange={handleChange}
        className={`p-2 border rounded w-full ${
          error.account ? "border-red-500" : ""
        }`}
      >
        <option value="">-- เลือกบัญชี --</option>
        <option value="e donation">e donation</option>
        <option value="Cash">Cash</option>
        <option value="KTB Bank">KTB Bank</option>
      </select>
      {error.account && <p className="text-red-500 text-sm">{error.account}</p>}
    </div>

    {/* เวลาเงินเข้าบัญชี */}
    <div className="form-control">
      <label className="block">
        เวลาเงินเข้าบัญชี (ชั่วโมง:นาที):<span className="text-red-500">*</span>
      </label>
      <div className="flex space-x-2">
        <input
          type="number"
          name="depositHour"
          value={formData.depositHour}
          onChange={handleChange}
          className={`p-2 border rounded w-[80px] text-center" ${
            error.depositHour ? "border-red-500" : ""
          }`}
          placeholder="ชั่วโมง"
          min={0}
          max={23}
        />
        <span className="self-center">:</span>
        <input
          type="number"
          name="depositMinute"
          value={formData.depositMinute}
          onChange={handleChange}
          className={`p-2 border rounded w-[80px] text-center" ${
            error.depositHour ? "border-red-500" : ""
          }`}
          placeholder="นาที"
          min={0}
          max={59}
        />
      </div>
      {error.depositHour && (
        <p className="text-red-500 text-sm">{error.date}</p>
      )}
    </div>

    {/* ช่องทางติดต่อเจ้าภาพ */}
    <div className="form-control">
      <label className="block">ช่องทางติดต่อเจ้าภาพ:</label>
      <input
        name="contactChannel"
        value={formData.contactChannel}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>

    {/* ID เจ้าภาพ */}
    <div className="form-control">
      <label className="block">ID เจ้าภาพ:</label>
      <input
        name="contactId"
        value={formData.contactId}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>

    {/* ผู้นำบุญ */}
    <div className="form-control">
      <label className="block">ผู้นำบุญ:</label>
      <input
        name="leaderName"
        value={formData.leaderName}
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />
    </div>

    {/* ✅ ช่อง radio: แสดงในรายงานภาษี */}
    <div className="form-control">
      <label className="block">
        แสดงในรายงานภาษี<span className="text-red-500">*</span>{" "}
        <span className="text-sm text-gray-500">(ถ้าเป็น e donation = No)</span>
      </label>
      <div className="flex items-center space-x-4 mt-1">
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="taxReport"
            value="Yes"
            checked={formData.taxReport === "Yes"}
            onChange={handleChange}
          />
          <span className="ml-2">Yes</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="taxReport"
            value="No"
            checked={formData.taxReport === "No"}
            onChange={handleChange}
          />
          <span className="ml-2">No</span>
        </label>
      </div>
      {error.taxReport && (
        <p className="text-red-500 text-sm">{error.taxReport}</p>
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
