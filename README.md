# Automatización de Reserva de Clases - Smart Idiomas

## 📋 Descripción

Este proyecto es un automatizador de agendamiento de clases para los alumnos de la academia de idiomas Smart (sede Bello). Utilizando Selenium WebDriver y Node.js, el sistema automatiza todo el proceso de inicio de sesión, navegación por el portal estudiantil y reserva de clases de forma programática.

## 🎯 Finalidad

El propósito principal de esta herramienta es simplificar y acelerar el proceso de reserva de clases en el portal de Smart Idiomas, eliminando la necesidad de realizar manualmente todos los pasos repetitivos del proceso de agendamiento. Esto es especialmente útil para estudiantes que necesitan reservar clases de manera recurrente.

## 🚀 Características

- **Automatización completa**: Desde el inicio de sesión hasta la confirmación de la reserva
- **Manejo de iframes**: Navegación inteligente entre diferentes contextos del DOM
- **Selección automática**: Elige automáticamente clases pendientes y horarios disponibles
- **Manejo de modales**: Cierra automáticamente ventanas emergentes que puedan interrumpir el flujo
- **Tiempos de espera configurados**: Garantiza que la página cargue completamente antes de cada acción

## 📦 Requisitos Previos

### Software Necesario

- **Node.js** (versión 12 o superior)
- **npm** (viene incluido con Node.js)
- **Google Chrome** (navegador)
- **ChromeDriver** (se instala automáticamente con selenium-webdriver)

### Dependencias

- `selenium-webdriver` v4.36.0

## 🔧 Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd /ruta/de/tu/proyecto/automatizacionSmartClases
   ```

2. **Instalar las dependencias**
   ```bash
   npm install
   ```

   Esto instalará automáticamente Selenium WebDriver y todas sus dependencias necesarias.

## 📖 Uso

### Comando Básico

```bash
node index.js <usuario> <contraseña>
```

### Ejemplo

```bash
node index.js miusuario micontraseña123
```

### Parámetros

- **`<usuario>`** (obligatorio): Tu código de usuario de Smart Idiomas
- **`<contraseña>`** (obligatorio): Tu contraseña de acceso al portal

## 🔄 Flujo del Código

### 1. Inicialización
```javascript
driver = await new Builder().forBrowser(Browser.CHROME).build();
```
- Se crea una instancia del navegador Chrome usando Selenium WebDriver
- El navegador se abre en modo visual (no headless)

### 2. Acceso al Portal
```javascript
await driver.get('https://schoolpack.smart.edu.co/idiomas/alumnos.aspx');
```
- Navega a la página de inicio de sesión del portal de alumnos

### 3. Inicio de Sesión
```javascript
let inputUser = await driver.findElement(By.id('vUSUCOD'));
await inputUser.sendKeys(usuario);

let inputPass = await driver.findElement(By.id('vPASS'));
await inputPass.sendKeys(contrasena);

let btnLogin = await driver.findElement(By.id('BUTTON1'));
await btnLogin.click();
```
- Localiza los campos de usuario y contraseña por su ID
- Introduce las credenciales recibidas por argumentos de línea de comandos
- Hace clic en el botón de inicio de sesión
- Espera 1 segundo para que la página procese el login

### 4. Cierre de Modal Inicial
```javascript
let btnModal = await driver.findElement(By.id('gxp0_cls'));
await btnModal.click();
```
- Cierra el modal que aparece automáticamente después del inicio de sesión
- Esto libera la interfaz para continuar con la navegación

### 5. Navegación al Módulo de Programación
```javascript
let btnProgramacion = await driver.findElement(By.id('IMAGE18'));
await btnProgramacion.click();
```
- Hace clic en el botón "Programación" para acceder al módulo de reserva de clases
- Este es el módulo principal donde se gestionan las clases

### 6. Selección del Contrato
```javascript
let btnContrato = await driver.findElement(By.id('W0030Grid1ContainerRow_0001'));
await btnContrato.click();
```
- Selecciona el primer contrato disponible en la lista (fila 0001)
- Este contrato será el que se usará para la reserva

### 7. Inicio del Proceso de Reserva
```javascript
let btnIniciar = await driver.findElement(By.id('W0030BUTTON1'));
await btnIniciar.click();
await driver.sleep(5000);
```
- Hace clic en el botón "Iniciar" para ver las clases disponibles
- Espera 5 segundos para permitir que la página cargue completamente el contenido

### 8. Cambio al Iframe Principal
```javascript
let iframe = await driver.findElement(By.id('gxp0_ifrm'));
await driver.switchTo().frame(iframe);
```
- Cambia el contexto al iframe donde se encuentra la lista de clases
- **Importante**: Sin este cambio de contexto, los elementos dentro del iframe no serían accesibles

### 9. Filtrado por Clases Pendientes
```javascript
let filter = await driver.findElement(By.id('vTPEAPROBO'));
await filter.click();

let optionPendientes = await driver.findElement(By.css('#vTPEAPROBO > option:nth-child(3)'));
await optionPendientes.click();
```
- Abre el selector de tipo de clase
- Selecciona la tercera opción que corresponde a "Clases Pendientes"
- Esto filtra la lista para mostrar solo las clases que aún no han sido tomadas

### 10. Selección de la Clase
```javascript
let selectClase = await driver.findElement(By.css('#Grid1ContainerRow_0011 > td:nth-child(6)'));
await selectClase.click();
```
- Selecciona una clase específica de la lista (fila 0011, columna 6)
- **Nota**: Según el código, siempre se selecciona desde la sexta fila por diseño

### 11. Click en Reservar
```javascript
let btnReservar = await driver.findElement(By.id('BUTTON1'));
await btnReservar.click();
```
- Hace clic en el botón "Reservar" para proceder con la reserva de la clase seleccionada

### 12. Regreso al Contexto Principal
```javascript
await driver.switchTo().defaultContent();
```
- Sale del iframe principal para volver al contexto de la página raíz
- Necesario para poder acceder al siguiente iframe

### 13. Cambio al Iframe de Horarios
```javascript
let iframe2 = await driver.findElement(By.id('gxp1_ifrm'));
await driver.switchTo().frame(iframe2);
```
- Cambia al segundo iframe donde se encuentra el selector de día y hora
- Este es un iframe diferente que contiene el formulario de horarios

### 14. Selección del Día
```javascript
let selectDia = await driver.findElement(By.id('vDIA'));
await selectDia.click();

