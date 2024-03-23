import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLocation } from 'react-router-dom';
import { items } from './sidebarData';
import styled from 'styled-components';

const StyledBreadcrumbLink = styled(Link)`
    color: inherit;
    text-decoration: none;
    margin-right: 10px;
    &:hover {
        text-decoration: underline;
        color:  #0366d6;
    }
`;

export default function SidebarBreadcrumbs() {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        const currentPath = location.pathname;
        const breadcrumbItems = [];

        // Find the current sidebar item based on the path
        for (const item of items) {
            if (item.path === currentPath) {
                breadcrumbItems.push(item);
                break;
            } else if (item.dropdowns) {
                // Check if the current path matches any dropdown item
                const dropdownItem = item.dropdowns.find(subItem => subItem.path === currentPath);
                if (dropdownItem) {
                    breadcrumbItems.push(item);
                    breadcrumbItems.push(dropdownItem);
                    break;
                }
            }
        }

        setBreadcrumbs(breadcrumbItems);
    }, [location]);

    return (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="16px" />} aria-label="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
                <Typography key={index}>
                    <StyledBreadcrumbLink color="inherit" href={breadcrumb.path} style={{ textDecoration: "none" }}>
                        {breadcrumb.title}
                    </StyledBreadcrumbLink>
                </Typography>
            ))}
        </Breadcrumbs>
    );
}
