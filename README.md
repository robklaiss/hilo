# Contenedor de Sliders HILO

Este proyecto es una aplicación React diseñada para mostrar conjuntos de sliders, precedidos por una página de índice con "tapas" o tarjetas que enlazan a dichos conjuntos.

## Características Principales

*   **Página de Índice:** Muestra tarjetas verticales (tapas) que sirven como enlaces a diferentes conjuntos de sliders.
    *   Ancho de tarjeta: 300px.
    *   Márgenes de página: 15px.
    *   Diseño responsivo (ancho de tarjeta fijo en escritorio).
    *   Separador: Línea negra de 4px entre tarjetas, con ~30px de espacio adicional.
*   **Conjuntos de Sliders:** Páginas individuales que contienen los carruseles de imágenes o contenido, implementados con Swiper.js.
*   **Estilo:**
    *   Color primario: `#2c3e50`
    *   Color secundario: `#3498db`
    *   Unidad de espaciado base: `8px`

## Pila Tecnológica

*   React 18
*   React Router DOM (para navegación)
*   Swiper.js (para los sliders)
*   Axios (para posibles peticiones a APIs)
*   CSS Modules (opcional, se puede configurar)
*   Create React App (para la estructura y scripts del proyecto)

## Prerrequisitos

*   Node.js (se recomienda versión LTS, por ejemplo v16 o superior)
*   npm (generalmente viene con Node.js) o Yarn

## Instalación

1.  Clona este repositorio (si aplica) o descarga los archivos a tu máquina local.
2.  Navega al directorio raíz del proyecto en tu terminal:
    ```bash
    cd /Users/robinklaiss/hilo
    ```
3.  Instala las dependencias del proyecto:
    *   Usando npm:
        ```bash
        npm install
        ```
    *   O usando Yarn:
        ```bash
        yarn install
        ```

## Uso (Desarrollo)

Para iniciar la aplicación en modo de desarrollo:

*   Usando npm:
    ```bash
    npm start
    ```
*   O usando Yarn:
    ```bash
    yarn start
    ```
Esto abrirá la aplicación en tu navegador por defecto, generalmente en `http://localhost:3000`.
La página se recargará automáticamente si realizas cambios en el código.
También verás errores de linting en la consola.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

*   `npm start` o `yarn start`
    Ejecuta la aplicación en modo de desarrollo.

*   `npm test` o `yarn test`
    Lanza el corredor de pruebas en modo interactivo.
    Consulta la sección sobre [ejecución de pruebas](https://facebook.github.io/create-react-app/docs/running-tests) para más información.

*   `npm run build` o `yarn build`
    Construye la aplicación para producción en la carpeta `build`.
    Empaqueta React correctamente en modo de producción y optimiza la compilación para el mejor rendimiento.
    La compilación está minificada y los nombres de archivo incluyen hashes.
    ¡Tu aplicación está lista para ser desplegada!
    Consulta la sección sobre [despliegue](https://facebook.github.io/create-react-app/docs/deployment) para más información.

*   `npm run eject` o `yarn eject`
    **Nota: ¡esta es una operación unidireccional! Una vez que `eject`as, ¡no puedes volver atrás!**
    Si no estás satisfecho con la herramienta de compilación y las opciones de configuración, puedes `eject`ar en cualquier momento. Este comando eliminará la dependencia única de compilación de tu proyecto.
    En su lugar, copiará todos los archivos de configuración y las dependencias transitivas (webpack, Babel, ESLint, etc.) directamente en tu proyecto para que tengas control total sobre ellos.

## Pruebas

Para ejecutar las pruebas unitarias (aún por definir con más detalle a medida que se desarrollan los componentes):

*   Usando npm:
    ```bash
    npm test
    ```
*   O usando Yarn:
    ```bash
    yarn test
    ```
Se recomienda escribir pruebas para los componentes de las "tapas", los componentes de los sliders y cualquier lógica de negocio.

## Contribuir

(Se añadirán directrices de contribución si el proyecto se abre a colaboradores).

## Licencia

(Se definirá una licencia si es necesario).


## Backend Monitoring Script (`monitor_backend.sh`)

This project includes a simple bash script, `monitor_backend.sh`, to monitor the health of the backend server.

### Features

-   Periodically sends a GET request to the backend's `/ping` endpoint (`http://localhost:5001/ping`).
-   Reports the server status (UP/DOWN) along with the HTTP status code.
-   Prints a timestamp for each check.
-   Runs every 5 seconds by default (configurable within the script).

### Usage

1.  **Ensure the script is executable:**
    If you've just cloned the repository or the script isn't executable, run:
    ```bash
    chmod +x monitor_backend.sh
    ```

2.  **Run the script:**
    Navigate to the project root directory in your terminal and execute:
    ```bash
    ./monitor_backend.sh
    ```

3.  **Output:**
    You will see output similar to this:
    ```
    Starting backend monitoring for http://localhost:5001/ping every 5 seconds...
    Press Ctrl+C to stop.
    --------------------------------------------------
    [YYYY-MM-DD HH:MM:SS] STATUS: UP (200)
    [YYYY-MM-DD HH:MM:SS] STATUS: UP (200)
    ```
    If the server is down or the `/ping` endpoint is not reachable, it will show:
    ```
    [YYYY-MM-DD HH:MM:SS] STATUS: DOWN (HTTP 000) 
    ```
    (The HTTP code might vary depending on the exact error, e.g., 404 if the endpoint is missing, 000 if the server is completely unreachable).

4.  **Stop the script:**
    Press `Ctrl+C` in the terminal where the script is running.

### Configuration

You can modify the `TARGET_URL` and `SLEEP_INTERVAL` variables directly within the `monitor_backend.sh` script if you need to change the target endpoint or the polling frequency.
