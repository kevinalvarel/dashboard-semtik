import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "./providers/query-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <QueryProvider>
          <Toaster richColors position="bottom-right" />
          <App />
        </QueryProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
);
