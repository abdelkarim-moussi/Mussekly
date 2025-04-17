import { BrowserRouter } from "react-router-dom";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <div className="p-5 bg-black">
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
