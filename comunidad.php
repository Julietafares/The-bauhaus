<?php
    // Inicializar variables para mensajes
    $mensaje = '';
    $clase_mensaje = '';
    // Inicializar variables para errores de campos
    $nombre_error = '';
    $apellido_error = '';
    $email_error = '';


    // 1. Verificar si el formulario fue enviado
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
        // 2. Sanear y capturar los datos
        $nombre = htmlspecialchars(trim($_POST['nombre']));
        $apellido = htmlspecialchars(trim($_POST['apellido']));
        $email = htmlspecialchars(trim($_POST['email']));

        // 3. Validar los datos
        $errores = [];
        if (empty($nombre)) {
            $errores[] = "El campo Nombre es obligatorio.";
            $nombre_error = 'campo-invalido';
        }
        if (empty($apellido)) {
            $errores[] = "El campo Apellido es obligatorio.";
            $apellido_error = 'campo-invalido';
        }
        if (empty($email)) {
            $errores[] = "El campo Email es obligatorio.";
            $email_error = 'campo-invalido';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores[] = "El formato del Email no es válido.";
        }

        // 4. Procesar el resultado
        if (empty($errores)) {
            // Éxito: Simular almacenamiento
            $fecha = date("d-m-Y H:i:s");
            $mensaje = "¡Gracias por registrarte, " . $nombre . "!<br>Tus datos (Apellido: " . $apellido . ", Email: " . $email . ") fueron recibidos el " . $fecha . ".";
            $clase_mensaje = 'success';
        } else {
            // Error: Mostrar los errores
            $mensaje = implode("<br>", $errores);
            $clase_mensaje = 'error';
        }
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comunidad - The Bauhaus</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body class="static-page">

    <header>
        <a href="index.html" class="title-link">
            <h1 class="main-title">THE<br>BAUHAUS</h1>
        </a>
        <nav class="main-nav">
            <a href="historia.html" class="nav-item history">Historia</a>
            <a href="obras_y_disenos.html" class="nav-item works">Obras y diseños</a>
            <a href="figuras_claves.html" class="nav-item figures">Figuras claves</a>
            <a href="principios_y_filosofia.html" class="nav-item principles">Principios y filosofía</a>
            <a href="comunidad.php" class="nav-item community">Comunidad</a>
        </nav>
    </header>

    <main class="community-main">
        <div class="registro-container">
                <h2>COMUNIDAD</h2>
                <h1>Regístrate</h1>

            <?php if (!empty($mensaje)): ?>
                <div class="mensaje <?php echo $clase_mensaje; ?>"><?php echo $mensaje; ?></div>
            <?php endif; ?>

            <form action="comunidad.php" method="POST" class="registro-form">
                <div class="form-group">
                    <label for="nombre">Nombre*</label>
                    <input type="text" id="nombre" name="nombre" class="form-input <?php echo $nombre_error; ?>">
                </div>
                <div class="form-group">
                    <label for="apellido">Apellido*</label>
                    <input type="text" id="apellido" name="apellido" class="form-input <?php echo $apellido_error; ?>">
                </div>
                <div class="form-group">
                     <label for="email">Dirección de Email*</label>
                    <input type="email" id="email" name="email" class="form-input <?php echo $email_error; ?>">
                </div>
                <div class="form-group submit-group">
                    <button type="submit" class="submit-btn">SUBMIT <span>&rarr;</span></button>
                </div>
            </form>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <!-- ... (contenido del footer sin cambios) ... -->
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const primerError = document.querySelector('.campo-invalido');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    </script>

     <footer>
        <div class="footer-content">
            <div class="footer-column">
                <h4>Contacto</h4>
                <p>+5493794951960</p>
                <p>bauhaus@gmail.com</p>
            </div>
            <div class="footer-column">
                <h4>Sobre nosotros</h4>
                <p>“Un espacio para descubrir la Bauhaus desde su legado hasta la actualidad”</p>
            </div>
            <div class="footer-column">
                <h4>Newsletter</h4>
                <p>“Suscribite para recibir novedades”</p>
            </div>
        </div>
    </footer>

</body>
</html>