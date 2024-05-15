const About = {
  id: "about",
  title: "О проекте",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>О нас</h1>
        <p>Информация о проекте</p>
      </section>
    `;
  },
};

export default About;
