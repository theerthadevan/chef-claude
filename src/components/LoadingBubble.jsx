export default function LoadingBubble() {
  return (
    <div className="loading-bubble">
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <p style={{ marginLeft: "10px", fontStyle: "italic" }}>
        👩‍🍳 Cooking up your recipe...
      </p>
    </div>
  );
}
