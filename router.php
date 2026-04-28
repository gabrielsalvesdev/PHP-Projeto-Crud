<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve arquivos estáticos do /app
if (preg_match('/^\/app\//', $uri)) {
    $file = __DIR__ . $uri;
    if (is_file($file)) {
        $ext = pathinfo($file, PATHINFO_EXTENSION);
        $types = [
            'html' => 'text/html',
            'css'  => 'text/css',
            'js'   => 'application/javascript',
        ];
        if (isset($types[$ext])) {
            header('Content-Type: ' . $types[$ext]);
        }
        readfile($file);
        return true;
    }
}

// Redirecionar raiz para o frontend novo
if ($uri === '/' || $uri === '') {
    header('Location: /app/index.html');
    exit();
}

// Deixar o PHP lidar com os outros arquivos normalmente
return false;
