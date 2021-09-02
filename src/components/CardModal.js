import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

export default class CardModal extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
  }

  handleModal() {
    this.setState({ show: !this.state.show });
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          style={this.props.styles}
          variant="link"
          onClick={() => {
            this.handleModal();
          }}
        >
          <u>{this.props.btnTitle}</u>
        </Button>
        <Modal
          show={this.state.show}
          onHide={() => {
            this.handleModal();
          }}
        >
          <Modal.Header>{this.props.header}</Modal.Header>
          <Modal.Body>
            <div>{this.props.text}</div>
            <div>{this.props.email}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.handleModal();
              }}
            >
              {this.props.closeButton}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
