export const SITE_CONFIG = {
  title: "Amina Elbattawy — Architecture Portfolio",
  description: "Architectural portfolio showcasing innovative design projects",
} as const;

export const ABOUT_CONTENT = {
  title: "About.",
  paragraphs: [
    "Recent graduate from Architecture at Université de Montréal, interested in how the built environment can adapt to rapidly evolving social, technological, and cultural conditions.",
    "Her work explores the tension between privacy and exposure in an increasingly connected and surveilled world, and how architecture can mediate between individual intimacy and collective life.",
    "Particularly drawn to adaptive reuse, modular systems, and time-neutral design strategies that allow spaces to evolve rather than become obsolete.",
  ],
};

export const CONTACT_CONTENT = {
  title: "Contact.",
};

export type ProjectView =
  | { type: "model" }
  | { type: "text"; content: string }
  | { type: "gallery"; comingSoon?: boolean };

export type ProjectId = "agora" | "duplex" | "milcondos";

export interface Project {
  id: ProjectId;
  name: string;
  modelSrc: string;
  subtitle: string[];
  views: ProjectView[];
  // Desktop position (artistic layout)
  position: {
    top: string;
    left?: string;
    right?: string;
    translateY: string;
  };
}

export const PROJECTS: Project[] = [
  {
    id: "agora",
    name: "Agora",
    modelSrc: "/assets/projects/agora/agora.glb",
    subtitle: ["ARC3017 - Fall 2024", "14 weeks", "Teammate : Lyna Temmam", "Tutor : Ewan Branda"],
    position: { top: "50%", right: "5%", translateY: "-40%" },
    views: [
      { type: "model" },
      {
        type: "text",
        content: "The \"Insertion Iconique\" studio focused on designing a public building for pickleball courts and related functions on an industrial-urban site in Pointe-Saint-Charles, Montreal. The project explored themes such as adapting suburban architectural typologies to dense urban contexts and leveraging parametric and AI tools to develop minimal and expressive forms.\n\nAgora, true to its name, embodies the essence of a public space where everyone can find purpose and connection. From the outset, our approach was guided by four clear objectives: creating a pedestrian path linking both sides of the site, increasing greenery, integrating seamlessly with the surrounding environment, and establishing a new hub to serve the adjacent Pôle Emploi.\n\nDrawing inspiration from Louis Kahn's Dominican Motherhouse and Bernard Tschumi's Parc de la Villette, we envisioned a walled garden where user experience took center stage. Secondary functions, such as the Timeout Market and library, were harmoniously integrated into a unified hub.\n\nRather than viewing the courts as constraints, we embraced them as the driving force of the project. Our ecological take on Brutalism featured CLT (cross-laminated timber) for the structure, with a strong emphasis on the expressive potential of the surrounding wall."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
  {
    id: "duplex",
    name: "Rosemont Duplex",
    modelSrc: "/assets/projects/duplex/duplex.glb",
    subtitle: ["ARC2011", "Autumn 2023", "3 weeks", "Tutor : Sébastien St-Laurent"],
    position: { top: "60%", left: "10%", translateY: "-50%" },
    views: [
      { type: "model" },
      {
        type: "text",
        content: "This project focuses on designing a building with two 300m² residential units for a multigenerational household, including an 80m² workshop. The design prioritizes universal accessibility, ensuring one of the units accommodates easy access from the street.\n\nThe site is in the Marconi-Alexandra district, an eclectic area undergoing urban transformation with a mix of industrial and residential buildings. The project emphasizes the relationship between the design and its context, ensuring sun exposure, comfort, and integration with the surrounding neighborhood while fostering a contemporary architectural expression.\n\nThe design of this duplex draws inspiration from Gerrit Rietveld's Schröder House, with a focus on maximizing sunlight and incorporating a biophilic approach, as well as creating double-height functional spaces.\n\nThe shared space, which is designed as a renovated garage, functions as a small flower shop, serving as a work-from-home area for the family business. This space is accessible to both families: unit one connects via a spiral staircase, while unit two is linked through exterior doors that lead to the courtyards."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
  {
    id: "milcondos",
    name: "Mil Condos",
    modelSrc: "/assets/projects/le reseau/reseau-optimized.glb",
    subtitle: ["ARC2011", "Autumn 2023", "9 weeks", "Teammate : Audrey Lefebvre", "Tutor : Sébastien St-Laurent"],
    position: { top: "35%", left: "35%", translateY: "-50%" },
    views: [
      { type: "model" },
      {
        type: "text",
        content: "This project focuses on urban collective housing in the Nouvel Outremont area of Montreal, bordering the MIL Campus. It aims to design a mixed-use residential complex with at least 40 units, incorporating shared spaces, community services, and retail.\n\nThe design must blend with the site's evolving urban fabric, considering density, accessibility, and integration of public and private spaces. Emphasis is placed on sustainable design, universal accessibility, and urban regeneration, while respecting local building regulations and environmental context.\n\nOur primary goal was to optimize the user experience by maximizing sunlight and offering expansive views. To achieve this, we divided the building into five distinct blocks, interconnected by a network of corridors, ensuring each unit benefits from at least three unobstructed walls with views.\n\nThe three larger blocks along Thérèse Lavoie Roux Street create a cohesive façade that blends seamlessly with the new, gentrified area, while the three smaller blocks along Rue du Manoir reflect the classic townhouse style of Outremont, hence the choice of a brick finish.\n\nOn a more intimate scale, we applied this concept of fragmentation within the units by introducing tinted grey \"glass corners,\" enhancing the sense of luxury. The design accommodates a variety of living spaces, including two-story townhouses on the ground floor, as well as one-floor apartments and penthouses spread throughout the building."
      },
      { type: "gallery", comingSoon: true }
    ]
  },
];
