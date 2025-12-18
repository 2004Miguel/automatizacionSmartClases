const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");
const { ConsoleLogEntry } = require('selenium-webdriver/bidi/logEntries');
const fs = require('fs');

var usuario = process.argv[2];
var contrasena = process.argv[3];

// Función para registrar mensajes en log.txt con timestamp
function logToFile(message, tipo = 'INFO') {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-CO');
  const hora = ahora.toLocaleTimeString('es-CO');
  const timestamp = `${fecha} ${hora}`;
  const linea = `${timestamp} | ${tipo}: ${message}`;
  fs.appendFileSync('log.txt', linea + '\n');
}

// Función para agregar separador en el log
function agregarSeparador() {
  fs.appendFileSync('log.txt', '\n');
}

const tiempoInicio = Date.now();

(async function example() {

try {
  // Registrar inicio de ejecución
  logToFile('========== INICIO DE EJECUCIÓN ==========', 'LOG');
  logToFile(`Usuario: ${usuario}`, 'LOG');

const options = new (require('selenium-webdriver/chrome').Options)();

// options.addArguments('--headless=new'); // Ejecutar en modo headless (sin interfaz gráfica)
// options.addArguments('--no-sandbox'); // Necesario para entornos como Docker
// options.addArguments('--disable-dev-shm-usage'); // Evitar problemas de memoria compartida


driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
await driver.get('https://schoolpack.smart.edu.co/idiomas/alumnos.aspx');

//inicio de sesión
let inputUser = await driver.findElement(By.id('vUSUCOD'));
await inputUser.sendKeys(usuario);

let inputPass = await driver.findElement(By.id('vPASS'));
await inputPass.sendKeys(contrasena);

let btnLogin = await driver.findElement(By.id('BUTTON1'));
await driver.sleep(1000);

await btnLogin.click();
await driver.sleep(1000);

//click para cerrar el modal que aparece
let btnModal = await driver.findElement(By.id('gxp0_cls'));
await btnModal.click();
await driver.sleep(1000);

//se elige la opción de "Programación" (para entrar en el módulo de reserva de clases)
let btnProgramacion = await driver.findElement(By.id('IMAGE18'));
await btnProgramacion.click();
await driver.sleep(1000);

//se elige el contrato para el que se va a reservar la clase
let btnContrato = await driver.findElement(By.id('W0030Grid1ContainerRow_0001'));
await btnContrato.click();
await driver.sleep(1000);

//se elige el botón de "iniciar" para ver las clases disponibles
let btnIniciar = await driver.findElement(By.id('W0030BUTTON1'));
await btnIniciar.click();
await driver.sleep(5000);

//filtrar por clases pendientes. Primero se debe cambiar al iframe donde está el botón

let iframe = await driver.findElement(By.id('gxp0_ifrm'));
await driver.switchTo().frame(iframe);

let filter = await driver.findElement(By.id('vTPEAPROBO'));
await filter.click();

let optionPendientes = await driver.findElement(By.css('#vTPEAPROBO > option:nth-child(3)'));
await optionPendientes.click();

//seleccionar la clase. Siempre se debe seleccionar desde la décima fila
let selectClase = await driver.findElement(By.id('Grid1ContainerRow_0010'));
await selectClase.click();
await driver.sleep(2000);

//hacer click en el botón de Asignar
let btnReservar = await driver.findElement(By.id('BUTTON1'));
await btnReservar.click();
await driver.sleep(2000);

//dentro de este span se agrega un div que muestra un error
let errorReserva = await driver.findElement(By.css('#TABLE2 > tbody > tr:nth-child(1) > td > div > span'));

try{
    //este div solo aparece cuando hubo un error al reservar la clase. Por ejemplo, si ya no hay cupos, o si la clase ya fue reservada
    //debe estar dentro de un try catch porque si no hay error, el findElement lanza una excepción y se detiene el flujo
    //en caso de que no haya error, se continúa con el flujo normal
    let estadoError = await errorReserva.findElement(By.css('#TABLE2 > tbody > tr:nth-child(1) > td > div > span > div'))
    if (estadoError){
        let mensajeError = await errorReserva.getText();
        logToFile("No se pudo reservar la clase: " + mensajeError, 'ERROR');
        await driver.quit();
        const duracion = Math.round((Date.now() - tiempoInicio) / 1000);
        logToFile(`Duración: ${duracion} segundos`, 'LOG');
        logToFile('Resultado: ERROR - Clase no disponible', 'LOG');
        logToFile('========== FIN DE EJECUCIÓN ==========', 'LOG');
        agregarSeparador();
        return;
    }

}catch(e){
    //continuar con el flujo normal
}



//salir del iframe actual de la selección de clase para volver al iframe principal
await driver.switchTo().defaultContent();
await driver.sleep(2000);

//la selección de día y hora está dentro de un iframe, por lo que se debe cambiar a ese iframe
let iframe2 = await driver.findElement(By.id('gxp1_ifrm'));
await driver.switchTo().frame(iframe2);

let selectDia = await driver.findElement(By.id('vDIA'));
await selectDia.click();

//seleccionar el día. Siempre se selecciona el día siguiente al actual
let optionDia = await driver.findElement(By.css('#vDIA > option:nth-child(2)'));
await optionDia.click();
await driver.sleep(2000);

//seleccionar la hora
let selectHora = await driver.findElement(By.id('Grid1ContainerRow_0009'));
await selectHora.click();
await driver.sleep(2000);

//confirmar la reserva
let btnConfirmar = await driver.findElement(By.id('BUTTON1'));
await btnConfirmar.click();
await driver.sleep(2000);

let errorHorario = await driver.findElement(By.css('#TABLE2 > tbody > tr:nth-child(3) > td > div > span'));
try{
    let estadoErrorHorario = await errorHorario.findElement(By.css('#TABLE2 > tbody > tr:nth-child(3) > td > div > span > div'));
    if (estadoErrorHorario){
        let mensajeErrorHorario = await errorHorario.getText();
        logToFile("No se pudo reservar la clase en el horario seleccionado: " + mensajeErrorHorario, 'ERROR');
        await driver.quit();
        const duracion = Math.round((Date.now() - tiempoInicio) / 1000);
        logToFile(`Duración: ${duracion} segundos`, 'LOG');
        logToFile('Resultado: ERROR - Horario no disponible', 'LOG');
        logToFile('========== FIN DE EJECUCIÓN ==========', 'LOG');
        agregarSeparador();
        return;
    }
}catch(e){
    //continuar con el flujo normal
    logToFile("Clase reservada exitosamente.", 'SUCCESS');
    await driver.quit();
    const duracion = Math.round((Date.now() - tiempoInicio) / 1000);
    logToFile(`Duración: ${duracion} segundos`, 'LOG');
    logToFile('Resultado: EXITOSO', 'LOG');
    logToFile('========== FIN DE EJECUCIÓN ==========', 'LOG');
    agregarSeparador();
}

} catch(errorGlobal) {
  logToFile("Error no controlado durante la ejecución: " + errorGlobal.message, 'ERROR');
  try {
    await driver.quit();
  } catch(e) {}
  const duracion = Math.round((Date.now() - tiempoInicio) / 1000);
  logToFile(`Duración: ${duracion} segundos`, 'LOG');
  logToFile('Resultado: ERROR - Excepción no controlada', 'LOG');
  logToFile('========== FIN DE EJECUCIÓN ==========', 'LOG');
  agregarSeparador();
}

}());