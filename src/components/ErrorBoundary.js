import React from "react";
import { Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: "", info: "", stack: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
    this.setState({ error, info: errorInfo, stack: error.stack });
  }

  render() {
    async function handleSite() {
      window.location = "https://www.laundrypickupday.com";
    }

    async function handleSchedule() {
      window.location = "https://lpdweb.netlify.app";
    }

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h4>Something went wrong!</h4>
          {this.state.error}
          <Button
            style={{
              width: "20%",
              height: "20%",
              fontSize: "12px",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
            variant="link"
            onClick={handleSite}
          >
            <u>St. Albans Laundromat Home</u>
          </Button>
          <Button
            style={{
              width: "20%",
              height: "20%",
              fontSize: "12px",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
            variant="link"
            onClick={handleSchedule}
          >
            <u>St. Albans Laundromat Scheduling App</u>
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
