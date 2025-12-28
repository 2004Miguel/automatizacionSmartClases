const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");
const { ConsoleLogEntry } = require('selenium-webdriver/bidi/logEntries');
const fs = require('fs');
const { exit } = require('process');

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

async function reservaClase(claseId) {
  let selectClase = await driver.findElement(By.id(claseId));
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
      return false;
    }

  }catch(e){
    //continuar con el flujo normal
  }
  return true;

}

async function seleccionFecha(dia, hora, sede='') {
  
  if(sede !== ''){
    //seleccionar la sede de tierra agro
    let selectSede = await driver.findElement(By.xpath('//*[@id="vREGCONREG"]/option[58]'));
    await selectSede.click();
    await driver.sleep(2000);

  }
  let selectDia = await driver.findElement(By.id('vDIA'));
  await selectDia.click();

  //seleccionar el día. Siempre se selecciona el día siguiente al actual
  let optionDia = await driver.findElement(By.css(dia));
  await optionDia.click();
  await driver.sleep(2000);

  //seleccionar la hora
  let selectHora = await driver.findElement(By.id(hora));
  await selectHora.click();
  await driver.sleep(2000);
  

  //confirmar la reserva
  let btnConfirmar = await driver.findElement(By.id('BUTTON1'));
  await btnConfirmar.click();
  await driver.sleep(2000);

  try{
    let errorHorario = await driver.findElement(By.css('#TABLE2 > tbody > tr:nth-child(3) > td > div > span'));

  }catch(e){
    console.log(e);
    console.log("No se encontró el elemento de error de horario");
  }
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
        return false;
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
  return true;
  
}

(async function asistente() {

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

    let reservaClase1 = await reservaClase('Grid1ContainerRow_0007');
    if (!reservaClase1){
        return;
    }

    //salir del iframe actual de la selección de clase para volver al iframe principal
    await driver.switchTo().defaultContent();
    await driver.sleep(2000);

    //la selección de día y hora está dentro de un iframe, por lo que se debe cambiar a ese iframe
    let iframe2 = await driver.findElement(By.id('gxp1_ifrm'));
    await driver.switchTo().frame(iframe2);

    let cambioSede = 0;

    //se agenda clase a las 3:00 PM del día siguiente en la sede principal
    let seleccionFecha1 = await seleccionFecha('#vDIA > option:nth-child(2)', 'Grid1ContainerRow_0007');

    if(!seleccionFecha1){
      //en caso de que no se haya podido agendar en la sede principal, se intenta en la sede de tierra agro
      let cambiaSede = await seleccionFecha('#vDIA > option:nth-child(2)', 'Grid1ContainerRow_0007', 'Tierra Agro');
      //bandera para indicar que se hizo el cambio de sede
      if(!cambiaSede){
        return;
      }else{
        cambioSede = 1;
      }
    }

    //se agenda la segunda clase a a las 4:30 PM
    await driver.switchTo().defaultContent();
    await driver.sleep(2000);

    await driver.switchTo().frame(iframe);
    let reservaClase2 = await reservaClase('Grid1ContainerRow_0007');
    if (!reservaClase2){
        return;
    }

    await driver.switchTo().defaultContent();
    await driver.sleep(2000);

    await driver.switchTo().frame(iframe2);

    //si se hizo el cambio de sede en la primera clase, se intenta también en la segunda
    if(cambioSede === 1){
      let seleccionFecha2 = await seleccionFecha('#vDIA > option:nth-child(2)', 'Grid1ContainerRow_0008', 'Tierra Agro');
      if(!seleccionFecha2){
        return;
      }
    }else{
      let seleccionFecha2 = await seleccionFecha('#vDIA > option:nth-child(2)', 'Grid1ContainerRow_0008');
      if(!seleccionFecha2){
        //en caso de que no se haya podido agendar en la sede principal, se intenta en la sede de tierra agro
        let cambiaSede2 = await seleccionFecha('#vDIA > option:nth-child(2)', 'Grid1ContainerRow_0008', 'Tierra Agro');
        if(!cambiaSede2){
          return;
        }
      }
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