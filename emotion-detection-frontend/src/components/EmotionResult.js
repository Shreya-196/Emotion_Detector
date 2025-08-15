const EmotionResult = ({ emotion, confidence }) => {
    return (
      <div className="emotion-box">
        <h3>Current Emotion</h3>
        <p><strong>{emotion}</strong></p>
        <p>Confidence: {confidence}%</p>
      </div>
    );
  };
  
  export default EmotionResult;
  