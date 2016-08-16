/*
* author: @rvallinot 
*/

function activateNFC()
{
    console.log("page.close.activateNFC()");            
    nfc.showSettings(
        function ()
        {
            console.log("close.nfc.showSettings.success");                    
        },
    
        function ()
        {
            alert('No se puede mostrar la configuración NFC');
            console.log("close.nfc.showSettings.failure");
        }
    );                  
}

function onNdef (nfcEvent) {

    alert("close.onNdef = " + JSON.stringify(nfcEvent.tag));
    console.log("close.onNdef = " + JSON.stringify(nfcEvent.tag));  
    var tag = nfcEvent.tag;                    
    navigator.notification.vibrate(100);        
};

function readNFCTag() {
    // Waiting to phoneGAP ready 
    document.addEventListener("deviceready", onDeviceReady(), false);
    
    function onDeviceReady() {
        nfc.enabled(
            // SUCCESS
            function ()
            {
                console.log("close.nfc.enabled.success");
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
                console.log("close.nfc.enabled.failure");
                var err = errorCode;

                switch (err) {
                    case "NO_NFC":
                        console.log("close.nfc.NO_NFC");
                        alert("Dispositivo no compatible con NFC");
                        location.href = "pages/error.html"; 
                        break; 
                    case "NFC_DISABLED":
                        console.log("close.nfc.NFC_DISABLED");
                        alert("Para solicitar una ambulancia la conexión NFC debe estar ACTIVADA");
                        activateNFC();                            
                        break;
                    default:
                        console.log("close.nfc.DEFAULT");
                }                    
            }
        );                 
    }            
};