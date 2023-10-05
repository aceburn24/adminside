import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <div className="footer bg-dark text-white p-3 text-center">
            &copy; {currentYear} Calcium Joyjoy Online Shop
        </div>
    );
}

export default Footer;
