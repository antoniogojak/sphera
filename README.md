# Sphera 🌍
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)



## Description
Sphera is a web application built using React, TypeScript, and Vite, leveraging Cesium for 3D globe visualization. It allows users to explore various geospatial datasets and overlays. The project incorporates internationalization (i18next) for multi-language support and uses Fluent UI React components for a modern user interface. This project is under the GNU General Public License v3.0.



## Table of Contents
- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How To Use](#how-to-use)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Important Links](#important-links)
- [Footer](#footer)



## Features
- **3D Globe Visualization:** Uses Cesium to render a 3D globe, allowing users to explore geographic data. 🌎
- **Data Layering:** Supports overlaying different geospatial datasets, such as Natural Earth, ocean temperature, and solar activity.
- **Time-Based Data:** Utilizes CZML datasets and Cesium's clock to visualize time-dynamic information, e.g., moon phases or sea temperature changes over time. ⏳
- **Fluent UI Integration:** Leverages Fluent UI React components for a modern and responsive user interface. 🎨
- **Internationalization:** Uses i18next for multi-language support, providing a localized experience. 🌐
- **Declarative Scene Configuration**: The Resium library and React is used for a declarative style of component that is compatible with React.
- **ESLint Configuration**: the project uses eslint configuration with typescript for better code quality.



## Tech Stack
- **Core:** React, TypeScript, Cesium
- **UI Framework:** Fluent UI React Components
- **Bundler:** Vite
- **Internationalization:** i18next, react-i18next
- **Configuration:** Node.js, Next.js, Python
- **Utility:** resium
- **Linting:** ESLint, TypeScript ESLint



## Installation
1.  **Clone the repository:**

    ```bash
    git clone https://github.com/antoniogojak/sphera.git
    cd sphera
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Cesium Ion Token:**
    - Sign up for a Cesium Ion account at <https://cesium.com/ion/>.
    - Create an access token.
    - Add the access token to your `.env` file. Create it if it doesn't exist.

    ```
    VITE_CESIUM_ION_TOKEN=<YOUR_CESIUM_ION_TOKEN>
    ```
    An example `.env` file is included, which has other configurations as well

4.  **Run the application:**

    ```bash
    npm run dev
    ```



## Usage
1.  **Start the development server:**

    ```bash
    npm run dev
    ```
    This will start the application in development mode, typically on `http://localhost:5173`. 🚀

2.  **Explore Geospatial Data:**
    - Use the sidebar to toggle different layers on and off. Datasets include Natural Earth imagery, ocean temperature data, and solar activity.
    - Interact with the 3D globe using mouse or touch controls to pan, zoom, and rotate the view. 🖱️

3.  **Interact with the Timeline:**
    - Use the timeline to visualize data which changes over time.
    - Datasets such as the location of the moon over time can be seen on the time line.



## How To Use
This project shows real-world Earth visualization. Here are some use cases:

1.  **Exploration of Geospatial Datasets**: Allows you to turn on and off different layers on an interactive globe.
2.  **Visualize data that changes over time**: Uses Resium and Cesium's clock to visualize data that changes over a specified time

To launch the application in development mode, execute: `npm run dev`



## Project Structure
```text
.
├── .env                       # Environment variables (including Cesium Ion token)
├── LICENSE                    # License file (GNU General Public License v3.0)
├── README.md                  # This file
├── eslint.config.js           # ESLint configuration
├── index.html                 # Main HTML file
├── package.json               # Node dependencies and scripts
├── public                     # Static assets
│   ├── assets                 # Datasets (CZML, GeoJSON, images, etc.)
│   └── ic_fluent_earth_24_regular.svg #Favicon 
├── src                        # Source code
│   ├── App.tsx                # Main application component
│   ├── Assets.css             # Global styles
│   ├── Layers.tsx             # Component for handling Cesium layers
│   ├── Main.tsx               # Entry point
│   ├── components             # React components
│   ├── i18n.ts                # i18next internationalization configuration
│   ├── layers                 # Cesium layer loading functions
│   └── utils                  # Utility functions
├── tsconfig.app.json          # TypeScript configuration for app
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite build configuration
```

Key directories:

-   `public/assets/datasets`: Contains geospatial datasets in various formats (CZML, GeoJSON, KML, etc.). The `manifest.json` file lists the available layers.
-   `src/layers`: TypeScript modules responsible for loading and configuring different types of Cesium layers (imagery providers, data sources, etc.).
-   `src/components`: React components, including the main `CesiumViewer`, sidebar, header elements, timeline and legend display.



## API Reference
While this project doesn't have a formal API, the following are key components and patterns for working with Cesium in React using Resium:

-   **Resium Viewer Component:** `<ResiumViewer>`

    ```jsx
    <ResiumViewer ref={viewerRef} ... />
    ```

-   **Layer Management:** Utilizes Cesium's `ImageryLayerCollection` and `DataSourceCollection` to manage geospatial layers.

    ```tsx
    const imageryLayer = viewer.scene.imageryLayers.addImageryProvider(loadedLayer);
    viewer.dataSources.add(czmlDataSource);
    ```

-   **Clock Synchronization:** Leverages `Cesium.Clock` and `Cesium.VideoSynchronizer` to handle time-dynamic data visualization.

    ```tsx
    const clock = viewer.clock;
    const synchronizer = new Cesium.VideoSynchronizer({
      clock,
      element: videoElement,
      epoch: clock.startTime,
    });
    ```



## Contributing
Contributions are welcome! Here are the steps to contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Submit a pull request with a clear description of your changes.



## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.



## Important Links
- Author: [Antonio Gojak](https://github.com/antoniogojak)
- GitHub repository: [https://github.com/antoniogojak/sphera](https://github.com/antoniogojak/sphera)
- Live Demo: Not available



## Footer
Made with ❤️ by [Antonio Gojak](https://github.com/antoniogojak)


Feel free to fork, star, and open issues to help improve this project! 🚀