@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--glass-border);
        flex-direction: column;
        padding: 1rem;
        gap: 0;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
    }
    
    .nav-menu.mobile-show {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .nav-menu li {
        width: 100%;
    }
    
    .nav-link {
        display: block;
        padding: 1rem;
        color: var(--dark-text);
        border-radius: 8px;
        margin-bottom: 0.5rem;
        text-align: center;
    }
    
    .nav-link:hover,
    .nav-link.active {
        background: rgba(139, 69, 19, 0.1);
    }
    
    .mobile-menu-toggle {
        display: flex;
    }
    
    .mobile-menu-toggle.active {
        background: var(--primary-brown) !important;
    }
}
