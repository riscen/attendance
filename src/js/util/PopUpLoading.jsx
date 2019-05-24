import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class PopUpLoading extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        className={this.props.className}
        backdrop="static"
        size="sm"
        centered
      >
        <ModalHeader toggle={this.toggleModal}>{this.props.modalTitle}</ModalHeader>
        <ModalBody>{this.props.children}</ModalBody>
      </Modal>
    );
  }
}

PopUpLoading.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  isOpen: PropTypes.any,
  modalTitle: PropTypes.any,
  toggleModal: PropTypes.func
};

export default PopUpLoading;
