import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './products/ProductList';

function MainContent() {
    return (
        <div className="main-content p-4">
            <Routes>
                <Route path="/dashboard" element={<ContentCard title="Dashboard Overview" />} />
                <Route path="/roles-permissions" element={<ContentCard title="Roles & Permissions" />} />
                <Route path="/customers" element={<ContentCard title="Customers" />} />
                <Route path="/auth-settings" element={<ContentCard title="Authentication Settings" />} />

                {/* Product related routes */}
                <Route path="/products" element={<ContentCard title="Products"><ProductList /></ContentCard>} />
               
                <Route path="/basic-info" element={<ContentCard title="Basic Info" />} />
                <Route path="/courier-details" element={<ContentCard title="Courier Details" />} />
                <Route path="/discounts-offers" element={<ContentCard title="Discounts & Offers" />} />
                <Route path="/customization-mix-match" element={<ContentCard title="Customization & Mix/Match" />} />
                <Route path="/payments" element={<ContentCard title="Payments" />} />
                <Route path="/orders-tracking" element={<ContentCard title="Orders & Tracking" />} />
                <Route path="/refunds" element={<ContentCard title="Refunds" />} />
                <Route path="/returns" element={<ContentCard title="Returns" />} />
                <Route path="/shipping" element={<ContentCard title="Shipping" />} />
                <Route path="/user-behavior" element={<ContentCard title="User Behavior & Recommendations" />} />
                <Route path="/reports" element={<ContentCard title="Reports" />} />
                <Route path="/announcements" element={<ContentCard title="Announcements" />} />
                <Route path="/chatbot-support" element={<ContentCard title="Chatbot & Support" />} />
                <Route path="/communication-settings" element={<ContentCard title="Settings & Configuration" />} />
                <Route path="/general-settings" element={<ContentCard title="General Settings" />} />
            </Routes>
        </div>
    );
}

function ContentCard({ title, children }) {
    return (
        <div className="card">
            <div className="card-header">
                {title}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export default MainContent;
