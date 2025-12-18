export const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-dark">
      <div className="absolute top-0 left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
};