let optionDia = await driver.findElement(By.css('#vDIA > option:nth-child(2)'));
await optionDia.click();
```
- Abre el selector de día
- Selecciona el segundo día disponible en la lista (primera opción después del placeholder)

### 15. Selección de la Hora
```javascript
let selectHora = await driver.findElement(By.id('Grid1ContainerRow_0008'));
await selectHora.click();
```
- Selecciona un horario específico de la lista de horarios disponibles (fila 0008)

### 16. Confirmación de la Reserva
```javascript
let btnConfirmar = await driver.findElement(By.id('BUTTON1'));
await btnConfirmar.click();
```
- Hace clic en el botón "Confirmar" para finalizar la reserva
- Espera 2 segundos finales para que se procese la confirmación

## 🏗️ Estructura del Proyecto

```
automatizacionSmartClases/
├── index.js          # Archivo principal con la lógica de automatización
├── package.json      # Configuración del proyecto y dependencias
└── README.md         # Este archivo
```

## ⚙️ Configuración Actual

### Selectores Configurados

El script está configurado con selectores específicos para:

- **Contrato**: Primera fila (`W0030Grid1ContainerRow_0001`)
- **Clase**: Fila 11, columna 6 (`Grid1ContainerRow_0011`)
- **Filtro de clases**: Tercer opción (Pendientes)
- **Día**: Segunda opción disponible
- **Hora**: Fila 8 (`Grid1ContainerRow_0008`)

### Tiempos de Espera

- Login: 1 segundo
- Modales y navegación: 1 segundo
- Carga de clases: 5 segundos
- Selecciones y confirmaciones: 2 segundos

## 🛠️ Personalización

### Modificar la Fila de Clase Seleccionada

Para seleccionar una clase diferente, modifica la línea:
```javascript
let selectClase = await driver.findElement(By.css('#Grid1ContainerRow_0011 > td:nth-child(6)'));
```
Cambia `0011` por el número de fila deseado (con ceros a la izquierda).

### Modificar el Horario Seleccionado

Para seleccionar un horario diferente, modifica:
```javascript
let selectHora = await driver.findElement(By.id('Grid1ContainerRow_0008'));
```
Cambia `0008` por el número de fila del horario deseado.

### Modificar el Día

Para seleccionar otro día, cambia:
```javascript
let optionDia = await driver.findElement(By.css('#vDIA > option:nth-child(2)'));
```
Cambia el número `2` por la posición del día deseado (1 es el placeholder, 2 es el primer día, etc.).

## ⚠️ Consideraciones Importantes

### Seguridad

- **NUNCA** compartas tus credenciales en el código fuente
- Las credenciales se pasan como argumentos en tiempo de ejecución
- Considera usar variables de entorno para mayor seguridad en producción

### Estabilidad

- Los tiempos de espera (`driver.sleep()`) pueden necesitar ajustes según la velocidad de internet
- Si el portal cambia su estructura HTML, los selectores necesitarán actualizarse
- Se recomienda supervisar la primera ejecución para verificar que todo funcione correctamente

### Limitaciones

- El navegador se abre en modo visible (no headless)
- Los selectores están hardcodeados para elementos específicos
- No incluye manejo de errores robusto
- No valida si la reserva fue exitosa

## 🔍 Troubleshooting

### Error: "Element not found"
- **Causa**: El elemento no existe o la página no ha cargado completamente
- **Solución**: Aumenta los tiempos de espera con `await driver.sleep()`

### Error: "No such frame"
- **Causa**: El iframe no está disponible o cambió su ID
- **Solución**: Inspecciona la página y verifica el ID del iframe

### El navegador se cierra inmediatamente
- **Causa**: Ocurrió un error durante la ejecución
- **Solución**: Añade un bloque try-catch para capturar errores y mantener el navegador abierto

### La reserva no se completa
- **Causa**: Puede que los selectores de fila no correspondan con las clases/horarios disponibles
- **Solución**: Inspecciona manualmente el portal y ajusta los selectores

## 📝 Mejoras Futuras Sugeridas

- [ ] Implementar manejo de errores con try-catch
- [ ] Añadir logs detallados del proceso
- [ ] Parametrizar la selección de día, hora y clase
- [ ] Implementar modo headless opcional
- [ ] Añadir capturas de pantalla en cada paso
- [ ] Validar el éxito de la reserva
- [ ] Implementar reintentos automáticos
- [ ] Crear un archivo de configuración para selectores
- [ ] Añadir soporte para múltiples contratos
- [ ] Implementar notificaciones al completar la reserva

## 👨‍💻 Autor

**Miguel Anjel Salazar Jaramillo**

## 📄 Licencia

ISC

## 🤝 Contribuciones

Las contribuciones, problemas y solicitudes de características son bienvenidas. Siéntete libre de mejorar este proyecto.

---

**Nota**: Este proyecto es una herramienta de automatización personal. Asegúrate de cumplir con los términos de servicio del portal de Smart Idiomas al utilizarla.
