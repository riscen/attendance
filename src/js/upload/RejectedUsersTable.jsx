import React, { Component }  from 'react';
import PropTypes from 'prop-types';

const RejectedUsersTable = props => {
    return (
        <div className="upload-users-rejected-container" style={props.style}>
            <h1>Rejected users</h1>
        </div>
    );
}

RejectedUsersTable.propTypes = {
    style: PropTypes.any,
    users: PropTypes.any
};

export default RejectedUsersTable;
