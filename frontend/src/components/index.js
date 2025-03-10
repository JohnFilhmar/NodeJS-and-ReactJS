import Body from "./body";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Main() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="w-full gmab">
        <Header />
      </div>

      <div className="flex flex-row flex-grow w-full">
        <div className="basis-1/12 gmab">
          <Sidebar />
        </div>
        <div className="grow w-full gmab">
          <Body />
        </div>
      </div>

      <div className="w-full gmab">
        <Footer />
      </div>
    </div>
  );
}
