import "./App.css";
import { useState, useRef, ReactNode } from "react";
import jsPDF from "jspdf";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import thaiBaht from "thai-baht-text";

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
    autoTable(doc, {
      head: [["No.", "Date", "Name", "Project", "Amount"]],
      body: submittedData.map((item) => [
        item.id,
        item.name,
        item.date,
        item.project,
        item.amount,
      ]),
    });
    doc.save("form-data.pdf");
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
            className="bg-green-500 text-white px-4 py-2 rounded mb-6"
          >
            Export Table as PDF
          </button>

          <div
            ref={cardRef}
            className="bg-white shadow p-4 rounded w-full max-w-md mb-4"
          >
            <h2 className="text-lg font-semibold mb-2">อนุโมทนาบัตร</h2>
            <p>ขออนุโมทนาบุญต่อ</p>
            <p>{latestEntry?.name || "-"}</p>
            <p>
              เป็นจำนวนเงิน
              {latestEntry?.amount != null
                ? `${new Intl.NumberFormat("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(Number(latestEntry.amount))} บาท`
                : "-"}{" "}
              ({thaiBaht(latestEntry?.amount || "-")})
            </p>
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
