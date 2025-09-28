function Welcome({ name }) {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '10px', 
      margin: '10px 0', 
      borderRadius: '5px' 
    }}>
      <h2>Hello, {name}!</h2>
      <p>Welcome to my sample React component. This is built with Vite!</p>
    </div>
  );
}

export default Welcome;