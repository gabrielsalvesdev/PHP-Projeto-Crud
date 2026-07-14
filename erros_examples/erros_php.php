# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
# REFATORADO: Refatorar c������������������������������������������������������digo para: Analisar o projeto PHP CRUD e aplicar melhorias de código, incluindo boas práticas, segurança e performance
<?php
/**
 * ARQUIVO DE EXEMPLOS DE ERROS PHP INTENCIONAIS
 * Serve como repositório para análise com ferramentas de linting/static analysis.
 * Erros comuns detectáveis por: PHPStan, Psalm, PHP_CodeSniffer, Rector, etc.
 */

// ─────────────────────────────────────────────
// 1. VARIÁVEIS INDEFINIDAS (Undefined Variable)
// ─────────────────────────────────────────────
function exemploVariavelIndefinida() {
    echo $nomeNaoDeclarado; // variável nunca foi definida
    $resultado = $valorA + $valorB; // ambas indefinidas
    return $resultado;
}

// ─────────────────────────────────────────────
// 2. TIPO INCORRETO (Type Mismatch)
// ─────────────────────────────────────────────
function somar(int $a, int $b): int {
    return $a + $b;
}

$resultado = somar("dez", "vinte"); // strings passadas onde int é esperado

// ─────────────────────────────────────────────
// 3. RETORNO NULO SEM VERIFICAÇÃO (Null Dereference)
// ─────────────────────────────────────────────
function buscarContato(int $id): ?array {
    return null; // pode retornar null
}

$contato = buscarContato(1);
echo $contato['nome']; // acessando propriedade de possível null sem checar

// ─────────────────────────────────────────────
// 4. COMPARAÇÃO COM == EM VEZ DE === (Loose Comparison)
// ─────────────────────────────────────────────
function verificarAdmin($usuario) {
    if ($usuario == 0) { // 0 == "0" == false == null == "" em PHP
        echo "Usuário é administrador";
    }
    if ($usuario == false) { // armadilha clássica
        echo "Falso positivo possível";
    }
}

// ─────────────────────────────────────────────
// 5. SQL INJECTION (Concatenação direta na query)
// ─────────────────────────────────────────────
function buscarPorNomeInseguro(PDO $pdo, string $nome) {
    $sql = "SELECT * FROM pessoa WHERE nome = '" . $nome . "'"; // VULNERÁVEL
    return $pdo->query($sql);
}

// ─────────────────────────────────────────────
// 6. DIVISÃO POR ZERO SEM VERIFICAÇÃO
// ─────────────────────────────────────────────
function calcularMedia(int $total, int $quantidade): float {
    return $total / $quantidade; // quantidade pode ser 0
}

$media = calcularMedia(100, 0); // divisão por zero

// ─────────────────────────────────────────────
// 7. FUNÇÃO COM RETORNO IMPLÍCITO NULL
// ─────────────────────────────────────────────
function obterEmail(array $dados): string {
    if (!empty($dados['email'])) {
        return $dados['email'];
    }
    // sem return aqui: retorna null implicitamente, mas tipo diz string
}

// ─────────────────────────────────────────────
// 8. LOOP INFINITO POTENCIAL
// ─────────────────────────────────────────────
function processarItens(array $itens) {
    $i = 0;
    while ($i < count($itens)) { // count() chamado a cada iteração desnecessariamente
        echo $itens[$i];
        // $i++ esquecido — loop infinito real
    }
}

// ─────────────────────────────────────────────
// 9. VARIÁVEL USADA ANTES DE SER ATRIBUÍDA
// ─────────────────────────────────────────────
function calcular(bool $ativo) {
    if ($ativo) {
        $valor = 100;
    }
    return $valor * 2; // $valor pode não existir se $ativo for false
}

// ─────────────────────────────────────────────
// 10. SUPRESSÃO DE ERRO COM @ (Error Suppression)
// ─────────────────────────────────────────────
function lerArquivo(string $caminho): string {
    $conteudo = @file_get_contents($caminho); // @ esconde erros reais
    return $conteudo; // pode ser false, mas tipo declara string
}

// ─────────────────────────────────────────────
// 11. CONSTANTE INDEFINIDA USADA COMO STRING
// ─────────────────────────────────────────────
function usarConstante() {
    $status = ATIVO; // ATIVO não foi definida — PHP trata como string 'ATIVO'
    return $status;
}

// ─────────────────────────────────────────────
// 12. PARÂMETRO NUNCA UTILIZADO (Dead Code)
// ─────────────────────────────────────────────
function formatarNome(string $nome, string $sobrenome, string $prefixo): string {
    return strtoupper($nome); // $sobrenome e $prefixo nunca são usados
}

// ─────────────────────────────────────────────
// 13. MÉTODO INEXISTENTE CHAMADO EM OBJETO
// ─────────────────────────────────────────────
class Pessoa {
    public string $nome;
    public function __construct(string $nome) {
        $this->nome = $nome;
    }
}

$pessoa = new Pessoa("João");
$pessoa->salvar(); // método salvar() não existe na classe

// ─────────────────────────────────────────────
// 14. ARRAY_KEY ACESSADO SEM VERIFICAÇÃO (Undefined Index)
// ─────────────────────────────────────────────
function processarPost() {
    $nome = $_POST['nome'];     // pode não existir
    $email = $_POST['email'];   // pode não existir
    $cpf = $_POST['cpf'];       // pode não existir
    return compact('nome', 'email', 'cpf');
}

// ─────────────────────────────────────────────
// 15. RECURSÃO SEM CONDIÇÃO DE PARADA (Stack Overflow)
// ─────────────────────────────────────────────
function fatorial(int $n): int {
    return $n * fatorial($n - 1); // sem base case: fatorial(0) ou fatorial(1)
}
