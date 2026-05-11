// src/Quiz.jsx
import { useState } from "react";
import "./Quiz.css";

// --------------------------------------------------------------
// BANCO DE PERGUNTAS (textos completos, como você tinha)
// --------------------------------------------------------------
const questionsBank = {
  facil: [
    {
      id: 1,
      enunciado: "Qual cidade é conhecida como a 'Capital da Alegria' e sedia um dos maiores carnavais do mundo?",
      alternativas: [
        "Salvador, na Bahia – famosa pelo seu carnaval de rua e trios elétricos.",
        "Rio de Janeiro, no Rio de Janeiro – com o carnaval do sambódromo e bailes.",
        "Recife, em Pernambuco – com o Galo da Madrugada e frevo.",
        "São Paulo, em São Paulo – com o carnaval de rua e os blocos gigantes."
      ],
      correta: 0
    },
    {
      id: 2,
      enunciado: "Qual destes ecossistemas brasileiros é considerado a maior planície alagável do mundo e abriga uma fauna única como o jacaré-do-pantanal e a arara-azul?",
      alternativas: [
        "A Amazônia – floresta tropical que produz grande parte da umidade do continente.",
        "A Caatinga – bioma semiárido exclusivo do Brasil, com espécies adaptadas à seca.",
        "O Pantanal – uma das maiores extensões alagáveis do planeta, rica em biodiversidade.",
        "O Cerrado – savana brasileira com árvores tortuosas e raízes profundas."
      ],
      correta: 2
    },
    {
      id: 3,
      enunciado: "Na mitologia grega, quem foi o herói que realizou os doze trabalhos impossíveis, incluindo a captura do Leão de Nemeia e a limpeza dos estábulos de Áugias?",
      alternativas: [
        "Perseu – conhecido por matar a Medusa e salvar Andrômeda.",
        "Teseu – famoso por derrotar o Minotauro no labirinto de Creta.",
        "Aquiles – herói da Guerra de Troia, imortal exceto pelo calcanhar.",
        "Héracles (Hércules) – semideus filho de Zeus, famoso por sua força e pelos doze trabalhos."
      ],
      correta: 3
    }
  ],
  medio: [
    {
      id: 1,
      enunciado: "Qual físico teórico desenvolveu a teoria da relatividade geral, revolucionando a compreensão da gravidade, do espaço-tempo e prevendo fenômenos como buracos negros e a curvatura da luz?",
      alternativas: [
        "Isaac Newton – formulou a lei da gravitação universal e as três leis do movimento.",
        "Niels Bohr – contribuiu para o modelo atômico e a mecânica quântica.",
        "Albert Einstein – autor da relatividade geral e especial, ganhador do Nobel pelo efeito fotoelétrico.",
        "Galileu Galilei – pai da astronomia moderna, defendeu o heliocentrismo."
      ],
      correta: 2
    },
    {
      id: 2,
      enunciado: "Na literatura brasileira, qual movimento literário do século XIX tinha como principais características o nacionalismo, o indianismo e a exaltação da natureza, sendo seus maiores expoentes José de Alencar e Gonçalves Dias?",
      alternativas: [
        "Barroco – marcado por dualismo, conflitos religiosos e autores como Gregório de Matos.",
        "Romantismo – primeira fase com forte apelo à construção da identidade nacional e figura do índio.",
        "Realismo – crítica social e objetivismo, com Machado de Assis como principal nome.",
        "Modernismo – ruptura com o passado e valorização do cotidiano, a partir da Semana de 1922."
      ],
      correta: 1
    }
  ],
  dificil: [
    {
      id: 1,
      enunciado: "Qual evento histórico, ocorrido em 1969, representou a primeira vez que um ser humano pisou na Lua, sendo parte da corrida espacial entre Estados Unidos e União Soviética durante a Guerra Fria, e contou com os astronautas Neil Armstrong, Buzz Aldrin e Michael Collins?",
      alternativas: [
        "Apollo 11 – missão espacial norte-americana que levou os primeiros homens à superfície lunar.",
        "Sputnik 1 – primeiro satélite artificial lançado pela União Soviética em 1957.",
        "Vostok 1 – missão que levou Yuri Gagarin a ser o primeiro humano no espaço, em 1961.",
        "Apollo 13 – missão que sofreu uma explosão e retornou à Terra sem pousar na Lua."
      ],
      correta: 0
    }
  ]
};

// Controle de perguntas já usadas
let usedQuestions = { facil: [], medio: [], dificil: [] };
const getRandomQuestion = (difficulty) => {
  const available = questionsBank[difficulty];
  if (!available || available.length === 0) return null;
  let unused = available.filter(q => !usedQuestions[difficulty].includes(q.id));
  if (unused.length === 0) {
    usedQuestions[difficulty] = [];
    unused = [...available];
  }
  const randomIndex = Math.floor(Math.random() * unused.length);
  const selected = unused[randomIndex];
  usedQuestions[difficulty].push(selected.id);
  return selected;
};

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
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionLocked, setQuestionLocked] = useState(false);

  // Times
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
    setShowScore(false);
    setSelectedOption(null);
    setQuestionLocked(false);
    usedQuestions = { facil: [], medio: [], dificil: [] };
  };

  const chooseDifficulty = (difficulty) => {
    const question = getRandomQuestion(difficulty);
    if (!question) {
      alert("Nenhuma pergunta disponível para essa dificuldade!");
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
    setWaitingDifficulty(true);
    setCurrentQuestion(null);
    setShowQuestionScreen(false);
    setShowPassTeamSelector(false);
    setShowResponseScreen(false);
    setSelectedOption(null);
    setQuestionLocked(false);
  };

  const handleFinishGame = () => {
    if (window.confirm("Encerrar quiz?")) setShowScore(true);
  };

  const handleExit = () => {
    if (window.confirm("Sair? Perderá progresso.")) {
      setGameStarted(false);
      setTeamNames([""]);
      setTeams([]);
      setWaitingDifficulty(false);
      setCurrentQuestion(null);
      setShowQuestionScreen(false);
      setShowPassTeamSelector(false);
      setShowResponseScreen(false);
      setShowScore(false);
      setSelectedOption(null);
      setQuestionLocked(false);
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
    setShowScore(false);
    setSelectedOption(null);
    setQuestionLocked(false);
    usedQuestions = { facil: [], medio: [], dificil: [] };
  };

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  // Telas
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

  if (showScore) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="ranking-title">🏆 Ranking Final</h2>
          {sortedTeams.map((team, idx) => (
            <div key={team.id} className="ranking-item">
              <span>#{idx + 1} - {team.name}</span>
              <span>{team.score} pts</span>
            </div>
          ))}
          <button onClick={restartGame} className="restart-button">Jogar Novamente</button>
        </div>
      </div>
    );
  }

  if (waitingDifficulty) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div style={{ textAlign: "center" }}>
            <button onClick={handleExit} className="back-button" style={{ float: "left" }}>← Sair</button>
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
          <button onClick={handleExit} className="back-button" style={{ float: "left" }}>← Sair</button>
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
          <button onClick={handleExit} className="back-button" style={{ float: "left" }}>← Sair</button>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleFinishGame} className="finish-button">Encerrar Quiz</button>
          </div>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#FF8C00" }}>Vez do time:</h3>
            <h2 style={{ color: "white" }}>{currentTeam.name}</h2>
          </div>
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