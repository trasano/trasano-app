/*************************************************************************************************************
*
* Project: Trasano
* author: @rvallinot 
*
**************************************************************************************************************/

/*************************************************************************************************************
* DNI functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Letter of DNI number
 */
function getDNILetter () { 
    dniLetter ="TRWAGMYFPDXBNJZSQVHLCKET"; 
    position = $("#dniNumber").val() % 23;                        
    return dniLetter.substring(position, position+1);                        
}
/* 
 * Expects: DNI number
 * Returns: Letter of DNI number
 */
function getDNILetterByParameter (dni) { 
    dniLetter ="TRWAGMYFPDXBNJZSQVHLCKET"; 
    position = dni % 23;                        
    return dniLetter.substring(position, position+1);                        
}
/*************************************************************************************************************
* TAG functions
**************************************************************************************************************/
/* 
 * Expects: String
 * Returns: Tag Code
 */
function getTagCode (tagcode) {
    position = tagcode.trim().indexOf(".");                       
    return tagcode.trim().substring(position+1, tagcode.length);                        
}
/*************************************************************************************************************
* SERVICE_TIME functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Service time from local storage ordered by the patient
 */
function getServiceTime () {
    var serviceTime = new Date();
    serviceTime.setTime(parseInt(localStorage.getItem("serviceTime")));
    return serviceTime; 
}
/* 
 * Expects: void
 * Returns: Time of the last claim from local storage ordered by the patient
 */
function getClaimTime () {
    var claimTime = new Date();
    claimTime.setTime(parseInt(localStorage.getItem("lastClaim")));
    return claimTime; 
}
/*************************************************************************************************************
* PATIENT functions
**************************************************************************************************************/
/* 
 * Expects: dni and numss
 * Returns: If the parameters given are equals than the values stored in local storage return true
 */
function checkPatient (dni, numss) {
    return (dni === localStorage.getItem("dni") && numss === localStorage.getItem("numss")); 
}
/* 
 * Expects: void
 * Returns: Patient DNI, name, surname and home by local storage
 */
function showPatient() {
    $("#dniJumbotron").append(
        "<h1 class='text-justify'>"+ localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni")) + "</h1>" +
        "<p class='text-justify'> " + localStorage.getItem("name") + " " + localStorage.getItem("surname") + "</p>" +    
        "<small class='text-justify'> " + localStorage.getItem("patientHome") + ".</small>");
}
/* 
 * Expects: void
 * Returns: Check if a user can modify DNI and NUMSS. True -> modifyUser.html ; False -> show modal
 */
function modifyPatient() {
    if (isAmbulanceOrdered()) {
            $('#modifyALERT').modal('hide');
            $("#trasanoModalHeader").empty();
            $("#trasanoModalBody").empty();
            $("#trasanoModalFooter").empty();

            $("#trasanoModalHeader").append("<h4>Modificar paciente</h4>");
            $("#trasanoModalBody").append(
                "<div class='alert alert-danger' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                    "<strong>Aviso!</strong> No se puede modificar el usuario.</p>" +
                "</div>" + 
                "<div class='alert alert-info' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> Una ambulancia ha sido <strong>solicitada</strong>.</p>" + 
                    "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'>" + 
                    "</span> Espere a que finalice el servicio o cancele el servicio si desea eliminar el usuario.</p>" + 
                "</div>"
            ); 
            $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");
            $('#trasanoMODAL').modal('show');

    } else {
        //navigator.notification.vibrate(500);
        window.location = "modifyUser.html";
    }               
}
/* 
 * Expects: void
 * Returns: Delete trasano configuration from local storage
 */
