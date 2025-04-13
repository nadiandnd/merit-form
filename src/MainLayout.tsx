import { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-6">
      <header className="text-3xl font-extrabold text-center text-yellow-800 drop-shadow-md mt-4 mb-8 relative leading-relaxed">
        แบบฟอร์มข้อมูลการรับบริจาค
        <br />
        วัดป่าโค
      </header>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
