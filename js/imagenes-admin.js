// Subida de varias imágenes para tours y yates: elegir o arrastrar, validar, vista previa y portada.
// En Laravel los archivos se guardan con el trait GuardaImagenes (ver IMAGENES.md).
(function () {
    var input = document.getElementById('imagenes');
    var zona = document.getElementById('dropzone');
    if (!input || !zona) return;

    var galeria = document.getElementById('galeria-nuevas');
    var existentes = document.getElementById('galeria-existente');   // solo al editar
    var error = document.getElementById('imagenes-error');
    var MAX_IMAGENES = 8;
    var MAX_BYTES = 2 * 1024 * 1024;
    var TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

    var archivos = [];   // imágenes nuevas, en el orden en que se enviarán
    var urls = [];       // direcciones temporales de las vistas previas

    function cardEliminada(card) {
        var casilla = card.querySelector('input[name="eliminar[]"]');
        return !!(casilla && casilla.checked);
    }

    function totalActual() {
        var conservadas = 0;
        if (existentes) {
            Array.prototype.forEach.call(existentes.querySelectorAll('.img-card'), function (card) {
                if (!cardEliminada(card)) conservadas++;
            });
        }
        return conservadas + archivos.length;
    }

    function sincronizarInput() {
        var lista = new DataTransfer();
        archivos.forEach(function (f) { lista.items.add(f); });
        input.files = lista.files;
    }

    function valorPortada() {
        var marcada = document.querySelector('input[name="portada"]:checked');
        return marcada ? marcada.value : null;
    }

    function marcarTarjetas() {
        Array.prototype.forEach.call(document.querySelectorAll('.img-card'), function (card) {
            var radio = card.querySelector('input[name="portada"]');
            card.classList.toggle('es-portada', !!(radio && radio.checked));
            card.classList.toggle('por-eliminar', cardEliminada(card));
        });
    }

    // Siempre debe haber una portada; si la elegida se elimina, pasa a la primera disponible.
    function asegurarPortada() {
        var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="portada"]'));
        var actual = radios.filter(function (r) { return r.checked; })[0];
        if (!actual || cardEliminada(actual.closest('.img-card'))) {
            radios.forEach(function (r) { r.checked = false; });
            var candidato = radios.filter(function (r) { return !cardEliminada(r.closest('.img-card')); })[0];
            if (candidato) candidato.checked = true;
        }
        marcarTarjetas();
    }

    function dibujar(seleccion) {
        urls.forEach(function (u) { URL.revokeObjectURL(u); });
        urls = [];
        galeria.innerHTML = '';
        archivos.forEach(function (archivo, i) {
            var url = URL.createObjectURL(archivo);
            urls.push(url);

            var card = document.createElement('div');
            card.className = 'img-card';
            var img = document.createElement('img');
            img.src = url;
            img.alt = 'Vista previa de ' + archivo.name;
            var badge = document.createElement('span');
            badge.className = 'badge-portada';
            badge.textContent = 'Portada';

            var acciones = document.createElement('div');
            acciones.className = 'img-card-actions';
            var etiqueta = document.createElement('label');
            var radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'portada';
            radio.value = 'nueva:' + i;
            if (seleccion === radio.value) radio.checked = true;
            etiqueta.appendChild(radio);
            etiqueta.appendChild(document.createTextNode(' Portada'));
            var quitar = document.createElement('button');
            quitar.type = 'button';
            quitar.className = 'btn-link';
            quitar.textContent = 'Quitar';
            quitar.addEventListener('click', function () { quitarNueva(i); });

            acciones.appendChild(etiqueta);
            acciones.appendChild(quitar);
            card.appendChild(img);
            card.appendChild(badge);
            card.appendChild(acciones);
            galeria.appendChild(card);
        });
        asegurarPortada();
    }

    function quitarNueva(indice) {
        var seleccion = valorPortada();
        archivos.splice(indice, 1);
        if (seleccion && seleccion.indexOf('nueva:') === 0) {
            var k = parseInt(seleccion.slice(6), 10);
            seleccion = (k === indice) ? null : (k > indice ? 'nueva:' + (k - 1) : seleccion);
        }
        error.textContent = '';
        sincronizarInput();
        dibujar(seleccion);
    }

    function agregar(lista) {
        var mensajes = [];
        Array.prototype.forEach.call(lista, function (f) {
            if (TIPOS.indexOf(f.type) === -1) {
                mensajes.push(f.name + ': formato no permitido (usa JPG, PNG o WEBP).');
                return;
            }
            if (f.size > MAX_BYTES) {
                mensajes.push(f.name + ': pesa más de 2 MB.');
                return;
            }
            var repetida = archivos.some(function (a) {
                return a.name === f.name && a.size === f.size && a.lastModified === f.lastModified;
            });
            if (repetida) return;
            if (totalActual() >= MAX_IMAGENES) {
                var limite = 'Máximo ' + MAX_IMAGENES + ' imágenes por servicio.';
                if (mensajes.indexOf(limite) === -1) mensajes.push(limite);
                return;
            }
            archivos.push(f);
        });
        error.textContent = mensajes.join(' ');
        sincronizarInput();
        dibujar(valorPortada());
    }

    input.addEventListener('change', function () { agregar(input.files); });

    ['dragenter', 'dragover'].forEach(function (ev) {
        zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
        zona.addEventListener(ev, function (e) { e.preventDefault(); zona.classList.remove('dragover'); });
    });
    zona.addEventListener('drop', function (e) { agregar(e.dataTransfer.files); });

    // Cambios en las imágenes ya guardadas (elegir portada o marcar para eliminar)
    document.addEventListener('change', function (e) {
        if (e.target.name === 'portada' || e.target.name === 'eliminar[]') asegurarPortada();
    });

    asegurarPortada();
})();