function deletePatient() {
    if (isAmbulanceOrdered()) {
            $('#deleteALERT').modal('hide');
            $("#trasanoModalHeader").empty();
            $("#trasanoModalBody").empty();
            $("#trasanoModalFooter").empty();
            $("#trasanoModalBody").append(
                "<div class='alert alert-danger' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                    "<strong>Error!</strong> No se puede eliminar el usuario.</p>" +
                "</div>" + 
                "<div class='alert alert-info' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> Una ambulancia ha sido <strong>solicitada</strong>.</p>" + 
                    "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'>" + 
                    "</span> Espere a que finalice el servicio o cancele el servicio si desea eliminar el usuario.</p>" + 
                "</div>"
            ); 
            $("#trasanoModalHeader").append("<h4>Eliminar paciente</h4>");
            $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");
            $('#trasanoMODAL').modal('show');

    } else {
        localStorage.removeItem("dni");
        localStorage.removeItem("name");
        localStorage.removeItem("numss");
        localStorage.removeItem("surname");
        localStorage.removeItem("patientHome");
        localStorage.removeItem("ambulance");
        localStorage.removeItem("tagcode");
        localStorage.removeItem("serviceTime");
        localStorage.removeItem("lastClaim");
        //navigator.notification.vibrate(500);
        window.location = "registeredUser.html";
    }               
}
/*************************************************************************************************************
* AMBULANCE functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: If an ambulance was ordered returns true.
 */
function isAmbulanceOrdered() {
    return (localStorage.getItem("serviceTime") != null && localStorage.getItem("serviceTime") != "");
}
/* 
 * Expects: void
 * Returns: If an ambulance was ordered more than 6 hours ago -> delete serviceTime, tagcode and ambulance data.
 * Deadline for a service is 6 hours. Source: resources/config.js
 */
function checkAmbulanceServiceTime() {
    var deadLine = trasanoOptions.deadLine;

    if (localStorage.getItem("serviceTime") != null && localStorage.getItem("serviceTime") != "") {
        var serviceTime = new Date();
        var currentTime = new Date();

        serviceTime.setTime(parseInt(localStorage.getItem("serviceTime")) + parseInt(deadLine));
        if (currentTime > serviceTime) {
            console.log("trasano.checkAmbulanceServiceTime.localStorage => Inizialiced");
            localStorage.removeItem("ambulance");
            localStorage.removeItem("tagcode");
            localStorage.removeItem("serviceTime");
            localStorage.removeItem("lastClaim");
        }
    } 
}
/* 
 * Expects: void
 * Returns: If an ambulance was claimed more than 1 hour ago -> the service could be claimed
 * waitTime is 1 hour by default. Source: resources/config.js
 */
function ready2Claim() {
    var waitTime = trasanoOptions.waitClaim;
    var flag = false;

    if (localStorage.getItem("lastClaim") != null && localStorage.getItem("lastClaim") != "") {
        var lastClaim = new Date();
        var currentTime = new Date();
        lastClaim.setTime(parseInt(localStorage.getItem("lastClaim")) + parseInt(waitTime));
        console.log("trasano.ready2Claim.lastClaim: " + lastClaim.toLocaleTimeString());
        console.log("trasano.ready2Claim.currentTime: " + currentTime.toLocaleTimeString());
        if (currentTime > lastClaim) {
            console.log("trasano.ready2Claim => TRUE");
            flag = true;
        }
    } 
    return flag;
}
/* 
 * Expects: void
 * Returns: Show ambulance information from local storage
 */
function showAmbulanceInfo() {
    var ambulance = JSON.parse(localStorage.getItem("ambulance"));
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append(
            "<h4>Datos de la ambulancia</h4>"
        );

    if (ambulance.numAmbulance <= 0) {
        $("#trasanoModalBody").append(
            "<div class='alert alert-info' role='alert'>" + 
                "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "<strong>Aviso!</strong> Servicio de ambulancia pendiente de asignar.</p>" +
            "</div>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Reclamaciones del servicio: <span class='badge'>" + ambulance.numClaim + "</span></p>" + 
            "</div>"
        );  
    } else {
      $("#trasanoModalBody").append(
            "<div class='alert alert-success' role='alert'>" + 
                "<p>Número de ambulancia: <strong>" + ambulance.numAmbulance + "</strong></p>" +
                "<p>Conductor: <strong>" + ambulance.driverName + " " + ambulance.driverSurname +  "</strong></p>" +
                "<p>Compañía: <strong>" + ambulance.ambulanceCompany + "</strong></p>" + 
            "</div>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<p>Reclamaciones del servicio: <span class='badge'>" + ambulance.numClaim + "</span></p>" + 
            "</div>"
        );  
    }
    
    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");

    $('#trasanoMODAL').modal('show');
}
/*************************************************************************************************************
* MODAL functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Close trasano modal and reload index.html
 */
