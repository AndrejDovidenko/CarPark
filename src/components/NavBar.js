const NavBar = {
  render: () => {
    return `
      <nav class="main-menu" id="main-menu">
        <ul class="main-menu__list">
          <li><a class="main-menu__link" href="#main">Гараж</a></li>
          <li><a class="main-menu__link" href="#statistics">Статистика</a></li>
          <li><a class="main-menu__link" href="#about">О нас</a></li>
          <li><a class="main-menu__link" href="#exit">Выход</a></li>
        </ul>
      </nav>
    `;
  },
};

export default NavBar;
