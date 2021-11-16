import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import assert from "assert";

// App will have errors without these environment variables -- throw an error.
assert(process.env.REACT_APP_PUBLIC_ONBOARD_API_KEY, "Onboard API Key must be defined.")
assert(process.env.REACT_APP_PUBLIC_INFURA_ID, "Infura Public API Key must be defined.")

function App() {
  return (
    <Router>
      <Routes />
    </Router>
  );
}
export default App;
