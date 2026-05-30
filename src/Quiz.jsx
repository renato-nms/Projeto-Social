// src/Quiz.jsx
import { useState } from "react";
import "./Quiz.css";
import questionsbank from "Quiz.json"

// Controle de perguntas já usadas
let usedQuestions = { facil: [], medio: [], dificil: [] };

const getRandomQuestion = (difficulty) => {
  const available = questionsBank[difficulty];
  if (!available || available.length === 0) return null;

  let unused = available.filter(q => !usedQuestions[difficulty].includes(q.id));
  if (unused.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * unused.length);
  const selected = unused[randomIndex];
  usedQuestions[difficulty].push(selected.id);
  return selected;
};

const totalQuestions = Object.values(questionsBank).reduce((acc, level) => acc + level.length, 0);

export default function Quiz() {
  const [gameStarted, setGameStarted] = useState(false);
  const [teamNames, setTeamNames] = useState([""]);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [waitingDifficulty, setWaitingDifficulty] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestionScreen, setShowQuestionScreen] = useState(false);
  const [showPassTeamSelector, setShowPassTeamSelector] = useState(false);
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionLocked, setQuestionLocked] = useState(false);

  const addTeam = () => setTeamNames([...teamNames, ""]);
  const handleTeamNameChange = (idx, val) => {
    const updated = [...teamNames];
    updated[idx] = val;
    setTeamNames(updated);
  };

  const startGame = () => {
    const validNames = teamNames.filter(n => n.trim() !== "");
    if (validNames.length === 0) {
      alert("Digite pelo menos um time");
      return;
    }
    const teamsData = validNames.map((name, i) => ({ id: i + 1, name, score: 0 }));
    setTeams(teamsData);
    setGameStarted(true);
    setWaitingDifficulty(true);
    setCurrentTeamIndex(0);
    setCurrentQuestion(null);
    setShowQuestionScreen(false);
    setShowPassTeamSelector(false);
    setShowResponseScreen(false);
    setSelectedOption(null);
    setQuestionLocked(false);
    usedQuestions = { facil: [], medio: [], dificil: [] };
  };

  const chooseDifficulty = (difficulty) => {
    const question = getRandomQuestion(difficulty);
    if (!question) {
      alert(`Não há mais perguntas disponíveis na dificuldade ${difficulty === 'facil' ? 'Fácil' : difficulty === 'medio' ? 'Médio' : 'Difícil'}! Escolha outra.`);
      return; 
    }
    setCurrentQuestion(question);
    setWaitingDifficulty(false);
    setShowQuestionScreen(true);
    setShowPassTeamSelector(false);
    setShowResponseScreen(false);
    setSelectedOption(null);
    setQuestionLocked(false);
  };

  const handleSelectOption = (optionIdx) => {
    if (showResponseScreen || waitingDifficulty || questionLocked) return;
    setSelectedOption(optionIdx);
  };

  const confirmAnswer = () => {
    if (selectedOption === null || !currentQuestion || questionLocked) return;
    const isCorrect = selectedOption === currentQuestion.correta;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) {
      const updatedTeams = [...teams];
      updatedTeams[currentTeamIndex].score += 1;
      setTeams(updatedTeams);
    }
    setQuestionLocked(true);
    setShowQuestionScreen(false);
    setShowResponseScreen(true);
  };

  const openPassSelector = () => {
    if (questionLocked) return;
    setShowQuestionScreen(false);
    setShowPassTeamSelector(true);
  };

  const passToTeam = (targetTeamId) => {
    const newIndex = teams.findIndex(t => t.id === targetTeamId);
    if (newIndex === -1) return;
    setCurrentTeamIndex(newIndex);
    setSelectedOption(null);
    setShowPassTeamSelector(false);
    setShowQuestionScreen(true);
  };

  const goToNextQuestion = () => {
    const totalUsed = Object.values(usedQuestions).flat().length;
    if (totalUsed >= totalQuestions) {
      const sorted = [...teams].sort((a, b) => b.score - a.score);
      const winner = sorted[0];
      alert(`🏆 Fim do jogo! Todas as perguntas foram respondidas.\nVencedor: ${winner.name} com ${winner.score} ponto(s)!`);
      restartGame();
      return;
    }
    setWaitingDifficulty(true);
    setCurrentQuestion(null);
    setShowQuestionScreen(false);
    setShowPassTeamSelector(false);
    setShowResponseScreen(false);
    setSelectedOption(null);
    setQuestionLocked(false);
  };

  const handleFinishGame = () => {
    if (window.confirm("Encerrar quiz?")) {
      restartGame();
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setTeamNames([""]);
    setTeams([]);
    setWaitingDifficulty(false);
    setCurrentQuestion(null);
    setShowQuestionScreen(false);
    setShowPassTeamSelector(false);
    setShowResponseScreen(false);
    setSelectedOption(null);
    setQuestionLocked(false);
    usedQuestions = { facil: [], medio: [], dificil: [] };
  };

  if (!gameStarted) {
    return (
      <div className="start-container">
        <div className="start-card">
          <h1 className="start-title">Nome dos Times</h1>
          {teamNames.map((name, idx) => (
            <input key={idx} type="text" placeholder={`Time ${idx + 1}`} value={name} onChange={(e) => handleTeamNameChange(idx, e.target.value)} className="player-input" />
          ))}
          <button onClick={addTeam} className="add-button">+ Adicionar Time</button>
          <button onClick={startGame} className="start-button">Iniciar Partida</button>
        </div>
      </div>
    );
  }

  if (waitingDifficulty) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "white", marginBottom: "0.5rem" }}>🎮 Mediador</h1>
            <p style={{ color: "#ccc", marginBottom: "2rem" }}>Escolha a dificuldade da próxima pergunta:</p>
            <div className="difficulty-selector">
              <button className="difficulty-button" onClick={() => chooseDifficulty("facil")} style={{ backgroundColor: "#22c55e" }}>Fácil</button>
              <button className="difficulty-button" onClick={() => chooseDifficulty("medio")} style={{ backgroundColor: "#eab308" }}>Médio</button>
              <button className="difficulty-button" onClick={() => chooseDifficulty("dificil")} style={{ backgroundColor: "#ef4444" }}>Difícil</button>
            </div>
            <button onClick={handleFinishGame} className="finish-button" style={{ marginTop: "2rem" }}>Encerrar Quiz</button>
          </div>
        </div>
      </div>
    );
  }

  if (showPassTeamSelector) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <button onClick={() => { setShowPassTeamSelector(false); setShowQuestionScreen(true); }} className="back-button">← Voltar</button>
          <h2 style={{ color: "white", textAlign: "center" }}>Passar a vez para qual time?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
            {teams.filter(t => t.id !== teams[currentTeamIndex].id).map(team => (
              <button key={team.id} onClick={() => passToTeam(team.id)} className="team-select-button">
                {team.name} (pontos: {team.score})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResponseScreen && currentQuestion) {
    const correctAnswerText = currentQuestion.alternativas[currentQuestion.correta];
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="response-screen">
            <div className="response-icon">{lastAnswerCorrect ? "🎉" : "❌"}</div>
            <div className="response-title">{lastAnswerCorrect ? "Correto!" : "Errado!"}</div>
            {!lastAnswerCorrect && (
              <div className="response-message">Resposta correta: <strong>{correctAnswerText}</strong></div>
            )}
            <button onClick={goToNextQuestion} className="continue-button">Próxima Pergunta →</button>
          </div>
        </div>
      </div>
    );
  }

  if (showQuestionScreen && currentQuestion && teams.length) {
    const currentTeam = teams[currentTeamIndex];
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleFinishGame} className="finish-button">Encerrar Quiz</button>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#FF8C00" }}>Vez do time:</h3>
            <h2 style={{ color: "white" }}>{currentTeam.name}</h2>
          </div>
          
          {/* Lógica de renderização condicional da Imagem */}
          {currentQuestion.imagem && (
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <img 
                src={currentQuestion.imagem} 
                alt="Imagem da questão" 
                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", border: "2px solid #334155" }} 
              />
            </div>
          )}

          <h3 style={{ color: "white", textAlign: "center", marginBottom: "1rem" }}>{currentQuestion.enunciado}</h3>
          
          <div className="options-list">
            {currentQuestion.alternativas.map((alt, idx) => {
              const letra = String.fromCharCode(65 + idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`option-button ${selectedOption === idx ? "option-button-selected" : "option-button-unselected"}`}
                >
                  <span className="option-letter">{letra}.</span> {alt}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button onClick={confirmAnswer} disabled={selectedOption === null} className="confirm-button">Responder</button>
            <button onClick={openPassSelector} className="pass-button">Passar a vez</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}