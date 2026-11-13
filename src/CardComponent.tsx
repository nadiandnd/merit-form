import React, { ForwardedRef } from "react";
import thaiBaht from "thai-baht-text";
import { FormData } from "./types/types";

type CardProps = {
  latestEntry: FormData;
  formatThaiDate: (dateStr: string) => string;
  saveCardAsImage: () => void;
  openCardImageInNewTab: () => void;
  downloadError: string;
  imagePreviewUrl: string;
};

const CardComponent = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      latestEntry,
      formatThaiDate,
      saveCardAsImage,
      openCardImageInNewTab,
      downloadError,
      imagePreviewUrl,
    }: CardProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <>
        <div
          className="donation-card-frame"
          role="region"
          aria-label="บัตรอนุโมทนา เลื่อนแนวนอนเพื่อดูบัตรให้ครบ"
          tabIndex={0}
        >
          <div
            ref={ref}
            className="donation-card relative cursor-zoom-in rounded bg-white px-8 py-6 text-center shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 space-y-1 font-sarabun"
            role="button"
            tabIndex={0}
            aria-label="เปิดภาพบัตรอนุโมทนาในแท็บใหม่"
            onClick={openCardImageInNewTab}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCardImageInNewTab();
              }
            }}
            style={{
              backgroundImage: 'url("/assets/image/glow.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-start gap-3">
              <img
                src="/assets/image/logo.png"
                alt="Logo"
                className="h-14 pt-1 "
              />
              <div className="flex flex-col items-start pb-2">
                <div className="text-xl font-bold text-orange-700">
                  วัดป่าโค
                </div>
                <div className="text-sm text-gray-600">
                  เลขประจำตัวผู้เสียภาษี 0994002241655
                </div>
              </div>
            </div>

            <div className="text-xl font-semibold pt-3">อนุโมทนาบัตร</div>
            <div className="absolute top-5 right-5 text-right">
              <div className="text-sm text-gray-600">
                เลขที่ {latestEntry.id || "-"}
              </div>
              <div className="text-sm text-gray-600">
                วันที่ {formatThaiDate(latestEntry.date) || "-"}
              </div>
            </div>

            <p className="mt-4 pt-2">ขออนุโมทนาบุญต่อ</p>
            <p className="p-2 text-xl font-semibold">
              {latestEntry.name || "-"}
            </p>
            <p className="pt-1 pb-2">
              ผู้มีกุศลจิตศรัทธา เพื่อร่วมเป็นเจ้าภาพ
              <br />
              {latestEntry.project === "other"
                ? latestEntry.customProject || "-"
                : latestEntry.project || "-"}
            </p>

            <p>
              เป็นจำนวนเงิน{" "}
              {latestEntry.amount
                ? `${Number(latestEntry.amount).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                  })} บาท`
                : "-"}{" "}
              ({thaiBaht(latestEntry.amount || "-")})
            </p>

            <div className="p-3 mt-4 text-sm text-gray-800 leading-relaxed">
              <p>
                ด้วยอานิสงส์ทานบารมีที่ได้บำเพ็ญในครั้งนี้
                จงเป็นปัจจัยให้ท่านได้สำเร็จมรรคผล
              </p>
              <p>
                มีดวงตาเห็นธรรมพร้อมทั้งวิชชาและจรณะ ตราบเท่าเข้าสู่พระนิพพาน
                เทอญฯ
              </p>
            </div>

            <span className="flex justify-end">
              <div className="flex flex-col items-center text-sm text-gray-600 pr-6">
                <div className="relative h-20 w-52">
                  <img
                    src="/assets/image/signature.png"
                    alt="ลายเซ็น"
                    className="absolute top-0 left-0 h-20 w-auto"
                  />
                  <img
                    src="/assets/image/remark.png"
                    alt="ตราประทับ"
                    className="absolute top-0 left-24 h-16 w-auto opacity-30"
                  />
                </div>

                <div className="text-sm text-gray-800">
                  พระครูสมุห์ธีรพงษ์ ธีรวํโส (เจ้าอาวาส)
                </div>
              </div>
            </span>
          </div>
        </div>
        <p className="donation-card-hint">เลื่อนแนวนอนเพื่อดูบัตร</p>

        <div className="flex justify-center mt-4">
          <button onClick={saveCardAsImage} className="button-primary">
            บันทึกเป็นรูปภาพ
          </button>
        </div>
        {imagePreviewUrl && (
          <img
            src={imagePreviewUrl}
            alt="รูปภาพบัตรอนุโมทนา แตะค้างเพื่อบันทึก"
            className="mx-auto mt-4 h-auto max-w-full rounded shadow"
          />
        )}
        {downloadError && (
          <p className="field-error" role="alert">
            {downloadError}
          </p>
        )}
      </>
    );
  },
);
CardComponent.displayName = "CardComponent";
export default CardComponent;
