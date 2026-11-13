import "./App.css";
import { useState, useRef, useEffect } from "react";
import FormComponent from "./FormComponent";
import CardComponent from "./CardComponent";
import MainLayout from "./MainLayout";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { FormData } from "./types/types";
import "./assets/fonts/THSarabunNew-normal.js";
import "./assets/fonts/THSarabunNew-bold.js";

const validateDate = (date: string | undefined): string | undefined => {
  if (!date) return "กรุณากรอกวันที่";

  const dateParts = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(date);
  if (!dateParts) {
    return "กรุณากรอกวันที่ให้ครบในรูปแบบ วว/ดด/ปป เช่น 01/01/69";
  }

  const [, dayText, monthText, yearText] = dateParts;
  const day = Number(dayText);
  const month = Number(monthText);
  const buddhistYear =
    Math.floor((new Date().getFullYear() + 543) / 100) * 100 +
    Number(yearText);

  if (month < 1 || month > 12) {
    return "เดือนไม่ถูกต้อง กรุณาระบุเดือนตั้งแต่ 01 ถึง 12";
  }

  if (day < 1) {
    return "วันไม่ถูกต้อง กรุณาระบุวันที่ตั้งแต่ 01 เป็นต้นไป";
  }

  const gregorianYear = buddhistYear - 543;
  const daysInMonth = new Date(gregorianYear, month, 0).getDate();
  if (day > daysInMonth) {
    return `วันที่ไม่ถูกต้อง เดือนนี้มีได้ไม่เกิน ${daysInMonth} วัน`;
  }

  return undefined;
};

