const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");
const { ConsoleLogEntry } = require('selenium-webdriver/bidi/logEntries');

var usuario = process.argv[2];
var contrasena = process.argv[3];

(async function example() {
const options = new Chrome.Options();
options.addArguments('--headless=new'); // Ejecutar en modo headless (sin interfaz gráfica)
options.addArguments('--no-sandbox'); // Necesario para entornos como Docker
options.addArguments('--disable-dev-shm-usage'); // Evitar problemas de memoria compartida


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

//click al modal que aparece
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

//seleccionar la clase. Siempre se debe seleccionar desde la sexta fila
let selectClase = await driver.findElement(By.css('#Grid1ContainerRow_0012 > td:nth-child(6)'));
await selectClase.click();
await driver.sleep(2000);

//hacer click en el botón de reservar
let btnReservar = await driver.findElement(By.id('BUTTON1'));
await btnReservar.click();
await driver.sleep(2000);

//salir del iframe principal para estar en el contexto principal
await driver.switchTo().defaultContent();
await driver.sleep(2000);

//la selección de día y hora está dentro de un iframe, por lo que se debe cambiar a ese iframe
let iframe2 = await driver.findElement(By.id('gxp1_ifrm'));
await driver.switchTo().frame(iframe2);

let selectDia = await driver.findElement(By.id('vDIA'));
await selectDia.click();

//seleccionar el día
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

}());