import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateNote from "./components/CreateNote";
import OpenNote from "./components/OpenNote/OpenNote";
import DarkMode from "./components/DarkMode";

function App() {
  return (
    <DarkMode>
      <Router>
        <Routes>
          <Route path="/" element={<CreateNote />} />
          <Route path=":noteId" element={<OpenNote />} />
        </Routes>
      </Router>
    </DarkMode>
  );
}

export default App;
