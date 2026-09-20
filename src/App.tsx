import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./Editor";
import ViewArticle from "./ViewArticle";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/edit/:slug" element={<Editor />} />
          <Route path="/:slug" element={<ViewArticle />} />
        </Routes>
      </BrowserRouter>
  );
}