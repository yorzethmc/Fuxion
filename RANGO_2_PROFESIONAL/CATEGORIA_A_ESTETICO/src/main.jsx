import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("REACT RUNTIME CRASH:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: "black", color: "red", zIndex: 9999, position: "fixed", inset: 0, overflow: 'auto' }}>
          <h1>Runtime Error: {this.state.error && this.state.error.toString()}</h1>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          <pre>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
