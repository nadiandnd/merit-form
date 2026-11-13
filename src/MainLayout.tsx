import { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="app-shell">
      <header className="page-header">
        <img className="brand-mark" src="/assets/image/logo.png" alt="วัดป่าโค" />
        <h1 className="page-title">แบบฟอร์มข้อมูลการรับบริจาค</h1>
        <p className="page-subtitle">วัดป่าโค · บันทึกข้อมูลเพื่อจัดทำอนุโมทนาบัตร</p>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
