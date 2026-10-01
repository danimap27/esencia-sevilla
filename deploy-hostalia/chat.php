<?php
/**
 * Proxy del chat de Esencia Sevilla para hosting ESTÁTICO (Hostalia compartido).
 *
 * El widget primero intenta /api/chat (Next.js con Node). Si no existe (hosting
 * solo estático), cae aquí. Esta llamada hace de puente a OpenRouter: la API key
 * vive en chat-config.php (subido por FTP, NO es parte del sitio compilado ni
 * viaja al navegador).
 *
 * Requisitos del hosting: PHP 8+ con curl (incluido en cualquier hosting de Hostalia).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$configFile = __DIR__ . '/chat-config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    echo json_encode(['message' => 'Chat no configurado. Falta chat-config.php (sube el archivo con tu API key).']);
    exit;
}
$CONFIG = require $configFile;
$apiKey = (string)($CONFIG['api_key'] ?? '');
if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(['message' => 'Chat no configurado: falta la API key en chat-config.php.']);
    exit;
}

// --- Entrada saneada ---
$raw = file_get_contents('php://input');
$data = json_decode((string)$raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$history = [];
foreach ((array)($data['messages'] ?? []) as $m) {
    if (is_array($m) && isset($m['role'], $m['content'])
        && in_array($m['role'], ['user', 'assistant'], true)
        && is_string($m['content']) && $m['content'] !== '') {
        // mbstring no siempre está instalado en hosting compartido
        $text = $m['content'];
        $text = function_exists('mb_substr') ? mb_substr($text, 0, 4000) : substr($text, 0, 4000);
        $history[] = ['role' => $m['role'], 'content' => $text];
    }
    if (count($history) >= 10) break;
}
if (!$history) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty messages']);
    exit;
}

$SYSTEM_PROMPT = (string)($CONFIG['system_prompt'] ?? '');
$models = array_values(array_unique(array_filter(array_merge(
    [(string)($CONFIG['model'] ?? 'openai/gpt-5-nano')],
    (array)($CONFIG['fallbacks'] ?? [])
))));

// --- Cadena de modelos: el primero que responda, gana ---
$ch = curl_init();
$lastError = 'none';
foreach ($models as $model) {
    $payload = [
        'model' => $model,
        'messages' => array_merge(
            $SYSTEM_PROMPT !== '' ? [['role' => 'system', 'content' => $SYSTEM_PROMPT]] : [],
            $history
        ),
        'max_tokens' => 800,
        'temperature' => 0.7,
    ];
    if (strncmp($model, 'openai/gpt-5', 12) === 0) {
        $payload['reasoning'] = ['effort' => 'minimal'];
    }

    curl_setopt_array($ch, [
        CURLOPT_URL => 'https://openrouter.ai/api/v1/chat/completions',
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'HTTP-Referer: https://esenciasevilla.com',
            'X-Title: Esencia Sevilla Assistant',
        ],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $resp = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($resp !== false && $status >= 200 && $status < 300) {
        $out = json_decode((string)$resp, true);
        $content = trim((string)($out['choices'][0]['message']['content'] ?? ''));
        if ($content !== '') {
            curl_close($ch);
            echo json_encode(['message' => $content, 'model' => $model], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $lastError = 'empty from ' . $model;
    } else {
        $lastError = $model . ' → HTTP ' . $status;
    }
}
curl_close($ch);

// Nada respondió: mensaje amable con WhatsApp (mismo tono que el widget)
http_response_code(503);
echo json_encode([
    'error' => 'all_models_failed',
    'detail' => $lastError,
    'message' => 'Error al conectar con el asistente. Por favor, contáctanos por WhatsApp (+34 658 410 769).',
], JSON_UNESCAPED_UNICODE);
