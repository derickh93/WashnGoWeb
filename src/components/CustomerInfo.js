import React, { useRef, useState } from "react";
import { Form, Card, Alert } from "react-bootstrap";

export default function CustomerInfo() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const cellPhoneRef = useRef();
  const [error, setError] = useState("");

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Fill form below</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group id="firstname">
              <Form.Control
                type="text"
                ref={firstNameRef}
                required
                placeholder="First Name"
              />
            </Form.Group>

            <Form.Group id="lastname">
              <Form.Control
                type="text"
                ref={lastNameRef}
                required
                placeholder="Last Name"
              />
            </Form.Group>

            <Form.Group id="cellphone">
              <Form.Control
                type="phone"
                ref={cellPhoneRef}
                required
                placeholder="Phone"
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