const formatDateInput = (digits: string): string => {
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 6);

  if (digits.length < 2) return day;
  if (digits.length === 2) return `${day}/`;
  if (digits.length < 4) return `${day}/${month}`;
  if (digits.length === 4) return `${day}/${month}/`;
  return `${day}/${month}/${year}`;
};

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    date: "",
    name: "",
    project: "",
    customProject: "",
    amount: "",
  });

  const [submittedData, setSubmittedData] = useState<FormData[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [dateDirty, setDateDirty] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    if (!imagePreviewUrl) return;
    return () => URL.revokeObjectURL(imagePreviewUrl);
  }, [imagePreviewUrl]);

  const cardRef = useRef<HTMLDivElement>(null);

  const buddhistYearShort = String(new Date().getFullYear() + 543).slice(-2);

  const donationTypes = [
    "ภัตตาหาร,ข้าวสาร,ปานะ",
    "บุพเปตพลี,พิธีอุทิศส่วนกุศลวันพระใหญ่",
    "ยา,อุปกรณ์การแพทย์เพื่อพระภิกษุอาพาธ",
    "ปล่อยสัตว์ปล่อยปลา",
    "เผยแผ่ธรรมะออนไลน์และบำรุงวัด",
    "การศึกษาพระภิกษุ-สามเณร,บัณฑิตถาวร",
    `ทอดกฐินปี ${buddhistYearShort}`,
    "ทอดผ้าป่า",
    "บรรพชาธรรมทายาทอุดมศึกษา ฤดูร้อน,ฤดูฝน,ฤดูหนาว",
    "บรรพชาสามเณรทั่วไทย",
    "บำรุงวัด ค่าน้ำ ค่าไฟ",
    "ผ้าไตรจีวร,อัฏฐบริขาร",
    "ยานพาหนะ",
    "สื่อธรรมะ",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      const rawDigits = value.replace(/\D/g, "");

      if (rawDigits.length > 6) return;

      setFormData((prev) => ({
        ...prev,
        [name]: formatDateInput(rawDigits),
      }));
      setDateDirty(true);
    } else {
      // Other fields
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const caretAtEnd =
      input.selectionStart === input.value.length &&
      input.selectionEnd === input.value.length;
    if (e.key !== "Backspace" || !caretAtEnd || !input.value.endsWith("/")) {
      return;
    }

    e.preventDefault();
    const remainingDigits = input.value.replace(/\D/g, "").slice(0, -1);
    setFormData((prev) => ({
      ...prev,
      date: formatDateInput(remainingDigits),
    }));
  };

  const validateForm = (data: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name) errors.name = "กรุณากรอกชื่อ";
    if (!data.project) errors.project = "กรุณาเลือกประเภทบุญ";
    const dateError = validateDate(data.date);
    if (dateError) errors.date = dateError;

    if (!data.amount) errors.amount = "กรุณากรอกจำนวนเงิน";
    if (!data.id) errors.id = "กรุณากรอกเลขที่";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setDateDirty(true);
      return;
    }

    setSubmittedData([...submittedData, formData]);
    setFormErrors({});
    setDateDirty(false);
    setFormData({
      id: "",
      date: "",
      name: "",
      project: "",
      customProject: "",
      amount: "",
    });
  };

  // const exportPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.setFont("THSarabunNew", "normal");
  //   autoTable(doc, {
  //     head: [["เลขที่", "วันที่", "ชื่อ", "ประเภทบุญ", "จำนวน"]],
  //     body: submittedData.map((item) => [
  //       item.id,
  //       item.name,
  //       item.date,
  //       item.project,
  //       item.amount,
  //     ]),
  //     styles: {
  //       font: "THSarabunNew",
  //       fontSize: 14,
  //     },
  //   });
  //   doc.save("form-data.pdf");
  // };

  // const exportExcel = () => {
  //   if (submittedData.length === 0) return;

  //   const worksheetData = submittedData.map((item, index) => ({
  //     เลขที่: item.id,
  //     วันที่: item.date,
  //     ชื่อผู้บริจาค: item.name,
  //     ประเภทบุญ: item.project === "other" ? item.customProject : item.project,
  //     จำนวนเงิน: item.amount,
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "ข้อมูล");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(data, "form-data.xlsx");
  // };

  const createCardImage = async () => {
    const card = cardRef.current;
    if (!card) return null;

    const canvas = await html2canvas(card, {
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Unable to create PNG image"));
        }
      }, "image/png");
    });
  };

  const saveCardAsImage = async () => {
    setDownloadError("");
    try {
      const image = await createCardImage();
      if (!image) return;

      if (/Line\/[\d.]+/i.test(navigator.userAgent)) {
        setImagePreviewUrl(URL.createObjectURL(image));
      } else {
        saveAs(image, "card.png");
      }
    } catch (error) {
      console.error("Failed to save donation card image:", error);
      setDownloadError("บันทึกรูปภาพไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
  };

  const openCardImageInNewTab = async () => {
    const imageWindow = window.open("about:blank", "_blank");
    if (!imageWindow) {
      setDownloadError("เปิดแท็บใหม่ไม่สำเร็จ กรุณาอนุญาตป๊อปอัปในเบราว์เซอร์");
      return;
    }

    setDownloadError("");
    try {
      const image = await createCardImage();
      if (!image) {
        imageWindow.close();
        return;
      }

      const imageUrl = URL.createObjectURL(image);
      imageWindow.location.href = imageUrl;
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 40_000);
    } catch (error) {
      imageWindow.close();
      console.error("Failed to open donation card image:", error);
      setDownloadError("เปิดรูปภาพไม่สำเร็จ กรุณาลองอีกครั้ง");
    }
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
  const visibleErrors = { ...formErrors };
  if (dateDirty) {
    const dateError = validateDate(formData.date);
    if (dateError) {
      visibleErrors.date = dateError;
    } else {
      delete visibleErrors.date;
    }
  }

  return (
    <MainLayout>
      {/* TODO: Add this feature back in the future after backecd implementation is done */}
      {/* <div className="absolute top-12 right-4 flex gap-3 z-50">
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
      </div> */}

      <FormComponent
        formData={formData}
        handleChange={handleChange}
        handleDateKeyDown={handleDateKeyDown}
        handleSubmit={handleSubmit}
        donationTypes={donationTypes}
        error={visibleErrors}
      />

      {submittedData.length > 0 && (
        <>
          <CardComponent
            latestEntry={latestEntry}
            formatThaiDate={formatThaiDate}
            saveCardAsImage={saveCardAsImage}
            openCardImageInNewTab={openCardImageInNewTab}
            downloadError={downloadError}
            imagePreviewUrl={imagePreviewUrl}
            ref={cardRef}
          />
        </>
      )}
    </MainLayout>
  );
};

export default App;
