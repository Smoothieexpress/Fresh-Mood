<?php
// Récupération des données POST
$data = json_decode(file_get_contents('php://input'), true);
$operator = $data['operator'];
$phone = $data['phone'];
$amount = $data['amount'];

// Validation des données
if (!$operator || !$phone || !$amount) {
  echo json_encode(['success' => false, 'message' => 'Données invalides.']);
  exit;
}

// Traitement en fonction de l'opérateur
if ($operator === 'mtn') {
  // Intégration avec l'API MTN MoMo
  // ...
  echo json_encode(['success' => true]);
} elseif ($operator === 'moov') {
  // Intégration avec l'API Moov Money
  // ...
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'message' => 'Opérateur inconnu.']);
}
?>