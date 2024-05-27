import CreateNote from "./components/CreateNote";
import DarkMode from "./components/DarkMode";
import OpenNote from "./components/OpenNote";
import LinkToNote from "./components/LinkToNote";
function App() {
  return (
    <>
      <DarkMode>
        <CreateNote />
        <LinkToNote />
        <OpenNote />
      </DarkMode>
    </>
  );
}

export default App;
