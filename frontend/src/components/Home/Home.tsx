// import React, { FC, useCallback, useState } from 'react';

import { FC } from 'react';
import { Header } from '../Header';
import css from './Home.module.css';

const Home: FC = () => {
  return (
    <div className={css.home_container}>
      <Header />

    </div>
  );
};

export { Home };

