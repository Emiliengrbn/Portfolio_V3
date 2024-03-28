import { SkillsManager } from "./skills.js";
import { CarouselDOM, Carousel } from "./carousel.js";
import { Contact } from "./contact.js";

async function getData() {
  const fetchResult = await fetch("./data/data.json");
  return fetchResult.json();
}

async function displayData(skills, projects) {
  //Skills
  const skillsDom = document.querySelector(".skills_grid");
  const skillsManager = new SkillsManager(skills, projects);
  skillsDom.innerHTML += skillsManager.displaySkills();

  //Projects
  const projectsDom = document.querySelector("#carousel");
  const carouselManager = new CarouselDOM(projects);
  projectsDom.innerHTML += carouselManager.displayProjects();

  new Carousel(document.querySelector("#carousel"), {
    slidesVisible: 3,
    slidesToScroll: 3,
    infinite: true,
    pagination: true,
  });

  new Contact();
}

async function init() {
  // Récupère les datas
  const { skills, projects } = await getData();
  displayData(skills, projects);
}

init();
