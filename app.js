const projects = [
  {
    slug: "beijing-yihe",
    title: "Holland Park Townhouse",
    images: 22,
    orientations: ["portrait", "landscape", "portrait", "landscape", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "portrait", "landscape", "portrait", "portrait", "landscape", "portrait", "portrait"],
  },
  {
    slug: "beijing-xinghewan",
    title: "Belgravia Residence",
    images: 16,
    orientations: ["portrait", "portrait", "landscape", "landscape", "landscape", "portrait", "portrait", "landscape", "landscape", "landscape", "portrait", "portrait", "portrait", "portrait", "landscape", "portrait"],
  },
  {
    slug: "beijing-xinghewan-2",
    title: "Kensington Garden House",
    images: 11,
    orientations: ["landscape", "landscape", "portrait", "portrait", "portrait", "portrait", "landscape", "landscape", "landscape", "landscape", "landscape"],
  },
  {
    slug: "oct-harbour",
    title: "Chelsea Harbour Penthouse",
    images: 13,
    orientations: ["landscape", "landscape", "landscape", "portrait", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "portrait"],
  },
  {
    slug: "guangzhou-huidongsheng",
    title: "Mayfair Private House",
    images: 6,
    orientations: ["landscape", "landscape", "landscape", "landscape", "portrait", "portrait"],
  },
  {
    slug: "shenzhen-courtyard",
    title: "St John's Wood Villa",
    images: 4,
    orientations: ["landscape", "landscape", "landscape", "landscape"],
  },
  {
    slug: "shanghai-yanlord",
    title: "Knightsbridge Apartment",
    images: 8,
    orientations: ["portrait", "landscape", "portrait", "portrait", "portrait", "landscape", "portrait", "landscape"],
  },
  {
    slug: "hong-kong-tai-tam",
    title: "Richmond Park House",
    images: 9,
    orientations: ["landscape", "portrait", "landscape", "landscape", "landscape", "portrait", "portrait", "portrait", "landscape"],
  },
  {
    slug: "guangyuan-yuefu",
    title: "Notting Hill Mansion",
    images: 7,
    orientations: ["landscape", "landscape", "landscape", "portrait", "portrait", "portrait", "portrait"],
  },
  {
    slug: "shenzhen-yifang",
    title: "Marylebone Terrace",
    images: 8,
    orientations: ["landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "portrait"],
  },
];

function imagePath(project, name) {
  return `assets/projects/${project.slug}/${name}`;
}

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
        <a
          class="project-card"
          href="project.html?project=${project.slug}"
          aria-label="View ${project.title}"
        >
          <img
            src="${imagePath(project, "cover.webp")}"
            alt="${project.title}"
            loading="lazy"
          />
          <div class="project-card-copy">
            <h2>${project.title}</h2>
          </div>
        </a>
      `,
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    if (!card) return;
    sessionStorage.setItem("projectsScrollY", String(window.scrollY));
  });

  restoreProjectsScroll();
}

function renderProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const project =
    projects.find((item) => item.slug === params.get("project")) ?? projects[0];

  document.title = `GREATAIN | ${project.title}`;
  document.querySelector("#project-title").textContent = project.title;
  const gallery = document.querySelector("#project-gallery");
  const blocks = [];
  let pendingPortrait = [];

  Array.from({ length: project.images }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const orientation = project.orientations?.[index] ?? "landscape";
    const block = {
      index,
      number,
      orientation,
    };

    if (orientation === "landscape") {
      blocks.push(block);
      return;
    }

    pendingPortrait.push(block);
    if (pendingPortrait.length === 2) {
      blocks.push(...pendingPortrait);
      pendingPortrait = [];
    }
  });

  blocks.push(...pendingPortrait);

  gallery.innerHTML = blocks.map((block) => `
      <figure class="gallery-frame gallery-frame--${block.orientation}">
        <img
          src="${imagePath(project, `image-${block.number}.webp`)}"
          alt="${project.title} interior view ${block.index + 1}"
          ${block.index > 0 ? 'loading="lazy"' : ""}
        />
      </figure>
    `).join("");

  const backLink = document.querySelector(".back-link");
  backLink?.addEventListener("click", () => {
    sessionStorage.setItem("restoreProjectsScroll", "true");
  });
}

function restoreProjectsScroll() {
  const shouldRestore =
    sessionStorage.getItem("restoreProjectsScroll") === "true" ||
    new URLSearchParams(window.location.search).get("restore") === "1";
  if (!shouldRestore) return;

  const savedY = Number(sessionStorage.getItem("projectsScrollY") || "0");
  sessionStorage.removeItem("restoreProjectsScroll");

  requestAnimationFrame(() => {
    window.scrollTo(0, savedY);
    setTimeout(() => window.scrollTo(0, savedY), 250);
  });
}

if (document.body.dataset.page === "projects") renderProjects();
if (document.body.dataset.page === "project") renderProjectDetail();
