import { cookies } from "next/headers";
import { CookiesProvider } from 'next-client-cookies/server';
import { MainProvider } from "@/context/MainContext";
import HeaderPage from "@/components/HeaderPage";
import LeftMenuPage from "@/components/LeftMenu";

import "./globals.css";
import "./style/global.scss";
import "./style/controls.scss";
import "primereact/resources/themes/fluent-light/theme.css";

import Header from "./Header";

export const metadata = {
  title: "Manage tournaments",
  description: "Manage your tournaments",
};

export default async function RootLayout({ children, pageProps }) {

  let theme = "theme-dark";
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme');
  theme = themeCookie ? themeCookie.value : "theme-dark";

  return (
    <html lang="en">
      <Header></Header>
      <MainProvider>
        <CookiesProvider>
          <body className={"" + theme}>
            <HeaderPage></HeaderPage>
            <div className="tournaments-container">
              <LeftMenuPage />
              <div className="tournaments-data">
                {children}
              </div>
            </div>
          </body>
        </CookiesProvider>
      </MainProvider>
    </html>
  );
}
