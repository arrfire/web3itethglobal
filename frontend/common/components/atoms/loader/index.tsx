import './style.css'
export const Loader = () => {
  return (
    <div className='w-full fixed top-0 left-0 h-full flex justify-center items-center backdrop-blur-md z-[9999] bg-black bg-opacity-20'>
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}