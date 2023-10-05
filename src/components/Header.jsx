import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';

function Header() {
    return (
        <div className="header text-white p-2 d-flex align-items-center">
            <FaTachometerAlt className="mr-2" />
            <h5>Admin Dashboard</h5>
        </div>
    );
}

export default Header;