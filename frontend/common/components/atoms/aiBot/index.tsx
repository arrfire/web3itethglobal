import './style.css'
export const AIBot = () => {
  return (
    <div className='chatbot-container'>
      <div id="chatbot">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <div id="chatbot-corner"></div>
      <div id="antenna">
        <div id="beam"></div>
        <div id="beam-pulsar"></div>
      </div>
    </div>
  )
}
