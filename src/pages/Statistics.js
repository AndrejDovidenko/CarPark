const Statistics = {
  id: "statistics",
  title: "Ну и страница Контакты, как без нее?",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>Статистика</h1>
        <p>Ну а тут классически будет страница <strong>Контакты</strong>.</p>
      </section>
    `;
  },
};

export default Statistics;
