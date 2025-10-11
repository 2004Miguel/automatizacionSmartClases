const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");
const { ConsoleLogEntry } = require('selenium-webdriver/bidi/logEntries');

(async function example() {
driver = await new Builder().forBrowser(Browser.CHROME).build();
await driver.get('https://schoolpack.smart.edu.co/idiomas/alumnos.aspx');

//inicio de sesión
let inputUser = await driver.findElement(By.id('vUSUCOD'));
await inputUser.sendKeys('1020102865');

let inputPass = await driver.findElement(By.id('vPASS'));
await inputPass.sendKeys('8del2del2004');

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
let selectClase = await driver.findElement(By.id('Grid1ContainerRow_0006'));
await selectClase.click();

let btnReservar = await driver.findElement(By.id('BUTTON1'));
await btnReservar.click();
await driver.sleep(2000);


}());