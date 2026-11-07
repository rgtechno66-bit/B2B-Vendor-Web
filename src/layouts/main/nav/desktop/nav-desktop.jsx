import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import { NavUl } from 'src/components/nav-section';
import { NavList } from './nav-desktop-list';
import { fetchCategoryListingThunk } from 'src/redux/CategoryListingReducer';
import './nav-desktop.css';

// ----------------------------------------------------------------------

export function NavDesktop({ data, sx }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: categories = [], loading, error } = useSelector((state) => state.categoryListing);
  const hasRequestedCategories = useRef(false);
  const productsTriggerRef = useRef(null);
  const resourcesTriggerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [hoveredItem, setHoveredItem] = useState({
    product: false,
    resource: false,
    subGroup1: null,
  });

  const [subGroup2, setSubGroup2] = useState([]);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [subGroup2Top, setSubGroup2Top] = useState(0);

  useEffect(() => {
    if (hasRequestedCategories.current || categories?.length > 0 || loading) return;
    hasRequestedCategories.current = true;
    dispatch(fetchCategoryListingThunk());
  }, [dispatch, categories?.length, loading]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    []
  );

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const updateMenuPos = useCallback((el) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: Math.round(rect.bottom) - 2,
      left: Math.round(rect.left),
    });
  }, []);

  const handleProductHover = (isHovered) => {
    clearCloseTimer();
    if (isHovered) {
      updateMenuPos(productsTriggerRef.current);
      setHoveredItem((prev) => ({
        ...prev,
        product: true,
        resource: false,
        subGroup1: null,
      }));
      setSubGroup2([]);
      setSubGroup2Top(0);
      return;
    }
    closeTimerRef.current = setTimeout(() => {
      setHoveredItem((prev) => ({
        ...prev,
        product: false,
        subGroup1: null,
      }));
      setSubGroup2([]);
      setSubGroup2Top(0);
    }, 120);
  };

  const handleHover = (menuType, isHovered) => {
    clearCloseTimer();
    if (menuType === 'resource') {
      if (isHovered) {
        updateMenuPos(resourcesTriggerRef.current);
        setHoveredItem((prev) => ({
          ...prev,
          resource: true,
          product: false,
          subGroup1: null,
        }));
        setSubGroup2([]);
        return;
      }
      closeTimerRef.current = setTimeout(() => {
        setHoveredItem((prev) => ({
          ...prev,
          resource: false,
          subGroup1: null,
        }));
      }, 120);
    }
  };

  const handleSubGroup1Hover = (hoveredSubGroup1, event) => {
    const category = categories.find((c) => c.name === hoveredSubGroup1);
    const subList = category?.subcategories ?? [];
    const itemEl = event.currentTarget.closest('.menu-item') || event.currentTarget;
    const containerEl = event.currentTarget.closest('.menu-container');

    let top = 0;
    if (itemEl && containerEl) {
      const itemRect = itemEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      top = Math.max(0, Math.round(itemRect.top - containerRect.top));
    }

    setSubGroup2Top(top);
    setHoveredItem((prev) => ({
      ...prev,
      subGroup1: hoveredSubGroup1,
    }));
    setSubGroup2(subList.map((s) => s.name));
  };

  const handleClick = (queryKey, queryValue) => {
    navigate(`/product?${queryKey}=${encodeURIComponent(queryValue)}`);
  };

  // Keep fixed menu aligned on scroll/resize while open
  useEffect(() => {
    if (!hoveredItem.product && !hoveredItem.resource) return undefined;

    const sync = () => {
      if (hoveredItem.product) updateMenuPos(productsTriggerRef.current);
      if (hoveredItem.resource) updateMenuPos(resourcesTriggerRef.current);
    };

    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [hoveredItem.product, hoveredItem.resource, updateMenuPos]);

  const uniqueSubGroup1 = categories.map((c) => c.name);

  const productsMenu = hoveredItem.product && (
    <Portal>
      <div
        className="menu-container"
        style={{ top: menuPos.top, left: menuPos.left }}
        onMouseEnter={() => handleProductHover(true)}
        onMouseLeave={() => handleProductHover(false)}
      >
        {loading && uniqueSubGroup1.length === 0 ? (
          <ul className="menu subGroup1">
            <li className="menu-item">Loading categories…</li>
          </ul>
        ) : uniqueSubGroup1.length === 0 ? (
          <ul className="menu subGroup1">
            <li className="menu-item">
              {error ? 'Categories failed to load' : 'No categories available'}
            </li>
          </ul>
        ) : (
          <>
            <ul className="menu subGroup1">
              {uniqueSubGroup1.map((subcategory1, index) => {
                const category = categories.find((c) => c.name === subcategory1);
                const hasSubs = (category?.subcategories?.length ?? 0) > 0;
                const isActive = hoveredItem.subGroup1 === subcategory1;

                return (
                  <li
                    key={index}
                    className={`menu-item${isActive ? ' is-active' : ''}`}
                  >
                    <button
                      type="button"
                      className={`menu-btn${isActive ? ' active' : ''}`}
                      onMouseEnter={(event) => handleSubGroup1Hover(subcategory1, event)}
                      onClick={() => handleClick('subGroup1', subcategory1)}
                    >
                      <span className="menu-btn-label">{subcategory1}</span>
                      {hasSubs && <span className="menu-chevron">›</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {hoveredItem.subGroup1 && subGroup2.length > 0 && (
              <ul
                className="menu subGroup2"
                style={{ top: `${subGroup2Top}px` }}
              >
                {subGroup2.map((subcategory2, index) => (
                  <li key={index} className="menu-item">
                    <button
                      type="button"
                      className="menu-btn"
                      onClick={() => handleClick('subGroup2', subcategory2)}
                    >
                      {subcategory2}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Portal>
  );

  const resourcesMenu = hoveredItem.resource && (
    <Portal>
      <div
        className="menu-container"
        style={{ top: menuPos.top, left: menuPos.left }}
        onMouseEnter={() => handleHover('resource', true)}
        onMouseLeave={() => handleHover('resource', false)}
      >
        <ul className="resource">
          {['Gallery', 'Certificate'].map((submenu, index) => (
            <li key={index} className="menu-item">
              <button
                type="button"
                className="menu-btn"
                onClick={() => navigate(`/${submenu.toLowerCase()}`)}
              >
                {submenu}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Portal>
  );

  return (
    <Stack component="nav" sx={{ height: 1, ...sx }}>
      <NavUl
        sx={{
          gap: 5,
          height: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {data.map((list) => {
          const isProducts = list.title === 'Products';
          const isResources = list.title === 'Resources';

          return (
            <div
              key={list.title}
              ref={isProducts ? productsTriggerRef : isResources ? resourcesTriggerRef : undefined}
              className="nav-desktop-item"
              onMouseEnter={() => {
                if (isProducts) handleProductHover(true);
                else if (isResources) handleHover('resource', true);
              }}
              onMouseLeave={() => {
                if (isProducts) handleProductHover(false);
                else if (isResources) handleHover('resource', false);
              }}
            >
              <NavList data={list} />
            </div>
          );
        })}
      </NavUl>

      {productsMenu}
      {resourcesMenu}
    </Stack>
  );
}
