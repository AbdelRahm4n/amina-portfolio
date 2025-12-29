# Amina Portfolio

A minimalist architecture portfolio website with a monochromatic aesthetic. Projects are displayed as scattered silhouettes across the page with hover inversion effects. Clicking a project opens a fullscreen view with an interactive 3D model viewer and arrow navigation for details and gallery.

## Features

- **Monochromatic Design**: Cream/off-white background with charcoal elements
- **Scattered Project Layout**: Projects positioned randomly across the viewport
- **Hover Inversion**: Color inversion effect on project tiles
- **Slide-in Panels**: About and Contact panels slide in from the right
- **3D Model Viewer**: Interactive 360° rotation using React Three Fiber
- **Arrow Navigation**: Keyboard and click navigation between project sections
- **Responsive**: Works on desktop and tablet devices

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Three Fiber** + **@react-three/drei**
- **Framer Motion**

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
amina-portfolio/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── src/
│   ├── components/
│   │   ├── Header.tsx      # Name + navigation links
│   │   ├── SlidePanel.tsx  # About/Contact slide-in
│   │   ├── ProjectTile.tsx # Project thumbnail with hover
│   │   ├── ProjectFocus.tsx # Fullscreen project view
│   │   └── ModelViewer.tsx # 3D model viewer
│   └── lib/
│       ├── config.ts       # Site configuration
│       └── projects.ts     # Project data
└── public/
    └── assets/
        └── projects/
            └── <slug>/
                ├── silhouette.svg  # Project silhouette
                ├── model.glb       # 3D model
                └── gallery/        # Additional images
```

## Adding a New Project

1. **Create the project folder**:
   ```bash
   mkdir -p public/assets/projects/my-project/gallery
   ```

2. **Add assets**:
   - `silhouette.svg` - A solid dark silhouette of the project (required)
   - `model.glb` - 3D model file (optional, placeholder shown if missing)
   - `gallery/1.jpg`, `gallery/2.jpg`, etc. - Gallery images (optional)

3. **Update the projects data** in `src/lib/projects.ts`:
   ```typescript
   {
     slug: "my-project",
     title: "My New Project",
     year: "2024",
     description: "A brief description of the project.",
     details: [
       "First paragraph of detailed information.",
       "Second paragraph with more details.",
     ],
     silhouetteSrc: "/assets/projects/my-project/silhouette.svg",
     modelSrc: "/assets/projects/my-project/model.glb",
     gallery: [
       "/assets/projects/my-project/gallery/1.jpg",
       "/assets/projects/my-project/gallery/2.jpg",
     ],
     position: { x: 50, y: 30 },  // Percentage position on screen
     size: { width: 180, height: 200 },  // Tile size in pixels
   }
   ```

## Creating Silhouettes

Silhouettes should be SVG files with:
- Solid charcoal color (`#2d2d2d`) for the main shape
- Optional cutouts in cream (`#f5f0e8`) for windows/details
- Recommended size: 150-200px width/height

## Customization

### Site Name
Edit `src/lib/config.ts`:
```typescript
export const SITE_CONFIG = {
  name: "Your Name",
  title: "Your Name - Portfolio",
  description: "Your portfolio description",
};
```

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  cream: "#f5f0e8",    // Background color
  charcoal: "#2d2d2d", // Text/element color
},
```

### About/Contact Content
Edit the content in `src/lib/config.ts`.

## Keyboard Shortcuts

- **Arrow Up/Down**: Navigate between project sections (Model, Details, Gallery)
- **Escape**: Close project view

## License

MIT
