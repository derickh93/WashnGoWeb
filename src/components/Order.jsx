import React from "react";
import {
  Container,
  Row,
  Col,
  Popover,
  OverlayTrigger,
  Button,
} from "react-bootstrap";

function Order(props) {
  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Order ID: {props.item.id}</Popover.Title>
      <Popover.Content className="d-flex flex-column">
        {props.item.attributes.dryClean_Count > 0 ? (
          <span>Dry Clean Items: {props.item.attributes.dryClean_Count}</span>
        ) : (
          ""
        )}
        {props.item.attributes.bulky_Count > 0 ? (
          <span>Bulky Items: {props.item.attributes.bulky_Count}</span>
        ) : (
          ""
        )}
        {props.item.attributes.laundryBag_Count > 0 ? (
          <span>Laundry Bags: {props.item.attributes.laundryBag_Count}</span>
        ) : (
          ""
        )}
        <span>Pickup Time: {props.item.attributes.pickup_Time}</span>
        <span>Pickup Date: {props.item.attributes.pickup_Date}</span>
        <span>Preferences: {props.item.attributes.preferences}</span>
        <span>Order Status: {props.item.attributes.status}</span>
        <hr />
      </Popover.Content>
    </Popover>
  );
  return (
    <Container>
      <Row>
        <Col className="d-flex align-items-center justify-content-center">
          {" "}
          <OverlayTrigger
            rootClose
            trigger="click"
            placement="right"
            overlay={popover}
          >
            <Button variant="link" className="d-flex flex-column m-2">
              <span>P/U Date: {props.item.attributes.pickup_Date}</span>
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

export default Order;
