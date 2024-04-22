import React, { useState, useEffect } from 'react';
import Sidebar from "../../../../client-react/src/navigationbar/Sidebar";
import Headbar from '../../../../client-react/src/navigationbar/Headbar';
import { Outlet } from 'react-router-dom';
import "./dashboard.css";
import { items } from '../../../../client-react/src/navigationbar/sidebarData';

const Dashboard = () => {
    const [showHeader, setShowHeader] = useState(true);
    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, []);

    useEffect(() => {
        let lastScrollTop = 0;
        const threshold = 50;

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            setShowHeader(scrollTop <= threshold || scrollTop < lastScrollTop);
            lastScrollTop = scrollTop;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleBackButton = (event) => {
        event.preventDefault();
        window.history.forward();
    };

    const [collapsed, setCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(260);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleSidebarWidth = () => {
        const newWidth = collapsed ? 260 : 50;
        setSidebarWidth(newWidth);
        setCollapsed(!collapsed);
    };

    const filterItems = (items, query) => {
        return items.filter(item => {
            if (item.title.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }

            if (item.dropdowns) {
                const dropdownMatch = item.dropdowns.some(dropdown =>
                    dropdown.title.toLowerCase().includes(query.toLowerCase())
                );
                if (dropdownMatch) {
                    return true;
                }
            }

            return false;
        });
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredSidebarItems = filterItems(items, searchQuery);

    return (
        <div className="dashboard">
            <div className="sidebar_content">
                <Sidebar collapsed={collapsed} width={sidebarWidth} items={filteredSidebarItems} />
            </div>
            <div className="content">
                {
                    showHeader && (
                        <Headbar toggleSidebarWidth={toggleSidebarWidth} onSearchInputChange={handleSearchInputChange} />
                    )
                }
                <div className="scrollable-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