function closeTrasanoModal() {
    $('#trasanoMODAL').modal('hide');
    window.location.reload();
}
/* 
 * Expects: void
 * Returns: Close trasano user modal and load index.html
 */
function closeTrasanoUserModal() {
    $('#trasanoUserMODAL').modal('hide');
    window.location = "../index.html";
}
/* 
 * Expects: void
 * Returns: Show detail of the ambulance service for the patient logged
 */
function showServiceInfo() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append(
        "<h4>Información del Servicio</h4>"
    );  

    $("#trasanoModalBody").append(
        "<div class='alert alert-danger' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> " + 
            "<strong>" + localStorage.getItem("name") + "!</strong>" + 
            " No dispone de servicio de ambulancia.</p>" +
        "</div>" + 
        "<div class='alert alert-info' role='alert'>" + 
            "<p><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> Consulte en el mostrador para más información.</p>" + 
        "</div>"
    );

    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");  

    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: void
 * Returns: Show ambulance claim alert. If the last claim was less than 1 hour ago, the patient can not claim. 
 */
function showClaimMODAL() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Reclamar Ambulancia</h4>");

    if (ready2Claim()) {
        $("#trasanoModalBody").append(
            "<p><strong>¿Desea reclamar la ambulancia?</strong></p>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Última reclamación: <strong>" + getClaimTime().toLocaleTimeString() + 
                " ("+ getClaimTime().toLocaleDateString() + 
                ")</strong></div>");

        $("#trasanoModalFooter").append(
            "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
            "<a class='btn btn btn-primary' href='javascript:showClaimALERT();' role='button'>SI</a>");
    } else {
        $("#trasanoModalBody").append(
            "<div class='alert alert-danger' role='alert'>" + 
                "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                    "<strong>No se puede reclamar la ambulancia!</strong></p>" + 
                "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                    "Debe pasar <strong>una hora</strong> desde la última reclamación.</div></p>" + 
            "<div class='alert alert-warning' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Última reclamación: <strong>" + getClaimTime().toLocaleTimeString() + 
                " ("+ getClaimTime().toLocaleDateString() + 
            ")</strong></div>");

        $("#trasanoModalFooter").append(
            "<button type='button' class='btn btn-primary' data-dismiss='modal'>CERRAR</button>");
    }

    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: void
 * Returns: Show ambulance claim alert 
 */
function showCancelMODAL() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Cancelar Ambulancia</h4>");

    $("#trasanoModalBody").append(
        "<p><strong>¿Desea cancelar la ambulancia?</strong></p>" + 
        "<div class='alert alert-danger' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "Última reclamación: <strong>" + getClaimTime().toLocaleTimeString() + 
                " ("+ getClaimTime().toLocaleDateString() + 
        ")</strong></div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
        //"<a class='btn btn btn-primary' href='javascript:showCancelReasonALERT();' role='button'>SI</a>");
        "<a class='btn btn btn-primary' href='javascript:showCancelDefinedReasonALERT();' role='button'>SI</a>");  
    $('#trasanoMODAL').modal('show');
}
/* 
 * Expects: void
 * Returns: Show alert modal before close an ambulance with NFC GIF
 */
function showCloseMODAL() {
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    $("#trasanoModalHeader").append("<h4>Aproxime el móvil a la pegatina NFC...</h4>");

    $("#trasanoModalBody").append(
        "<img src='img/nfcAnimation-550x344.gif' class='img-responsive img-rounded' alt='Use of NFC'>  ");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");  

    $('#trasanoMODAL').modal('show');
    
    /***********************************
    * MOCK 
    ************************************/
    //setTimeout(closeAmbulance("1"), 2000);

    /***********************************
    * PRODUCTION 
    ************************************/
    getAmbulance();

    /***********************************
    * MOCK.OLD
    ************************************/
    //setTimeout(getAmbulance_MOCK, 2000);
}
/* 
 * Expects: void
 * Returns: Show pre-defined reason for cancel option and textarea if proceed
 */
