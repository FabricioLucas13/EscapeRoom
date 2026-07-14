# 🎮 Manual Git: Escape Room (Edición para Principiantes)

Este manual te guiará para descargar el juego, trabajar de forma segura en tu propio espacio y subir tus cambios a internet sin romper el trabajo de tus compañeros.

---

## 🛑 Reglas de Oro Obligatorias
*   **La rama `main` es sagrada**: Es el juego que funciona. Nunca escribas código directamente en ella.
*   **Tu propia rama**: Trabajarás siempre dentro de tu rama personal (`nombre-apellido`).
*   **Actualizar antes de programar**: Trae siempre lo que tus compañeros hayan subido antes de tocar tu código.
*   **Revisión en equipo**: Nada entra a `main` sin que otra persona lo revise mediante una *Pull Request*.

---

## 📥 PASO 1: Tu primer día en el proyecto (Solo se hace una vez)

Abre tu terminal, sitúate en la carpeta de tu ordenador donde guardas tus proyectos y escribe estos comandos en orden:

### 1. Clonar el repositorio
Descarga una copia exacta del proyecto usando este enlace directo:
```bash
git clone https://github.com/FabricioLucas13/EscapeRoom.git
```

### 2. Entrar en la carpeta del proyecto
Muévete dentro de la carpeta que se acaba de crear.
```bash
cd EscapeRoom
```

### 3. Comprobar tu rama inicial
Asegúrate de saber en qué lugar estás parado.
```bash
git branch
```
*💡 Deberías ver la palabra `* main` en color verde.*

### 4. Crear tu rama personal
Crea tu propio espacio de trabajo con tu nombre y apellido. Esto te moverá automáticamente allí.
```bash
git checkout -b nombre-apellido
```
*📌 Ejemplo real: `git checkout -b pepe-perez`*

### 5. Verificar el cambio
Confirma que ya no estás en `main`.
```bash
git branch
```
*💡 El asterisco `*` debe aparecer ahora al lado de tu nombre (`* nombre-apellido`).*

---

## 🔄 PASO 2: Tu rutina diaria (Antes de empezar a programar)

Cada día, antes de abrir tu editor de código, debes sincronizarte con lo que hayan hecho tus compañeros para evitar conflictos:

### 1. Salta momentáneamente a la rama principal
```bash
git checkout main
```

### 2. Descarga lo nuevo que haya en internet
```bash
git pull origin main
```

### 3. Regresa a tu rama personal
```bash
git checkout nombre-apellido
```

### 4. Absorbe los cambios de `main` dentro de tu rama
```bash
git pull origin main
```
*¡Listo! Tu rama personal ya tiene tu código antiguo combinado con lo último que subieron los demás.*

---

## 🛠️ PASO 3: ¡A programar!
Abre tus archivos (`main.html`, `script.js`, `style.css`), modifica el Escape Room y **guarda los cambios** en tu editor de texto.

---

## 📤 PASO 4: Guardar y subir tus cambios a GitHub (Al terminar)

Cuando verifiques que tus pantallas o puzles funcionan bien, es hora de enviarlos a internet:

### 1. Ver qué has tocado
Mira la lista de archivos que modificaste (aparecerán resaltados en color rojo).
```bash
git status
```

### 2. Preparar los archivos
Mete todos los cambios dentro de la "caja de envío" (el punto `.` significa meter todo).
```bash
git add .
```

### 3. Crear el Commit (Ponerle una etiqueta al paquete)
Guarda tu progreso con una nota breve de lo que hiciste. Usa los prefijos `feat:` para cosas nuevas o `fix:` si arreglaste un fallo.
```bash
git commit -m "feat: añadido el rompecabezas del candado"
```

### 4. Subir la rama a GitHub
*   **Si es la PRIMERA VEZ que subes esta rama a internet:**
    ```bash
    git push -u origin nombre-apellido
    ```
*   **Para todas las SIGUIENTES VECES que subes cambios:**
    ```bash
    git push
    ```

---

## 🤝 PASO 5: Combinar tu trabajo con el grupo (En la web de GitHub)

Una vez ejecutado el comando `git push`, tu código está en la nube pero separado del juego principal. Para unirlo:

1.  Entra directamente a la página web del repositorio: [FabricioLucas13/EscapeRoom](https://github.com/FabricioLucas13/EscapeRoom).
2.  Verás un botón amarillo que dice **"Compare & pull request"**. Haz clic en él.
3.  **Configura las ramas**: Asegúrate de que la rama origen (*source*) sea tu rama personal y la rama destino (*base*) sea `main`.
4.  Escribe un título claro y explica brevemente qué has diseñado.
5.  Avisa a un compañero del equipo para que revise tu código.
6.  Si tu compañero te da el visto bueno, se pulsa el botón **Merge** y tus cambios formarán parte oficial del Escape Room.
