import React, { FC, useCallback, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { UserInfo } from '../UserInfo';
import css from './Header.module.css';
import menu_icon from '../../images/SVG/menu_icon.svg';
import clear_icon from '../../images/SVG/clear_icon.svg';
import search_icon from '../../images/SVG/search_icon.svg';
import user_icon from '../../images/PNG/user_icon.png';
import apartment_logo from '../../images/PNG/apartment_logo.png';
import { ApartmentList } from '../ApartmentList';


const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [animationActive, setAnimationActive] = useState<boolean>(true);
  const menuIconRef = useRef<HTMLImageElement>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const handleMenuImageClick = useCallback(() => {
    setMenuOpen(prevState => !prevState);
  }, []);

  const handleLogoClick = () => {
    setMenuOpen(prev => !prev);
    setAnimationActive(prev => !prev);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnimationActive(true);
  };

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleClearSearchText = useCallback(() => {
    setSearchText('');
  }, []);

  const toggleUserInfo = () => {
    setIsUserInfoOpen(!isUserInfoOpen);
  };

  return (
    <div className={css.header_container}>
      <div className={css.header}>
        <div className={css.menu_block}>
          <img
            ref={menuIconRef}
            className={`${css.menu_icon} ${menuOpen ? css.active : ''}`}
            src={menu_icon}
            alt="menu_logo"
          />
          <p>Меню</p>
        </div>

        <div className={css.search_block}>
          <input
            type="text"
            placeholder="Пошук квартир"
            className={css.search_input}
            value={searchText}
            onChange={handleSearchInputChange}
          />
          <div className={css.clear_button} onClick={handleClearSearchText}>
            <img src={clear_icon} alt="clear_icon" />
          </div>
          <button className={css.search_button}>
            <img className={css.search_icon} src={search_icon} alt="search_square" />
          </button>
        </div>

        <div className={css.logo_register}>
          <NavLink to="/">
            <img className={css.user_icon} src={user_icon} alt="user_icon" />
          </NavLink>
          <span onClick={toggleUserInfo}>Увійти</span>
        </div>
      </div>
      {isUserInfoOpen && <UserInfo onClose={toggleUserInfo} />}

      <button
        className={`${css.apartments_logo_block} ${animationActive ? css.animated : ''}`}
        onClick={handleLogoClick}
      >
        <img
          className={`${css.menu_icon } ${menuOpen ? css.active : ''}`}
          src={apartment_logo}
          alt="apartment_logo"
          onClick={handleMenuImageClick}
        />
        <p>Знайди квартиру мрії</p>

      </button>
      {menuOpen && <ApartmentList onClose={handleMenuClose}  />}
      )
    </div>
  );
};

export { Header };
