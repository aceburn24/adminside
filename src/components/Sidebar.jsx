import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaUserShield, FaUserFriends, FaUserLock, FaBox, FaInfoCircle, FaShippingFast, FaTag, FaMagic, FaCreditCard, FaTruckLoading, FaUndo, FaShip, FaChartLine, FaUserAlt, FaFileAlt, FaComments, FaBullhorn, FaRobot, FaCogs, FaChevronUp, FaChevronDown } from 'react-icons/fa';

function Sidebar() {
    const [activeSection, setActiveSection] = useState('');

    return (
        <div className="sidebar bg-dark text-white h-100 py-4 px-3">
            <div className="logo mb-5 text-center">
                <img src="/logoheader.png" alt="Website Logo" className="img-fluid mb-3" />
                <h4 className="mt-2 font-weight-bold">Admin Dashboard</h4>
            </div>
            <ul className="nav flex-column mt-4">
                <li className="nav-item py-2 mb-3">
                    <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
                        <FaTachometerAlt className="mr-2" />
                        Dashboard Overview
                    </Link>
                </li>
               <Section title="User Management" icon={<FaUsers />} active={activeSection} setActive={setActiveSection}>
                    <Link to="/roles-permissions" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUserShield className="mr-2" />
                        Roles & Permissions
                    </Link>
                    <Link to="/customers" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUserFriends className="mr-2" />
                        Customers
                    </Link>
                    <Link to="/auth-settings" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUserLock className="mr-2" />
                        Authentication Settings
                    </Link>
                </Section>
                <Section title="Product Management" icon={<FaBox />} active={activeSection} setActive={setActiveSection}>
                    <Link to="/products" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaBox className="mr-2" />
                        Products
                    </Link>
                    <Link to="/basic-info" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaInfoCircle className="mr-2" />
                        Basic Info
                    </Link>
                    <Link to="/courier-details" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaShippingFast className="mr-2" />
                        Courier Details
                    </Link>
                    <Link to="/discounts-offers" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaTag className="mr-2" />
                        Discounts & Offers
                    </Link>
                    <Link to="/customization-mix-match" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaMagic className="mr-2" />
                        Customization & Mix/Match
                    </Link>
                </Section>
                <Section title="Order Management" icon={<FaCreditCard />} active={activeSection} setActive={setActiveSection}>
                    <Link to="/payments" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaCreditCard className="mr-2" />
                        Payments
                    </Link>
                    <Link to="/orders-tracking" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaTruckLoading className="mr-2" />
                        Orders & Tracking
                    </Link>
                    <Link to="/refunds" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUndo className="mr-2" />
                        Refunds
                    </Link>
                    <Link to="/returns" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUndo className="mr-2" />
                        Returns
                    </Link>
                    <Link to="/shipping" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaShip className="mr-2" />
                        Shipping
                    </Link>
                </Section>
                <Section title="Reports & Analytics" icon={<FaChartLine />} active={activeSection} setActive={setActiveSection}>
                    <Link to="/user-behavior" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaUserAlt className="mr-2" />
                        User Behavior & Recommendations
                    </Link>
                    <Link to="/reports" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaFileAlt className="mr-2" />
                        Reports
                    </Link>
                </Section>
                <Section title="Communication" icon={<FaComments />} active={activeSection} setActive={setActiveSection}>
                    <Link to="/announcements" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaBullhorn className="mr-2" />
                        Announcements
                    </Link>
                    <Link to="/chatbot-support" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaRobot className="mr-2" />
                        Chatbot & Support
                    </Link>
                    <Link to="/communication-settings" className="nav-link text-white pl-4 d-flex align-items-center">
                        <FaCogs className="mr-2" />
                        Settings & Configuration
                    </Link>
                </Section>
                <li className="nav-item py-2 mb-3">
                    <Link to="/general-settings" className="nav-link text-white d-flex align-items-center">
                        <FaCogs className="mr-2" />
                        General Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
}

function Section({ title, active, setActive, icon, children }) {
    return (
        <li className="nav-item py-2 mb-3">
            <div 
                onClick={() => setActive(title === active ? '' : title)} 
                className="nav-link text-white d-flex justify-content-between align-items-center cursor-pointer"
            >
                {icon}
                {title}
                {title === active ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
            </div>
            {title === active && <div className="mt-1">{children}</div>}
        </li>
    );
}

export default Sidebar;