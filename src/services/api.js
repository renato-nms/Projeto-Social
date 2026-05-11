// src/services/api.js

// ============================================================
// CONFIGURAÇÃO: troque esta URL quando o back-end estiver no ar
// ============================================================
const BASE_URL = "http://localhost:3000/api"; // exemplo

// ============================================================
// DADOS MOCK (simulam o banco de dados enquanto não há back-end)
// ============================================================
const mockQuestionsBank = {
  facil: [
    { id: 1, enunciado: "Qual a capital do Brasil?", alternativas: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], correta: 2 },
    { id: 2, enunciado: "Quanto é 2 + 2?", alternativas: ["3", "4", "5", "6"], correta: 1 },
    { id: 3, enunciado: "Qual a cor do céu em dia limpo?", alternativas: ["Verde", "Vermelho", "Azul", "Amarelo"], correta: 2 },
  ],
  medio: [
    { id: 1, enunciado: "Quem pintou a Mona Lisa?", alternativas: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], correta: 2 },
    { id: 2, enunciado: "Qual a raiz quadrada de 64?", alternativas: ["6", "7", "8", "9"], correta: 2 },
  ],
  dificil: [
    { id: 1, enunciado: "Qual o maior planeta do sistema solar?", alternativas: ["Marte", "Júpiter", "Saturno", "Netuno"], correta: 1 },
  ],
};

// Controle de perguntas já usadas (simula estado no servidor)
let usedQuestionsPerDifficulty = {
  facil: new Set(),
  medio: new Set(),
  dificil: new Set(),
};

// Função auxiliar para simular atraso de rede
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================
// FUNÇÕES QUE SEU AMIGO VAI IMPLEMENTAR NO BACK-END
// (por enquanto, são mocks)
// ============================================================

/**
 * GET /pergunta/:dificuldade
 * Retorna uma pergunta não usada da dificuldade solicitada.
 */
export async function getPergunta(dificuldade) {
  // Simula requisição de rede
  await delay();

  // 🔁 QUANDO O BACK-END ESTIVER PRONTO, SUBSTITUA POR:
  // const response = await fetch(`${BASE_URL}/pergunta/${dificuldade}`);
  // if (!response.ok) throw new Error('Erro ao buscar pergunta');
  // return await response.json();

  // --- MOCK ---
  const available = mockQuestionsBank[dificuldade];
  if (!available || available.length === 0) return null;

  const used = usedQuestionsPerDifficulty[dificuldade];
  const unused = available.filter(q => !used.has(q.id));
  let selected = null;

  if (unused.length === 0) {
    // reinicia ciclo
    used.clear();
    selected = available[Math.floor(Math.random() * available.length)];
    used.add(selected.id);
    console.warn(`Todas as perguntas de ${dificuldade} foram usadas. Reiniciando.`);
  } else {
    selected = unused[Math.floor(Math.random() * unused.length)];
    used.add(selected.id);
  }
  // Remove o campo "correta" da resposta (não deve ir para o front-end)
  const { correta, ...perguntaSemResposta } = selected;
  return { ...perguntaSemResposta, id: selected.id, dificuldade };
}

/**
 * POST /responder
 * Body: { jogadorId, perguntaId, respostaSelecionada, dificuldade }
 * Retorna { correto: boolean, pontosGanhos: number, mensagem: string }
 */
export async function responderPergunta(jogadorId, perguntaId, respostaSelecionada, dificuldade) {
  await delay();

  // 🔁 QUANDO O BACK-END ESTIVER PRONTO:
  // const response = await fetch(`${BASE_URL}/responder`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ jogadorId, perguntaId, respostaSelecionada, dificuldade }),
  // });
  // return await response.json();

  // --- MOCK ---
  // Encontra a pergunta original (com a resposta correta) no banco mock
  const perguntaOriginal = mockQuestionsBank[dificuldade]?.find(p => p.id === perguntaId);
  if (!perguntaOriginal) return { correto: false, pontosGanhos: 0, mensagem: "Pergunta não encontrada" };
  const correto = (respostaSelecionada === perguntaOriginal.correta);
  const pontosGanhos = correto ? 1 : 0;
  return {
    correto,
    pontosGanhos,
    mensagem: correto ? "✅ Correto!" : "❌ Errado!",
    respostaCorreta: perguntaOriginal.alternativas[perguntaOriginal.correta],
  };
}

/**
 * POST /partida
 * Body: { jogadores: [ { nome } ] }
 * Retorna { idPartida, jogadoresComId }
 */
export async function criarPartida(jogadores) {
  await delay();

  // 🔁 BACK-END:
  // const response = await fetch(`${BASE_URL}/partida`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ jogadores }),
  // });
  // return await response.json();

  // --- MOCK ---
  const jogadoresComId = jogadores.map((nome, idx) => ({ id: idx + 1, nome, score: 0 }));
  return { idPartida: Math.floor(Math.random() * 10000), jogadores: jogadoresComId };
}

// (Opcional) função para reiniciar o estado mock (usado ao sair do jogo)
export function resetMockState() {
  usedQuestionsPerDifficulty = {
    facil: new Set(),
    medio: new Set(),
    dificil: new Set(),
  };
}+