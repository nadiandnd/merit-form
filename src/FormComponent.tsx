// FormComponent.tsx
import React from "react";
import { FormData } from "./types/types";

type FormProps = {
  formData: FormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleDateKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  donationTypes: string[];
  error: Record<string, string>;
};

const FormComponent = ({
  formData,
  handleChange,
  handleDateKeyDown,
  handleSubmit,
  donationTypes,
  error,
}: FormProps) => (
  <form onSubmit={handleSubmit} className="form-card">
    <div className="form-heading">
      <h2>กรอกข้อมูลการบริจาค</h2>
      <p>กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน</p>
    </div>
    <div className="form-grid">
      <div className="form-control">
        <label className="field-label" htmlFor="donation-id">
          เลขที่<span className="required-mark" aria-hidden="true">*</span>
        </label>
        <input
          id="donation-id"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="เช่น 001"
          className="field-input"
          aria-invalid={Boolean(error.id)}
          aria-describedby={error.id ? "donation-id-error" : undefined}
        />
        {error.id && (
          <p className="field-error" id="donation-id-error" role="alert">
            {error.id}
          </p>
        )}
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="donation-date">
          วันที่<span className="required-mark" aria-hidden="true">*</span>
        </label>
        <input
          id="donation-date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          onKeyDown={handleDateKeyDown}
          placeholder="วว/ดด/ปป"
          inputMode="numeric"
          className="field-input"
          aria-invalid={Boolean(error.date)}
          aria-describedby={
            error.date ? "donation-date-hint donation-date-error" : "donation-date-hint"
          }
        />
        <p className="field-hint" id="donation-date-hint">
          ระบุวัน/เดือน/ปี พ.ศ. เช่น 01/01/
          {String(new Date().getFullYear() + 543).slice(-2)}
        </p>
        {error.date && (
          <p className="field-error" id="donation-date-error" role="alert">
            {error.date}
          </p>
        )}
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="donation-name">
          ชื่อ-นามสกุล<span className="required-mark" aria-hidden="true">*</span>
        </label>
        <input
          id="donation-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="ชื่อผู้บริจาค"
          autoComplete="name"
          className="field-input"
          aria-invalid={Boolean(error.name)}
          aria-describedby={error.name ? "donation-name-error" : undefined}
        />
        {error.name && (
          <p className="field-error" id="donation-name-error" role="alert">
            {error.name}
          </p>
        )}
      </div>
      <div className="form-control">
        <label className="field-label" htmlFor="donation-amount">
          จำนวนเงิน (บาท)
          <span className="required-mark" aria-hidden="true">*</span>
        </label>
        <input
          id="donation-amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          inputMode="decimal"
          className="field-input"
          aria-invalid={Boolean(error.amount)}
          aria-describedby={error.amount ? "donation-amount-error" : undefined}
        />
        {error.amount && (
          <p className="field-error" id="donation-amount-error" role="alert">
            {error.amount}
          </p>
        )}
      </div>
      <div className="form-control form-control--wide">
        <label className="field-label" htmlFor="donation-project">
          ประเภทบุญ<span className="required-mark" aria-hidden="true">*</span>
        </label>
        <select
          id="donation-project"
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="field-select"
          aria-invalid={Boolean(error.project)}
          aria-describedby={
            error.project ? "donation-project-error" : undefined
          }
        >
          <option value="">-- กรุณาเลือกประเภทบุญ --</option>
          {donationTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
          <option value="other">อื่นๆ ระบุ</option>
        </select>
        {error.project && (
          <p className="field-error" id="donation-project-error" role="alert">
            {error.project}
          </p>
        )}
        {formData.project === "other" && (
          <div className="mt-3">
            <label className="field-label" htmlFor="custom-project">
              ระบุประเภทบุญ
            </label>
            <input
              id="custom-project"
              type="text"
              name="customProject"
              placeholder="กรอกประเภทบุญ"
              value={formData.customProject || ""}
              onChange={handleChange}
              className="field-input"
            />
          </div>
        )}
      </div>
    </div>
    <div className="form-actions">
      <button type="submit" className="button-primary">
        บันทึกข้อมูล
      </button>
    </div>
  </form>
);

export default FormComponent;
