import "./App.css";
import { useState, useRef, ReactNode } from "react";
import jsPDF from "jspdf";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import thaiBaht from "thai-baht-text";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./assets/fonts/THSarabunNew-normal.js";
import "./assets/fonts/THSarabunNew-bold.js";
type FormData = {
  id: string;
  date: string;
  name: string;
  project: string;
  amount: string;
};

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-2xl font-bold mb-4">
        แบบฟอร์มข้อมูลการรับบริจาค ของวัดป่าโค
      </header>
      <main>{children}</main>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState<FormData>({
    id: "",
    date: "",
    name: "",
    project: "",
    amount: "",
  });
  const [submittedData, setSubmittedData] = useState<FormData[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      const rawDigits = value.replace(/\D/g, "");

      // ไม่ให้พิมพ์เกิน 6 ตัวเลข
      if (rawDigits.length > 6) return;

      // ใส่ / หลังตำแหน่งที่เหมาะสม
      let formatted = rawDigits;
      if (formatted.length > 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
      if (formatted.length > 5) {
        formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
      }

      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      // อื่น ๆ เช่น name, email
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.project ||
      !formData.date ||
      !formData.amount ||
      !formData.id
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    setSubmittedData([...submittedData, formData]);
    setFormData({ id: "", date: "", name: "", project: "", amount: "" });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont("THSarabunNew", "normal");
    autoTable(doc, {
      head: [["เลขที่", "วันที่", "ชื่อ", "ประเภทบุญ", "จำนวน"]],
      body: submittedData.map((item) => [
        item.id,
        item.name,
        item.date,
        item.project,
        item.amount,
      ]),
      styles: {
        font: "THSarabunNew",
        fontSize: 14,
      },
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

    // ถ้าเป็นปี ค.ศ. ให้บวก 543
    if (year < 100) {
      const currentBEYear = new Date().getFullYear() + 543;
      const currentShortYear = currentBEYear % 100;

      // ถ้าปีที่ใส่มาน้อยกว่าปีปัจจุบัน (2 หลัก) => อยู่ในศตวรรษนี้
      if (year >= currentShortYear) {
        year += 2500; // เช่น 68 -> 2568
      } else {
        year += 2600; // เช่น 01 -> 2601
      }
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
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block">เลขที่:</label>
          <input
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block">วันที่:</label>
          <input
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block">ชื่อ-นามสกุล:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block">จำนวนเงิน:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block">ประเภทบุญ:</label>
          <input
            name="project"
            value={formData.project}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {submittedData.length > 0 && (
        <>
          <button
            onClick={exportPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Table as PDF
          </button>
          <button
            onClick={exportExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Table as Excel
          </button>

          <div
            ref={cardRef}
            className="relative bg-white shadow px-8 py-6 rounded w-full max-w-2xl mx-auto text-center space-y-2 font-sarabun"
            style={{
              backgroundImage: 'url("/assets/image/glow.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* หัวเรื่อง */}
            <div className="flex gap-4 h-10 inline-block">
              <img
                src="/assets/image/logo.png"
                alt="Logo"
                className="h-14 pt-1 inline-block"
              />
              <div className="text-xl pt-2 font-bold text-orange-700">
                วัดป่าโค
              </div>
            </div>

            <div className="text-xl font-semibold">อนุโมทนาบัตร</div>
            <div className="absolute top-4 right-5 text-right">
              <div className="text-sm text-gray-600">
                เลขที่ {latestEntry?.id || "-"}
              </div>
              <div className="text-sm text-gray-600">
                วันที่ {formatThaiDate(latestEntry?.date) || "-"}
              </div>
            </div>

            {/* ผู้บริจาค */}
            <p className="mt-4 pt-1">ขออนุโมทนาบุญต่อ</p>
            <p className="p-3 text-xl font-semibold">
              {latestEntry?.name || "-"}
            </p>
            <p>
              ผู้มีกุศลจิตศรัทธา เพื่อร่วมเป็นเจ้าภาพ{" "}
              {latestEntry?.project || "-"}
            </p>

            {/* จำนวนเงิน */}
            <p className="mt-2">
              เป็นจำนวนเงิน{" "}
              {latestEntry?.amount
                ? `${Number(latestEntry.amount).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })} บาท`
                : "-"}{" "}
              ({thaiBaht(latestEntry?.amount || "-")})
            </p>

            {/* กรอบบทอวยพร */}
            <div className="p-3 mt-4 text-sm text-gray-800 leading-relaxed">
              <p>
                ด้วยอานิสงส์ทานบารมีที่ได้บำเพ็ญในครั้งนี้
                จงเป็นปัจจัยให้ท่านได้สำเร็จมรรคผล
              </p>
              <p>
                มีดวงตาเห็นธรรมพร้อมทั้งวิชชาธรรมกาย ครบถ้วนเข้าสู่พระนิพพาน
                เทอญฯ
              </p>
            </div>

            {/* ลายเซ็น */}
            <div className="flex flex-col items-end mt-6 text-sm text-gray-600">
              <div>
                <img src="/sign.png" alt="ลายเซ็น" className="h-10" />
              </div>
              <div>(ลายเซ็น) พระครูพิชาธรรม วิริยาวิไชย เจ้าอาวาส</div>
            </div>
          </div>

          <button
            onClick={saveCardAsImage}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Save Card as Image
          </button>
        </>
      )}
    </MainLayout>
  );
}

export default App;
