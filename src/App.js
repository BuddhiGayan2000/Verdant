import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import { CreateContainer, Header, MainContainer, Realtimedata} from "./components";
import { useStateValue } from "./context/StateProvider";
import { getAllPlants } from "./utils/firebaseFunctions";
import { actionType } from "./context/reducer";

const App = () => {
  const [{ Plants }, dispatch] = useStateValue();

  const fetchData = async () => {
    await getAllPlants().then(data => {
      dispatch({
        type : actionType.SET_PLANTS,
        Plants : data
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AnimatePresence mode="wait" >
        <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />

        <main className="mt-14 md:mt-20 px-4 md:px-16 py-4 w-full">
            <Routes>
                <Route path="/*" element={<MainContainer />} />
                <Route path="/createItem" element={<CreateContainer />} />
                <Route path="/realtimedata" element={<Realtimedata />} />
            </Routes>
        </main>
    </div>
    </AnimatePresence>
  );
};

export default App; 