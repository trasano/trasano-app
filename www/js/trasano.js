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
    //navigator.notification.alert("DNI: " +  $("#dniNumber").val(), function() {}, "Registrado");
    //navigator.notification.vibrate(500);
    window.location = "../index.html";                                 
}

function deleteDNI(){
    localStorage.removeItem("dni");
    //navigator.notification.vibrate(500);
    window.location = "registeredUser.html";               
}

function modifyDNI(){
    window.location = "modifyUser.html";
    //navigator.notification.vibrate(500);             
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
    navigator.vibrate(200);
    alert("Se va a proceder a reclamar una ambulancia");            
}

function cancelAmbulance()
{
    console.log("trasano.cancelAmbulance()");
    navigator.vibrate(200);
    alert("Se va a proceder a cancelar una ambulancia");
}


/*************************************************************************************************************
* initMimeTypeListener
**************************************************************************************************************/
function onNdef (nfcEvent) {
    // Get tag ID
    console.log("trasano.onNdef: " + JSON.stringify(nfcEvent.tag));
    navigator.notification.alert(nfc.bytesToHexString(nfcEvent.tag.id), function() {}, "NFC Tag ID");        
    
    // Get tag message
    var payload = nfcEvent.tag.ndefMessage[0]["payload"];
    console.log("trasano.onNdef.ndefMessage.payload: " + nfc.bytesToString(payload));
    navigator.notification.alert(nfc.bytesToString(payload), function() {}, "NdefMessage payload");
    
    // PRODUCCION: sessionStorage()
    // Set Ambulance
    var date = new Date();
    var ambulance = {"time" : date.toString(), "location" : nfc.bytesToString(payload)};
    localStorage.setItem("ambulance", JSON.stringify(ambulance));
    console.log("trasano.onNdef.localStorage.ambulance: " + JSON.stringfy(ambulance));
    navigator.vibrate(500);        
}

function winMime() {
    console.log("SUCCESS. Listening for NDEF mime tags with type text/plain.");    
}

function failMime(reason) {
    console.log("FAILURE. Listening for NDEF mime tags with type text/plain.");
    navigator.notification.alert(reason, function() {}, "There was a problem");
}

function initMimeTypeListener() {    
    nfc.addMimeTypeListener("text/plain", onNdef, winMime, failMime);              
}

/*************************************************************************************************************
* discoverTag
**************************************************************************************************************/
function nfcListener(nfcEvent) {
    navigator.notification.alert(nfc.bytesToHexString(nfcEvent.tag.id), function() {}, "NFC Tag ID");    
    navigator.notification.alert(nfc.bytesToHexString(nfcEvent.type), function() {}, "NFC Tag Type");
}

function winDiscoverTag() {
    console.log("Added Tag Discovered Listener");
}

function failDiscoverTag(reason) {
    navigator.notification.alert(reason, function() {}, "There was a problem");
}

function discoverTag () {
     nfc.addTagDiscoveredListener(nfcListener, winDiscoverTag, failDiscoverTag);    
}

/*************************************************************************************************************
* initNdefListener
**************************************************************************************************************/
function ndefListener(nfcEvent) {
    console.log(JSON.stringify(nfcEvent.tag));
    navigator.notification.vibrate(500);
}

function winNdef() {
    console.log("Listening for NDEF tags");    
}

function failNdef(reason) {
    navigator.notification.alert(reason, function() {}, "There was a problem");
}

function initNdefListener () {
     nfc.addNdefListener(ndefListener, winNdef, failNdef);    
}
