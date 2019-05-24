import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

const FileViewModal = props => {
    return (
      <div>
        <Modal 
            isOpen={props.isOpen} 
            toggle={props.toggle} 
            className={props.className} 
            size="lg"
            centered
        >
          <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
          <ModalBody>
            {props.children}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={props.toggle}>Accept</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
}

FileViewModal.propTypes = {
    children: PropTypes.any,
    className: PropTypes.any,
    isOpen: PropTypes.any,
    title: PropTypes.any,
    toggle: PropTypes.func
}

export default FileViewModal;