// src/Quiz.jsx
import { useState } from "react";
import "./Quiz.css";

// --------------------------------------------------------------
// BANCO DE PERGUNTAS POR DIFICULDADE
// (cada pergunta tem 4 alternativas)
// --------------------------------------------------------------
const questionsBank = {
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

// Função auxiliar: pega pergunta aleatória de uma dificuldade
const getRandomQuestion = (difficulty) => {
  const questions = questionsBank[difficulty];
  if (!questions || questions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export default function Quiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [names, setNames] = useState([""]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  
  // Estados de controle do jogo
  const [waitingDifficulty, setWaitingDifficulty] = useState(false); // mediador escolhendo
  const [currentQuestion, setCurrentQuestion] = useState(null);      // pergunta atual
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showScore, setShowScore] = useState(false);

  // Adicionar jogador
  const addPlayer = () => setNames([...names, ""]);
  const handleNameChange = (idx, val) => {
    const updated = [...names];
    updated[idx] = val;
    setNames(updated);
  };

  const startGame = () => {
    const validNames = names.filter(n => n.trim() !== "");
    if (validNames.length === 0) {
      alert("Digite pelo menos um nome");
      return;
    }
    const playersData = validNames.map((name, i) => ({
      id: i + 1,
      name,
      score: 0,
    }));
    setPlayers(playersData);
    setGameStarted(true);
    setWaitingDifficulty(true);  // primeiro, mediador escolhe dificuldade
    setCurrentPlayer(0);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowResponseScreen(false);
    setShowScore(false);
  };

  // Mediador escolhe a dificuldade
  const chooseDifficulty = (difficulty) => {
    const question = getRandomQuestion(difficulty);
    if (!question) {
      alert("Nenhuma pergunta disponível para essa dificuldade!");
      return;
    }
    setCurrentQuestion(question);
    setWaitingDifficulty(false);
    setSelectedOption(null);
    setShowResponseScreen(false);
  };

  // Jogador seleciona opção
  const handleSelectOption = (optionIdx) => {
    if (showResponseScreen || waitingDifficulty) return;
    setSelectedOption(optionIdx);
  };

  const handleConfirm = () => {
    if (selectedOption === null || !currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correta;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayer].score += 1;
      setPlayers(updatedPlayers);
    }
    setShowResponseScreen(true);
  };

  const handleContinue = () => {
    const nextPlayer = (currentPlayer + 1) % players.length;
    setCurrentPlayer(nextPlayer);
    setWaitingDifficulty(true);   // mediador escolhe nova dificuldade para o próximo
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowResponseScreen(false);
  };

  const handleFinishGame = () => {
    if (window.confirm("Tem certeza que deseja encerrar o quiz?")) {
      setShowScore(true);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setNames([""]);
    setPlayers([]);
    setCurrentPlayer(0);
    setWaitingDifficulty(false);
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowResponseScreen(false);
    setShowScore(false);
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  // ---------- TELA INICIAL (cadastro, sem dificuldade fixa) ----------
  if (!gameStarted) {
    return (
      <div className="start-container">
        <div className="start-card">
          <h1 className="start-title">Nome dos Jogadores</h1>
          {names.map((name, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Jogador ${idx + 1}`}
              value={name}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              className="player-input"
            />
          ))}
          <button onClick={addPlayer} className="add-button">
            + Adicionar Jogador
          </button>
          <button onClick={startGame} className="start-button">
            Iniciar Partida
          </button>
        </div>
      </div>
    );
  }

  // ---------- TELA DE RANKING ----------
  if (showScore) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="ranking-title">🏆 Ranking Final</h2>
          {sortedPlayers.map((player, idx) => (
            <div key={player.id} className="ranking-item">
              <span>#{idx + 1} - {player.name}</span>
              <span>{player.score} pts</span>
            </div>
          ))}
          <button onClick={restartGame} className="restart-button">
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  // ---------- TELA DO MEDIADOR: escolher dificuldade ----------
  if (waitingDifficulty) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "white" }}>🎮 Mediadordifficulty?choose</h1>
            <p style={{ color: "white", marginBottom: "2rem" }}>
              Vez de: <strong>{players[currentPlayer]?.name}</strong>
            </p>
            <div className="difficulty-selector">
              {["facil", "medio", "dificil"].map((level) => (
                <button
                  key={level}
                  className="difficulty-button"
                  onClick={() => chooseDifficulty(level)}
                >
                  {level === "facil" ? "Fácil" : level === "medio" ? "Médio" : "Difícil"}
                </button>
              ))}
            </div>
            <button onClick={handleFinishGame} className="finish-button" style={{ marginTop: "2rem" }}>
              Encerrar Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- TELA DE RESPOSTA (acertou/errou) ----------
  if (showResponseScreen && currentQuestion) {
    const correctAnswerText = currentQuestion.alternativas[currentQuestion.correta];
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="response-screen">
            <div className="response-icon">{lastAnswerCorrect ? "🎉" : "❌"}</div>
            <div className="response-title">{lastAnswerCorrect ? "Correto!" : "Errado!"}</div>
            {!lastAnswerCorrect && (
              <div className="response-message">
                Resposta correta: <strong>{correctAnswerText}</strong>
              </div>
            )}
            <button onClick={handleContinue} className="continue-button">
              Continuar →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- TELA DA PERGUNTA (jogador responde) ----------
  if (!waitingDifficulty && currentQuestion) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleFinishGame} className="finish-button">
              Encerrar Quiz
            </button>
          </div>
          <div className="current-player">
            <div className="current-player-label">Vez de</div>
            <div className="current-player-name">{players[currentPlayer]?.name}</div>
          </div>
          <h3 style={{ color: "white", textAlign: "center", marginBottom: "1rem" }}>
            {currentQuestion.enunciado}
          </h3>
          <div className="options-grid">
            {currentQuestion.alternativas.map((alt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`option-button ${
                  selectedOption === idx ? "option-button-selected" : "option-button-unselected"
                }`}
              >
                {alt}
              </button>
            ))}
          </div>
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className="confirm-button"
          >
            Confirmar Resposta
          </button>
        </div>
      </div>
    );
  }

  // Fallback (não deveria acontecer)
  return null;
}