function showCancelDefinedReasonALERT() {
    $("#probar").remove();
    $("#trasanoModalBody").append(
        "<div class='form-group'>" + 
            "<label for='message-text' class='control-label'>Seleccione un motivo:</label>" + 
            "<select class='form-control' id='codeReason'>" + 
                "<option value='5' selected>Vuelta en coche con un familiar</option>" +
                "<option value='6'>Vuelta en coche con un conocido</option>" +
                "<option value='7'>Vuelta en TAXI</option>" + 
                "<option value='8'>Vuelta en transporte público</option>" +
                "<option value='9'>Otros motivos</option>" +
            "</select>" +
        '</div>');
    $("#trasanoModalFooter").empty();
    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-default' data-dismiss='modal'>NO</button>" +                   
        "<a class='btn btn btn-primary' href='javascript:showCancelALERT();' role='button'>SI</a>");
    
    // Check if option value is 9 => The user can write the reason for canceling
    $('#codeReason').on('change', function() {
        var value = $(this).val();
        if (value == 9) {
            $("#trasanoModalBody").append(
            "<div class='form-group' id='cancelReasonText'>" + 
                "<label for='message-text' class='control-label'>Describa el motivo:</label>" + 
                "<textarea class='form-control' id='cancelReason' maxlength='100' placeholder='Máximo 100 caracteres...'></textarea>" + 
            "</div>");
        } else {
            $("#cancelReasonText").remove();
        }
    });
}
/* 
 * Expects: void
 * Returns: Show alert before cancel an ambulance
 */
function showCancelALERT() {
    localStorage.setItem("cancelReason", $("#cancelReason").val());
    localStorage.setItem("codeReason", $("#codeReason").val());
    
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#probar").remove();

    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");
    
    $(".progress-bar").animate({
        width: "100%"
    }, 1500);
    
    setTimeout(cancelAmbulance, 2000);
}
/* 
 * Expects: void
 * Returns: Show alert before claim an ambulance
 */
function showClaimALERT() {
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    $("#probar").remove();

    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");

    $("#trasanoModalFooter").append(
        "<button type='button' class='btn btn-danger pull-right' data-dismiss='modal'>CANCELAR</button>");  

    $(".progress-bar").animate({
        width: "100%"
    }, 1500); 

    setTimeout(claimAmbulance, 2000);
}
/* 
 * Expects: Error given by Web Service
 * Returns: Show trasano modal for error
 */
function showErrorModal(title, error) {
    console.log("----<showErrorModal>----");
    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    var errorText = error;

    if (errorText.length === 0)
    {
        errorText = "No se ha podido contactar con el servidor";
    }

    $("#trasanoModalHeader").append("<h4>" + title + "</h4>");

    $("#trasanoModalBody").append("<div class='alert alert-danger' role='alert'>" + 
    "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
    "<strong>Error!</strong> " + errorText + ".</div>");

    $("#trasanoModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
        "CERRAR</button>");

    $('#trasanoMODAL').modal('show'); 
}
/*************************************************************************************************************
* NFC functions
**************************************************************************************************************/
/* 
 * Expects: void
 * Returns: Activate NFC on mobile phone
 */
function activateNFC() {
    console.log("trasano.activateNFC()");            
    nfc.showSettings(
        function ()
        {
            console.log("trasano.activateNFC.nfc.showSettings.success");                    
        },
    
        function ()
        {
            alert('No se puede mostrar la configuración NFC');
            console.log("trasano.activateNFC.nfc.showSettings.failure");
        }
    );                  
}
/*************************************************************************************************************
* TRASANO-WS CALLS 
**************************************************************************************************************/
/* 
 * Expects: DNI number and Seguridad Social number
 * Returns: Patient name, surname and home by Web Service
 */
