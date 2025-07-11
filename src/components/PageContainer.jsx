export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
} 