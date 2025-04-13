import "./App.css";
import { useState, useRef } from "react";
import FormComponent from "./FormComponent";
import CardComponent from "./CardComponent";
import MainLayout from "./MainLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FormData } from "./types/types";
const App = () => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    date: "",
    name: "",
    project: "",
    amount: "",
  });

  const [submittedData, setSubmittedData] = useState<FormData[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const donationTypes = [
    "ภัตตาหาร,ข้าวสาร,ปานะ",
    "บุพเปตพลี,พิธีอุทิศส่วนกุศลวันพระใหญ่",
    "ยา,อุปกรณ์การแพทย์เพื่อพระภิกษุอาพาธ",
    "ปล่อยสัตว์ปล่อยปลา",
    "เผยแผ่ธรรมะออนไลน์และบำรุงวัด",
    "การศึกษาพระภิกษุ-สามเณร,บัณฑิตถาวร",
    "ทอดกฐินปี",
    "ทอดผ้าป่า",
    "บรรพชาธรรมทายาทอุดมศึกษา ฤดูร้อน,ฤดูฝน,ฤดูหนาว",
    "บรรพชาสามเณรทั่วไทย",
    "บำรุงวัด ค่าน้ำ ค่าไฟ",
    "ผ้าไตรจีวร,อัฏฐบริขาร",
    "ยานพาหนะ",
    "สื่อธรรมะ",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      const rawDigits = value.replace(/\D/g, "");

      // Limit the digits to 6
      if (rawDigits.length > 6) return;

      // Format the date as dd/mm/yyyy
      let formatted = rawDigits;
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
      if (formatted.length > 5) {
        formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
      }

      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      // Other fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (data: FormData) => {
    const errors: string[] = [];

    if (!data.name || !data.project || !data.date || !data.amount || !data.id) {
      errors.push("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    }

    const [dayStr, monthStr, yearStr] = data.date.split("/");
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);

    if (
      month > 12 ||
      day > 31 ||
      dayStr.length !== 2 ||
      monthStr.length !== 2 ||
      yearStr.length !== 2
    ) {
      errors.push("วันที่ไม่ถูกต้อง");
    }

    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ตรวจสอบความถูกต้องของฟอร์ม
    const errors = validateForm(formData);

    if (errors.length > 0) {
      // ถ้ามีข้อผิดพลาด ให้แสดงข้อความเตือน
      alert(errors.join("\n"));
      return;
    }

    // ถ้าถูกต้อง ให้เพิ่มข้อมูลลงใน `submittedData`
    setSubmittedData([...submittedData, formData]);
    setFormData({ id: "", date: "", name: "", project: "", amount: "" });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    autoTable(doc, {
      head: [["เลขที่", "วันที่", "ชื่อ", "ประเภทบุญ", "จำนวน"]],
      body: submittedData.map((item) => [
        item.id,
        item.name,
        item.date,
        item.project,
        item.amount,
      ]),
      styles: { fontSize: 14 },
    });
    doc.save("form-data.pdf");
  };

  const exportExcel = () => {
    if (submittedData.length === 0) return;

    const worksheetData = submittedData.map((item, index) => ({
      เลขที่: index + 1,
      วันที่: item.date,
      ชื่อผู้บริจาค: item.name,
      ประเภทบุญ: item.project,
      จำนวนเงิน: item.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูล");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "form-data.xlsx");
  };

  const saveCardAsImage = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "card.png";
    link.click();
  };

  const formatThaiDate = (dateStr: string) => {
    const [dayStr, monthStr, yearStr] = dateStr.split("/");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    let year = parseInt(yearStr, 10);

    // Convert to Thai year
    if (year < 100) {
      const currentBEYear = new Date().getFullYear() + 543;
      year = Math.floor(currentBEYear / 100) * 100 + year;
    }

    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    return `${day} ${thaiMonths[month - 1]} พ.ศ. ${year}`;
  };

  const latestEntry = submittedData[submittedData.length - 1];

  return (
    <MainLayout>
      <div className="absolute top-12 right-4 flex gap-3 z-50">
        <button
          onClick={exportPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
        >
          Export Table as PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
        >
          Export Table as Excel
        </button>
      </div>

      <FormComponent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        donationTypes={donationTypes}
      />

      {submittedData.length > 0 && (
        <>
          <CardComponent
            latestEntry={latestEntry}
            formatThaiDate={formatThaiDate}
            saveCardAsImage={saveCardAsImage}
            ref={cardRef}
          />
        </>
      )}
    </MainLayout>
  );
};

export default App;
