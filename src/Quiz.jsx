// src/Quiz.jsx
import { useState } from "react";
import "./Quiz.css";

// Importação das imagens (ajuste o caminho se sua pasta assets estiver em outro local)
import img1d4facil from "./assets/1d4facil.png";
import img3d4facil from "./assets/3d4facil.png";
import img4d4facil from "./assets/4d4facil.png";
import img5d4facil from "./assets/5d4facil.png";
import img6d4facil from "./assets/6d4facil.png";
import img7d4facil from "./assets/7d4facil.png";
import img8d4facil from "./assets/8d4facil.png";
import img9d4facil from "./assets/9d4facil.png";

// --------------------------------------------------------------
// BANCO DE PERGUNTAS
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
    },
    // Novas questões com imagens (D4)
    {
      id: 4,
      imagem: img1d4facil,
      enunciado: "Nesse texto, os animais correram porque:",
      alternativas: [
        "achavam que era hora de comer.",
        "foram chamados pelo menino.",
        "ouviram o alerta de perigo.",
        "queriam ficar perto do menino."
      ],
      correta: 0
    },
    {
      id: 5,
      imagem: img3d4facil,
      enunciado: "A tirinha de Armandinho faz uma crítica sobre:",
      alternativas: [
        "o fato de haver diferentes pontos de vista.",
        "a vontade de conhecer novos pontos de vista.",
        "a não aceitação de diferentes pontos de vista.",
        "o fato de todos terem o mesmo ponto de vista."
      ],
      correta: 2
    },
    {
      id: 6,
      imagem: img4d4facil,
      enunciado: "Na charge, a expressão facial do homem na cama demonstra que ele está:",
      alternativas: [
        "doente.",
        "cansado.",
        "aborrecido.",
        "apavorado/desesperado."
      ],
      correta: 3
    },
    {
      id: 7,
      imagem: img5d4facil,
      enunciado: "De acordo com esse texto, constata-se que o personagem pratica atividades:",
      alternativas: [
        "na academia.",
        "nas olimpíadas.",
        "no videogame.",
        "nos finais de semana."
      ],
      correta: 2
    },
    {
      id: 8,
      imagem: img6d4facil,
      enunciado: "De acordo com o último quadrinho desse texto, o menino:",
      alternativas: [
        "achou ruim o sabor do chá.",
        "piorou bruscamente do resfriado.",
        "sentiu um calafrio de frio.",
        "tomou todo o chá com alegria."
      ],
      correta: 0
    },
    {
      id: 9,
      imagem: img7d4facil,
      enunciado: "No último quadrinho desse texto, constata-se que as meninas:",
      alternativas: [
        "decidiram brincar no parque.",
        "fugiram com medo da aranha.",
        "procuraram outro lugar para lanchar.",
        "terminaram de comer o lanche."
      ],
      correta: 1
    },
    {
      id: 10,
      imagem: img8d4facil,
      enunciado: "Os textos acima são exemplos de linguagem:",
      alternativas: [
        "verbal.",
        "não verbal.",
        "mista.",
        "formal."
      ],
      correta: 1
    },
    {
      id: 11,
      imagem: img9d4facil,
      enunciado: "Na imagem, é possível observar três personagens em um bote furado. Qual provérbio melhor se relaciona com a mensagem trazida pelo texto?",
      alternativas: [
        "Não há bem que sempre dure, nem mal que nunca se acabe.",
        "Quem comprar o que não precisa, venderá o que precisa.",
        "Se sua casa pegar fogo, aproveite para se aquecer.",
        "O problema de um afeta a todos quando estão no mesmo barco."
      ],
      correta: 3
    }
  ],
  medio: [
    {
      id: 1,
      enunciado: "Leia o texto: 'Cerca de 70,5 milhões de brasileiros não possuem acesso à internet. Ampliar o acesso deve ser a maior prioridade dos governantes.' Qual trecho expressa a OPINIÃO do autor?",
      alternativas: [
        "Cerca de 70,5 milhões de brasileiros...",
        "...não possuem acesso à internet.",
        "Ampliar o acesso deve ser a maior prioridade...",
        "Brasileiros usam a internet."
      ],
      correta: 2
    },
    {
      id: 2,
      enunciado: "Leia o texto: 'O cachorro é descendente do lobo. Ele é o melhor amigo que um homem pode ter.' Onde se percebe um julgamento de valor (uma opinião)?",
      alternativas: [
        "O cachorro é descendente do lobo.",
        "Ele é o melhor amigo que um homem pode ter.",
        "O cachorro e o lobo são parentes.",
        "O homem tem um cachorro."
      ],
      correta: 1
    },
    {
      id: 3,
      enunciado: "Leia o texto: 'Aproveitando a baixa de preços, cada vez iam mais clientes às oficinas. Mas aquilo era um disparate, tanto maior quanto, descendo os preços, de dia para dia, chegou uma altura em que os bancos e as cadeiras eram dados.' A palavra destacada 'disparate' tem sentido de:",
      alternativas: [
        "absurdo.",
        "bobagem.",
        "brincadeira.",
        "problema."
      ],
      correta: 0
    }
  ],
  dificil: [
    {
      id: 1,
      enunciado: "Leia o trecho: 'Nossa geração toda precisa de psicólogo, porque a geração anterior também precisava, mas achava frescura.' Na oração, o emprego do conectivo 'porque' indica:",
      alternativas: [
        "causa.",
        "tempo.",
        "conclusão.",
        "explicação."
      ],
      correta: 3
    },
    {
      id: 2,
      enunciado: "No trecho: 'Os jovens têm impulsos de rebeldia quando começam a formar seus próprios valores. Todavia, com o passar dos anos, compreendem que os pais tinham razão...' A conjunção 'todavia' se contrapõe a qual ideia?",
      alternativas: [
        "À ideia de que nem sempre é fácil o entendimento entre os membros da família.",
        "À ideia de que os pais devem facilitar esse relacionamento.",
        "À ideia de que os jovens têm impulsos de rebeldia quando começam a formar seus próprios valores.",
        "À ideia de que é compreensível e natural que jovens tenham visões diferentes."
      ],
      correta: 2
    },
    {
      id: 3,
      enunciado: "Expressões textuais como 'primeiramente', 'em seguida', 'por fim' e 'finalmente' são recursos coesivos que têm como função principal:",
      alternativas: [
        "opor ideias ao longo do texto.",
        "indicar conclusão ou consequência de uma ideia apresentada.",
        "organizar sequencialmente as ideias e marcar a progressão textual.",
        "explicar um conceito apresentado anteriormente no texto."
      ],
      correta: 2
    }
  ]
};

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