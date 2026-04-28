<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../banco.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

try {
    $pdo = Banco::conectar();

    switch ($method) {
        case 'GET':
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM pessoa WHERE id = ?");
                $stmt->execute([$id]);
                $contato = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($contato) {
                    echo json_encode($contato);
                } else {
                    http_response_code(404);
                    echo json_encode(['erro' => 'Contato não encontrado']);
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM pessoa ORDER BY id DESC");
                $contatos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($contatos);
            }
            break;

        case 'POST':
            $dados = json_decode(file_get_contents('php://input'), true);
            $erros = validarDados($dados);
            if (!empty($erros)) {
                http_response_code(422);
                echo json_encode(['erros' => $erros]);
                break;
            }
            $stmt = $pdo->prepare(
                "INSERT INTO pessoa (nome, endereco, telefone, email, sexo) VALUES (?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $dados['nome'],
                $dados['endereco'],
                $dados['telefone'],
                $dados['email'],
                $dados['sexo']
            ]);
            $novoId = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode(['id' => $novoId, 'mensagem' => 'Contato criado com sucesso']);
            break;

        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['erro' => 'ID é obrigatório']);
                break;
            }
            $dados = json_decode(file_get_contents('php://input'), true);
            $erros = validarDados($dados);
            if (!empty($erros)) {
                http_response_code(422);
                echo json_encode(['erros' => $erros]);
                break;
            }
            $stmt = $pdo->prepare(
                "UPDATE pessoa SET nome = ?, endereco = ?, telefone = ?, email = ?, sexo = ? WHERE id = ?"
            );
            $stmt->execute([
                $dados['nome'],
                $dados['endereco'],
                $dados['telefone'],
                $dados['email'],
                $dados['sexo'],
                $id
            ]);
            echo json_encode(['mensagem' => 'Contato atualizado com sucesso']);
            break;

        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['erro' => 'ID é obrigatório']);
                break;
            }
            $stmt = $pdo->prepare("DELETE FROM pessoa WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['mensagem' => 'Contato excluído com sucesso']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['erro' => 'Método não permitido']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno do servidor']);
}

function validarDados($dados) {
    $erros = [];
    if (empty($dados['nome'])) $erros[] = 'Nome é obrigatório';
    if (empty($dados['endereco'])) $erros[] = 'Endereço é obrigatório';
    if (empty($dados['telefone'])) $erros[] = 'Telefone é obrigatório';
    if (empty($dados['email'])) {
        $erros[] = 'Email é obrigatório';
    } elseif (!filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        $erros[] = 'Email inválido';
    }
    if (empty($dados['sexo'])) $erros[] = 'Sexo é obrigatório';
    return $erros;
}
