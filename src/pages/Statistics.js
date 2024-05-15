const Statistics = {
  id: "statistics",
  title: "Статистика",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>Статистика</h1>
        <p> Тут будет статистика!</p>
      </section>
    `;
  },
};

export default Statistics;
