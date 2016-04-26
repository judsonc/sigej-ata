(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        checkConnection();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        checkConnection();
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        checkConnection();
    };
})();
$(document).ready(function () {
    /* Toggle mobile-menu */
    $(".nav-toggle").on("click", function () {
        $(".menu").slideToggle();
        $(".bars-down").toggle();
        $(".bars-up").toggle();
    });
});
/* testar conexão */
function checkConnection() {
    /*
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';
    */
    if (navigator.network.connection.type == Connection.NONE) {
        alert('Você está desconectado!');
        screenErrorConnection();
    } else
        autoSession();
}

/* Habilitar displays - Views */
function toggle(divid) {
    if (document.getElementById(divid).style.display == "none")
        document.getElementById(divid).style.display = "block";
    else
        document.getElementById(divid).style.display = "none";
}
/* Sincronizar ponto de entrada */
function synchronizeInput() {
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.100/~sigueject/phonegap/ata.php',
        crossDomain: true,
        cache: false,
        data : 'getInput=' + window.name,
        success: function (data) {
            var data = $.parseJSON(data);
            if (data != null) {
                document.getElementById("inputWorkload").innerHTML = data.ATA_ENTRADA;
                toggle("setInWorkload");
            } else {
                toggle("setOutWorkload");
            }
        }
    });
}
/* Retornar a pagina inicial *
function goBack(){
    toggle("screenIndex");
    toggle("screenWorkload");
    toggle("goBack");
    $("#allWorkload").html("");
}
/* Get limite da lista de carga horária *
function setLimitGetWorkload(){
    var list = document.getElementById("limitGetWorkload");
    var value = list.options[list.selectedIndex].value;
    return value;
}
/* Get carga horarios */
function getAllWorkload() {
    toggle("screenWorkload");
    $.ajax({
        type: "GET",
        url: "http://192.168.0.100/~sigueject/phonegap/ata.php",
        crossDomain: true,
        cache: false,
        data : "id=" + window.name,
        success: function (data) {
            var data = $.parseJSON(data);
            $("#allWorkload").html("");
            $.each(data, function (i, field) {
                field.ATA_VALID = (field.ATA_VALID == 1) ? "valid" : "";
                $("#allWorkload").append(
                    "<tr class=\"" + field.ATA_VALID + "\"><td>" + field.ATA_ENTRADA + "</td><td>" + field.ATA_SAIDA + "</td></tr>"
                );
            });
        }
    });
}
/* Mostrar lista de carga horaria *
function screenWorkload(){
    goBack();
    getAllWorkload();
}
/* Set entrada do ponto */
function setInWorkload() {
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.100/~sigueject/phonegap/ata.php',
        crossDomain: true,
        cache: false,
        data: "input=" + window.name,
        success: function (data) {
            var data = $.parseJSON(data);
            document.getElementById("inputWorkload").innerHTML = data.ATA_ENTRADA;
            toggle("setInWorkload");
            toggle("setOutWorkload");
        }
    });
}
/* Set saida do ponto */
function setOutWorkload() {
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.100/~sigueject/phonegap/ata.php',
        crossDomain: true,
        cache: false,
        data: "output=" + window.name,
        success: function (data) {
            alert('Carga Horária Salva!');
            getAllWorkload();
            document.getElementById("inputWorkload").innerHTML = '';
            toggle("setOutWorkload");
            toggle("setInWorkload");
        }
    });
}
/* Processar formulario */
function formSubmitLogin() {
    toggle('screenLogin');
    $('input[name=uuid]').val(device.uuid);
    $('#formLogin').submit(function () {
        var formData = $(this).serialize();
        $.ajax({
            type: 'GET',
            url: 'http://192.168.0.100/~sigueject/phonegap/validacao.php',
            data: formData,
            beforeSend: function () { $("input[name=send]").val('Entrando...'); },
            success: function (data) {
                if (data.match(/error/)) {
                    var res = data.split(",");
                    alert(res[1]);
                } else {
                    window.name = data;
                    toggle("screenLogin");
                    toggle("header");
                    toggle("screenIndex");
                    synchronizeInput();
                }
                $("input[name=send]").val("Entrar");
                $("input[name=password]").val("");
            }
        });
        return false;
    });
}
/* Verica sessão iniciada e IP */
function autoSession() {
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.100/~sigueject/phonegap/checa.php',
        data: 'getuuid=' + device.uuid,
        success: function (data) {
            if (data.match(/error/)) {
                var res = data.split(",");
                alert(res[1]);
                screenErrorConnection();
            } else if (data) {
                window.name = data;
                toggle("header");
                toggle("screenIndex");
                synchronizeInput();
            } else {
                formSubmitLogin();
            }
        }
    });
}
/* Tela de Erro de Conexão */
function screenErrorConnection() {
    $('body').addClass('error');
    $('#formLogin').addClass('bounceOutUp');
    toggle('screenLogin');
    setTimeout(function () {
        toggle('formLogin');
        toggle('errorDesconnected');
    }, 700);
}
/* Encerrar sessão */
function logout() {
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.100/~sigueject/phonegap/checa.php',
        data: 'logout=' + device.uuid,
        beforeSend: function () { $("#logout").innerHTML = 'Encerrando...'; },
        success: function (data) {
            navigator.app.exitApp();
        }
    });
}