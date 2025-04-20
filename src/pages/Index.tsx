
import ExcelValidator from "@/components/ExcelValidator";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Excel Flow Validator</h1>
            <div className="text-sm text-gray-500">
              Validate Excel files with confidence
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <ExcelValidator />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            Excel Flow Validator © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
