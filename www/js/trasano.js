/*************************************************************************************************************
*
*
* author: @rvallinot 
*
*
**************************************************************************************************************/

/*************************************************************************************************************
* DNI functions
**************************************************************************************************************/
function getDNILetter () 
{ 
    console.log("registeredUser.getDNILetter");
    dniLetter ="TRWAGMYFPDXBNJZSQVHLCKET"; 
    position = $("#dniNumber").val() % 23;                        
    return dniLetter.substring(position,position+1);                        
}

function saveDNI () 
{ 
    localStorage.setItem("dni", $("#dniNumber").val());
    alert("Paciente registrado!"); 
    window.location = "../index.html";                                 
}

function deleteDNI(){
    localStorage.removeItem("dni");
    window.location = "registeredUser.html";               
}

function modifyDNI(){
    window.location = "modifyUser.html";             
}

/*************************************************************************************************************
* NFC functions
**************************************************************************************************************/
function activateNFC()
{
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
* Source: index.html
**************************************************************************************************************/
function closeAmbulance()
{
    console.log("trasano.closeAmbulance()");
    nfc.enabled(
        function ()
        {
            console.log("trasano.closeAmbulance.nfc.enabled.success");
            location.href = "pages/close.html";                     
        },
    
        function (errorCode)
        {
            console.log("trasano.closeAmbulance.nfc.enabled.failure");
            var err = errorCode;

            switch (err) {
                case "NO_NFC":
                    console.log("trasano.closeAmbulance.nfc.NO_NFC");
                    alert("Dispositivo no compatible con NFC");
                    location.href = "pages/error.html"; 
                    break; 
                case "NFC_DISABLED":
                    console.log("trasano.closeAmbulance.nfc.NFC_DISABLED");
                    alert("Para solicitar una ambulancia la conexión NFC debe estar ACTIVADA");
                    activateNFC();                            
                    break;
                default:
                    console.log("trasano.closeAmbulance.nfc.DEFAULT");
            }                    
        }
    );                 
}

function claimAmbulance()
{
    console.log("trasano.claimAmbulance()");
    alert("Se va a proceder a reclamar una ambulancia");            
}

function cancelAmbulance()
{
    console.log("trasano.cancelAmbulance()");
    alert("Se va a proceder a cancelar una ambulancia");
}


/*************************************************************************************************************
* Source: close.html
**************************************************************************************************************/

function onNdef (nfcEvent) {

    alert("trasano.onNdef = " + JSON.stringify(nfcEvent.tag));
    console.log("trasano.onNdef = " + JSON.stringify(nfcEvent.tag));  
    var tag = nfcEvent.tag;                    
    navigator.notification.vibrate(100);        
};

function readNFCTag_old() {
    nfc.enabled(
        // SUCCESS
        function ()
        {
            console.log("trasano.onDeviceReady.nfc.enabled.success");
            nfc.addMimeTypeListener(
                'text/plain',
                onNdef(),
                function() {
                    console.log("SUCCESS. Listening for NDEF mime tags with type text/plain.");
                    alert("SUCCESS reading NFC tag");
                },
                function() {
                    console.log("FAILURE. Listening for NDEF mime tags with type text/plain.");
                    alert("ERROR reading NFC tag");
                }
            ); 
        },
        // FAILURE
        function (errorCode)
        {
            console.log("trasano.onDeviceReady.nfc.enabled.failure");
            var err = errorCode;

            switch (err) {
                case "NO_NFC":
                    console.log("trasano.onDeviceReady.nfc.NO_NFC");
                    alert("Dispositivo no compatible con NFC");
                    location.href = "pages/error.html"; 
                    break; 
                case "NFC_DISABLED":
                    console.log("trasano.onDeviceReady.nfc.NFC_DISABLED");
                    alert("Para solicitar una ambulancia la conexión NFC debe estar ACTIVADA");
                    activateNFC();                            
                    break;
                default:
                    console.log("trasano.onDeviceReady.nfc.DEFAULT");
            }                    
        }
    );               
};

function readNFCTag() {  
    console.log("trasano.onDeviceReady.nfc.enabled.success");
    nfc.addMimeTypeListener(
        'text/plain',
        onNdef(),
        function() {
            console.log("SUCCESS. Listening for NDEF mime tags with type text/plain.");
            alert("SUCCESS reading NFC tag");
        },
        function() {
            console.log("FAILURE. Listening for NDEF mime tags with type text/plain.");
            alert("ERROR: Compruebe si la conexión NFC está activada");
        }
    ); 
            
};