function registerPatient() {
    var dni = $("#dniNumber").val() + getDNILetter();

    $("#trasanoUserModalHeader").empty();
    $("#trasanoUserModalBody").empty();
    $("#trasanoUserModalFooter").empty();

    $("#trasanoUserModalHeader").append("<h4>Registar paciente...</h4>");

    if ($.isNumeric($("#dniNumber").val()) && $.isNumeric($("#numss").val())) {
        if (checkPatient($("#dniNumber").val(), $("#numss").val())) {
            console.log("RegisterPatient: User is alredy stored: " + dni);

            $("#trasanoUserModalBody").append("<div class='alert alert-warning' role='alert'>" + 
                "<span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span> " + 
                "<strong>Aviso!</strong> El paciente ya está registrado.</div>");

            $("#trasanoUserModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
                "CERRAR</button>");

            $('#trasanoUserMODAL').modal('show'); 
            
        } else {
            $.ajax({
                type: "post",
                dataType: "json",
                contenType: "charset=utf-8",
                data: {dni: dni, numss: $("#numss").val()},
                url: "http://trasano.org:8080/patient/login",
                error: function (jqXHR, textStatus, errorThrown){
                    //navigator.notification.vibrate([1000, 1000, 1000, 1000, 1000]);
                    console.log("RegisterPatient.Error: " + textStatus +  ", throws: " + errorThrown);

                    $("#trasanoUserModalBody").append("<div class='alert alert-danger' role='alert'>" + 
                    "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                    "<strong>Error!</strong> Error al enviar la petición.</div>");

                    $("#trasanoUserModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
                    "CERRAR</button>");

                    $('#trasanoUserMODAL').modal('show'); 
                },
                success: function(data) {
                    if (data.error.length === 0) {
                        console.log("LOGIN of patient: " + data.surname + ", " + data.name + ". " + $("#dniNumber").val() + getDNILetter());
                        
                        localStorage.setItem("dni", $("#dniNumber").val());
                        localStorage.setItem("numss", $("#numss").val());
                        localStorage.setItem("name", data.name);
                        localStorage.setItem("surname", data.surname);
                        localStorage.setItem("patientHome", data.patientHome);
                        //navigator.notification.vibrate(500);
                        $("#trasanoUserModalBody").append("<div class='alert alert-success' role='alert'>" + 
                        "<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> <strong>Paciente registrado!</strong> " + dni + ".</div>");

                        $("#trasanoUserModalFooter").append(
                            "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoUserModal();' role='button'>CERRAR</a>");

                        $('#trasanoUserMODAL').modal('show');   
                    } else {
                        $("#trasanoUserModalBody").append("<div class='alert alert-danger' role='alert'>" + 
                            "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
                            "<strong>Error!</strong> " + data.error + ".</div>");

                        $("#trasanoUserModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
                            "CERRAR</button>");

                        $('#trasanoUserMODAL').modal('show'); 
                    }
                }
            });
        }

    } else {
        var messageAlert = "";
        if (!$.isNumeric($("#dniNumber").val())) {
            messageAlert = "Número de DNI/NIE incorrecto."
        }
        if (!$.isNumeric($("#numss").val())) {
            if (messageAlert.length === 0) {
                   messageAlert = "Código de Tarjeta Sanitaria incorrecto.";
            } else {
                messageAlert = messageAlert + " Código de Tarjeta Sanitaria incorrecto.";
            }
        }
        $("#trasanoUserModalBody").append("<div class='alert alert-danger' role='alert'>" + 
            "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " + 
            "<strong>Error!</strong> " + messageAlert + "</div>");

        $("#trasanoUserModalFooter").append("<button type='button' class='btn btn-primary pull-right' data-dismiss='modal'>" + 
            "CERRAR</button>");

        $('#trasanoUserMODAL').modal('show'); 
    }                         
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition INFO
 * WS_Data_INPUT = {dni} 
 * WS_Data_OUTPUT = {companyAmbulance, numAmbulance, name, surname, serviceTime}
 */
function infoAmbulance() {
    console.log("trasano.infoAmbulance()");
    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));

    $.ajax({
        type: "post",
        dataType: "json",
        contenType: "charset=utf-8",
        data: {dni: dni},
        url: "http://trasano.org:8080/patient/info",
        error: function (jqXHR, textStatus, errorThrown){
            console.log("trasano.infoAmbulance.Error: " + textStatus +  ", throws: " + errorThrown);
            //navigator.notification.vibrate([1000, 1000, 1000, 1000, 1000]);
            $("#getAmbulanceButton").empty();
            $("#getAmbulanceButton").append(
                "<div class='alert alert-danger' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-alert' aria-hidden='true'></span> " +  
                    "<strong>Error!</strong> No se puede acceder al estado del servicio.</p>" + 
                    "<p><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> " + 
                    "Compruebe su <strong>conexión de datos</strong>.</p>" + 
                "</div>"); 
            $("#claimAndCancelButton").empty();
        },
        success: function(data) {
            if (data.error.length === 0) {
                console.log("INFO ambulance by patient: " + dni);
                var ambulance = {
                    "ambulanceCompany" : data.companyAmbulance, 
                    "numAmbulance": data.numAmbulance,
                    "driverName": data.name,
                    "driverSurname": data.surname,
                    "timeService": data.serviceTime,
                    "numClaim": data.numClaim
                };
                localStorage.setItem("ambulance", JSON.stringify(ambulance));
                console.log("trasano.infoAmbulance.serviceTime: " + data.serviceTime);
                //localStorage.setItem("timeService", data.serviceTime);
            } else {
                $("#getAmbulanceButton").empty();
                $("#getAmbulanceButton").append(
                    "<div class='alert alert-danger' role='alert'>" +
                        "<a class='text-right' href='javascript:showServiceInfo();''>" + 
                            "<span class='glyphicon glyphicon-alert' aria-hidden='true'></span>   " +  
                            "<strong>Error!</strong> " + data.error + "</a>" + 
                    "</div>"); 
                $("#claimAndCancelButton").empty();
            }
        }
    });
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition CLAIM
 * WS_Data_INPUT = {dni, reason} 
 * WS_Data_OUTPUT = {numClaim}
 */
function claimAmbulance() {
    console.log("trasano.claimAmbulance()");
    $("#probar").remove();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();
    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    $.ajax({
        type: "post",
        dataType: "json",
        contenType: "charset=utf-8",
        data: {dni: dni},
        url: "http://trasano.org:8080/patient/claim",
        error: function (jqXHR, textStatus, errorThrown){
            //navigator.notification.vibrate(500);
            console.log("Claim.Error: " + textStatus +  ", throws: " + errorThrown);
            showErrorModal("<h4>Reclamar Ambulancia</h4>", "Error al enviar la petición");  
        },
       success: function(data) {
            //navigator.notification.vibrate(500);
            if (data.error.length === 0) {
                console.log("CLAIM ambulance by patient: " + dni);
                
                var lastClaim = new Date();
                localStorage.setItem("lastClaim", lastClaim.getTime());

                $("#trasanoModalBody").append(
                    "<div class='alert alert-success' role='alert'>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                        "<strong>La ambulancia ha sido reclamada!</strong></p> " +
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Hora de reclamación: <strong>" + 
                        lastClaim.toLocaleTimeString() + "</strong>.</p>" + 
                    "</div>");

                $("#trasanoModalFooter").append(
                    "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModal();' role='button'>CERRAR</a>");  

            } else {
                showErrorModal("<h4>Reclamar Ambulancia</h4>", data.error); 
            }
        }
    });
}
/* 
 * Expects: void
 * Returns: Call TraSANO-WebService. Petition CANCEL. Delete ambulance service from local storage
 * WS_Data_INPUT = {dni, reason} 
 * WS_Data_OUTPUT = {}
 */
function cancelAmbulance() {
    console.log("trasano.cancelAmbulance()");

    $("#probar").remove();
    $("#trasanoModalBody").empty();
    $("#trasanoModalFooter").empty();

    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    var reason = localStorage.getItem("cancelReason");
    var code = localStorage.getItem("codeReason");
    
    localStorage.removeItem("cancelReason");
    localStorage.removeItem("codeReason");

    $.ajax({
        type: "post",
        dataType: "json",
        contenType: "charset=utf-8",
        data: {dni: dni, code: code, reason: reason},
        url: "http://trasano.org:8080/patient/cancel",
        error: function (jqXHR, textStatus, errorThrown){
            //navigator.notification.vibrate(500);
            console.log("Cancel.Error: " + textStatus +  ", throws: " + errorThrown);
            $('#probarCancelALERT').modal('hide');
            showErrorModal("<h4>Cancelar Ambulancia</h4>", "Error al enviar la petición"); 
        },
        success: function(data) {
            //navigator.notification.vibrate(500);
            if (data.error.length === 0) {
            console.log("CANCEL ambulance by patient: " + dni);
            
            localStorage.removeItem("ambulance");
            localStorage.removeItem("tagcode");
            localStorage.removeItem("serviceTime");
            localStorage.removeItem("lastClaim");

            var serviceTime = new Date();

            $("#trasanoModalBody").append(
                "<div class='alert alert-success' role='alert'>" + 
                    "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                        "<strong>La ambulancia ha sido cancelada!</strong></p>" + 
                    "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> " + 
                        "Hora de cancelación: <strong>" + serviceTime.toLocaleTimeString() + "</strong>.</p>" +
                "</div>");

            $("#trasanoModalFooter").append(
                "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModal();' role='button'>CERRAR</a>");  
            } else {
                showErrorModal("<h4>Cancelar Ambulancia</h4>", data.error); 
            }
        }
    });
}
/* 
 * Expects: tag code by NFC
 * Returns: Call TraSANO-WebService. Petition CLOSE
 * WS_Data_INPUT = {dni} 
 * WS_Data_OUTPUT = {companyAmbulance, numAmbulance, name, surname, serviceTime}
 */
function closeAmbulance(tagCode) {
    console.log("trasano.closeAmbulance()");

    $("#trasanoModalHeader").empty();
    $("#trasanoModalBody").empty();
    $("#probar").remove();
    $("#trasanoModalHeader").append("<h4>Solicitando ambulancia...</h4>");
    $("#trasanoModalBody").append(
        "<div class='progress' id='probar'>" +
            "<div class='progress-bar progress-bar-striped active' " + 
                "role='progressbar' aria-valuenow='45' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
                    "<span class='sr-only'></span>" + 
                "</div>" +
            "</div>");
    
    $(".progress-bar").animate({
        width: "100%"
    }, 1500);

    var dni = localStorage.getItem("dni") + getDNILetterByParameter(localStorage.getItem("dni"));
    var serviceTime = new Date();

    window.setTimeout(function () {
        // ----------------------------------------------------------------------
        // Call TraSANO-WebService. Petition = {"CLOSE", time, DNI, tagLocation}                
        // ----------------------------------------------------------------------
        $.ajax({
            type: "post",
            dataType: "json",
            contenType: "charset=utf-8",
            data: {dni: dni, tagcode: tagCode},
            url: "http://trasano.org:8080/patient/close",
            error: function (jqXHR, textStatus, errorThrown){
                //navigator.notification.vibrate([1000, 1000, 1000, 1000, 1000]);
                console.log("Close.Error: " + textStatus +  ", throws: " + errorThrown);
                $("#probar").remove();
                showErrorModal("<h4>Solicitando ambulancia...</h4>", "Error al enviar la petición");                                    
            },
            success: function(data) {
                //navigator.notification.vibrate(500);
                if (data.error.length === 0) {
                    console.log("CLOSE ambulance by patient: " + dni);
                    
                    localStorage.setItem("tagcode", tagCode);
                    localStorage.setItem("serviceTime", serviceTime.getTime());
                    localStorage.setItem("lastClaim", serviceTime.getTime());

                    var ambulance = {
                        "ambulanceCompany" : data.companyAmbulance, 
                        "numAmbulance": data.numAmbulance,
                        "driverName": data.name,
                        "driverSurname": data.surname,
                        "timeService": data.serviceTime,
                        "numClaim": data.numClaim
                    };
                    localStorage.setItem("ambulance", JSON.stringify(ambulance));

                    $("#probar").remove();
                    $("#trasanoModalBody").empty();  
                    $("#trasanoModalBody").append("<div class='alert alert-success' role='alert'>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> <strong>La ambulancia ha sido solicitada!</strong></p>" + 
                        "<p><span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Hora de solicitud: <strong>" 
                            + serviceTime.toLocaleTimeString() + " (" + serviceTime.toLocaleDateString() + ")</strong></p></div>");
                    $("#trasanoModalFooter").empty(); 
                    $("#trasanoModalFooter").append(
                        "<a class='btn btn-primary pull-right' href='javascript:closeTrasanoModal();' role='button'>CERRAR</a>");  
                } else {
                    $("#probar").remove();
                    showErrorModal("<h4>Solicitando ambulancia...</h4>", data.error); 
                }
            }
        });
    }, 
    2000); 
}
/*************************************************************************************************************
* initMimeTypeListener
**************************************************************************************************************/
/* 
 * Expects: nfcEvent
 * Returns: Call TraSANO-WebService. Petition CLOSE.
 * WS_Data_INPUT = {dni, tagCode} 
 * WS_Data_OUTPUT = {companyAmbulance, numAmbulance, name, surname, serviceTime}
 */
function onNdef (nfcEvent) {
    // Get tag ID
    console.log("trasano.onNdef.NFC.tag.id: " + JSON.stringify(nfcEvent.tag));
    //navigator.notification.alert(nfc.bytesToHexString(nfcEvent.tag.id), function() {}, "NFC Tag ID");
    
    navigator.notification.vibrate(500);

    // Get tag message
    var payload = nfcEvent.tag.ndefMessage[0]["payload"];
    
    console.log("trasano.onNdef.ndefMessage.payload: " + nfc.bytesToString(payload));
    //navigator.notification.alert(nfc.bytesToString(payload), function() {}, "NdefMessage payload");

    var fullTagCode = nfc.bytesToString(payload);
    var tagCode = getTagCode(fullTagCode);
    navigator.notification.alert(tagCode, function() {}, "Localización");

    closeAmbulance(tagCode);
}
/* 
 * Expects: void
 * Returns: Success if mime tag type text/plain is read.
 */
function winMime() {
    console.log("SUCCESS. Listening for NDEF mime tags with type text/plain.");    
}
/* 
 * Expects: reason
 * Returns: Fail if mime tag type text/plain is not read.
 */
function failMime(reason) {
    console.log("FAILURE. Listening for NDEF mime tags with type text/plain.");
    navigator.notification.alert(reason, function() {}, "There was a problem with NFC.");
}
/* 
 * Expects: void
 * Returns: Call mime type listener from cordova library
 */
function initMimeTypeListener() {
    nfc.addMimeTypeListener("text/plain", onNdef, winMime, failMime);              
}
/*************************************************************************************************************
* discoverTag
**************************************************************************************************************/
/* 
 * Expects: nfcEvent
 * Returns: Show tag information
 */
function nfcListener(nfcEvent) {
    navigator.notification.alert(nfc.bytesToHexString(nfcEvent.tag.id), function() {}, "NFC Tag ID");    
    navigator.notification.alert(nfc.bytesToHexString(nfcEvent.type), function() {}, "NFC Tag Type");
}
/* 
 * Expects: void
 * Returns: Log success if a NFCs tag has been discovered
 */
function winDiscoverTag() {
    console.log("Added Tag Discovered Listener");
}
/* 
 * Expects: reason
 * Returns: Log fail if a NFCs tag hasn't been discovered
 */
function failDiscoverTag(reason) {
    navigator.notification.alert(reason, function() {}, "There was a problem");
}
/* 
 * Expects: void
 * Returns: Call discover tag listener from cordova library
 */
function discoverTag () {
     nfc.addTagDiscoveredListener(nfcListener, winDiscoverTag, failDiscoverTag);    
}
/*************************************************************************************************************
* initNdefListener
**************************************************************************************************************/
/* 
 * Expects: nfcEvent
 * Returns: Call discover tag listener from cordova library
 */
function ndefListener(nfcEvent) {
    console.log(JSON.stringify(nfcEvent.tag));
    navigator.notification.vibrate(500);
}
/* 
 * Expects: void
 * Returns: Log success if a NFCs tag has been discovered
 */
function winNdef() {
    console.log("Listening for NDEF tags");    
}
/* 
 * Expects: reason
 * Returns: Log fail if a NFCs tag hasn't been discovered
 */
function failNdef(reason) {
    navigator.notification.alert(reason, function() {}, "There was a problem");
}
/* 
 * Expects: void
 * Returns: Call Ndef listener from cordova library
 */
function initNdefListener () {
     nfc.addNdefListener(ndefListener, winNdef, failNdef);    
}