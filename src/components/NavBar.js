const NavBar = {
  render: () => {
    return `
    <header>
      <nav class="main-menu" id="main-menu">
        <ul class="main-menu__list">
          <li><a class="main-menu__link" href="#main">Гараж</a></li>
          <li><a class="main-menu__link" href="#statistics">Статистика</a></li>
          <li><a class="main-menu__link" href="#about">О нас</a></li>
        </ul>
        <div class= control-header>
        <div class ="sound"></div>
        <button class="btn exit">Выход</button>
        </div>
        </nav>
    </header>
    `;
  },
};

export default NavBar;
