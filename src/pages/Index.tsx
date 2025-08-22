import { FileManager } from "./FileManager";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <ErrorBoundary>
      <FileManager />
    </ErrorBoundary>
  );
};

export default Index;
